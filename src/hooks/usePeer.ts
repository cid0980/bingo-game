import { useState, useEffect, useRef, useCallback } from "react";
import Peer, { DataConnection } from "peerjs";

type MessageHandler = (data: any) => void;

export function usePeer() {
  const [peerId, setPeerId] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState<string>("");
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const handlerRef = useRef<MessageHandler | null>(null);

  const setMessageHandler = useCallback((handler: MessageHandler) => {
    handlerRef.current = handler;
  }, []);

  const sendData = useCallback((data: any) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send(data);
    }
  }, []);

  const setupConnection = useCallback((conn: DataConnection) => {
    connRef.current = conn;
    conn.on("open", () => {
      setConnected(true);
    });
    conn.on("data", (data: unknown) => {
      if (handlerRef.current) {
        handlerRef.current(data);
      }
    });
    conn.on("close", () => {
      setConnected(false);
    });
    conn.on("error", (err) => {
      setError(err.message || "Connection error");
    });
  }, []);

  const createRoom = useCallback(() => {
    setError("");
    const id = "bingo-" + Math.random().toString(36).substring(2, 8);
    const peer = new Peer(id);
    peerRef.current = peer;

    peer.on("open", (assignedId) => {
      setPeerId(assignedId);
      setIsHost(true);
    });

    peer.on("connection", (conn) => {
      setupConnection(conn);
    });

    peer.on("error", (err) => {
      setError(err.message || "Peer error");
    });
  }, [setupConnection]);

  const joinRoom = useCallback(
    (roomId: string) => {
      setError("");
      const peer = new Peer();
      peerRef.current = peer;

      peer.on("open", () => {
        setIsHost(false);
        const conn = peer.connect(roomId, { reliable: true });
        setupConnection(conn);
      });

      peer.on("error", (err) => {
        setError(err.message || "Failed to connect");
      });
    },
    [setupConnection]
  );

  useEffect(() => {
    return () => {
      if (connRef.current) connRef.current.close();
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  return {
    peerId,
    connected,
    isHost,
    error,
    createRoom,
    joinRoom,
    sendData,
    setMessageHandler,
  };
}
