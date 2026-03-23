import React, { useState, useEffect, useCallback, useRef } from "react";
import RoomSetup from "./components/RoomSetup";
import Grid from "./components/Grid";
import GameStatus from "./components/GameStatus";
import CallToast from "./components/CallToast";
import { usePeer } from "./hooks/usePeer";
import { useGame } from "./hooks/useGame";

function Confetti() {
  const colors = ["#6c5ce7", "#00cec9", "#fdcb6e", "#ff7675", "#a29bfe", "#00b894"];
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

const PeerContext = React.createContext<{
  sendData: (data: any) => void;
  setMessageHandler: (handler: (data: any) => void) => void;
}>({
  sendData: () => {},
  setMessageHandler: () => {},
});

function usePeerContext() {
  return React.useContext(PeerContext);
}

function GameScreen({
  isHost,
  myName,
  opponentName,
}: {
  isHost: boolean;
  myName: string;
  opponentName: string;
}) {
  const {
    grid,
    markedNumbers,
    calledNumbers,
    myLines,
    opponentLines,
    isMyTurn,
    gameOver,
    winner,
    opponentGrid,
    toast,
    playAgainRequested,
    callNumber,
    receiveNumber,
    receiveGameOver,
    receiveOpponentLineCount,
    setOpponentGridData,
    getCompletedIndices,
    countLines,
    requestPlayAgain,
    receivePlayAgainRequest,
    receivePlayAgainAccept,
  } = useGame(isHost);

  const { sendData, setMessageHandler } = usePeerContext();
  const markedRef = useRef(markedNumbers);
  const gridRef = useRef(grid);
  const gameOverRef = useRef(gameOver);

  useEffect(() => {
    markedRef.current = markedNumbers;
  }, [markedNumbers]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    setMessageHandler((data: any) => {
      if (data.type === "call") {
        receiveNumber(data.number);
      } else if (data.type === "game-over") {
        receiveGameOver(data);
      } else if (data.type === "line-count") {
        receiveOpponentLineCount(data.count);
      } else if (data.type === "grid-reveal") {
        setOpponentGridData(data.grid);
      } else if (data.type === "play-again-request") {
        receivePlayAgainRequest(sendData);
      } else if (data.type === "play-again-accept") {
        receivePlayAgainAccept();
      }
    });
  }, [setMessageHandler, receiveNumber, receiveGameOver, receiveOpponentLineCount, setOpponentGridData, receivePlayAgainRequest, receivePlayAgainAccept, sendData]);

  useEffect(() => {
    const myCurrentLines = countLines(grid, markedNumbers);
    sendData({ type: "line-count", count: myCurrentLines });
  }, [markedNumbers, grid, sendData, countLines]);

  useEffect(() => {
    if (gameOver) {
      sendData({ type: "grid-reveal", grid });
    }
  }, [gameOver, grid, sendData]);

  const handleCellClick = useCallback(
    (num: number) => {
      if (!isMyTurn || gameOver || markedNumbers.has(num)) return;
      callNumber(num, sendData);
    },
    [isMyTurn, gameOver, markedNumbers, callNumber, sendData]
  );

  const handlePlayAgain = useCallback(() => {
    requestPlayAgain(sendData);
  }, [requestPlayAgain, sendData]);

  const myCompletedIndices = getCompletedIndices(grid, markedNumbers);
  const opponentCompletedIndices = opponentGrid
    ? getCompletedIndices(opponentGrid, markedNumbers)
    : new Set<number>();

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {winner === "me" && <Confetti />}
      <CallToast toast={toast} opponentName={opponentName} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] bg-clip-text text-transparent">
            BINGO
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-10">
          <Grid
            grid={grid}
            markedNumbers={markedNumbers}
            completedIndices={myCompletedIndices}
            isMyTurn={isMyTurn}
            gameOver={gameOver}
            isOpponent={false}
            hidden={false}
            onCellClick={handleCellClick}
            label={`${myName}'s Grid (You)`}
          />

          <GameStatus
            isMyTurn={isMyTurn}
            myLines={myLines}
            opponentLines={opponentLines}
            gameOver={gameOver}
            winner={winner}
            calledNumbers={calledNumbers}
            myName={myName}
            opponentName={opponentName}
            playAgainRequested={playAgainRequested}
            onPlayAgain={handlePlayAgain}
          />

          <Grid
            grid={opponentGrid || Array.from({ length: 25 }, (_, i) => i + 1)}
            markedNumbers={markedNumbers}
            completedIndices={opponentCompletedIndices}
            isMyTurn={isMyTurn}
            gameOver={gameOver}
            isOpponent={true}
            hidden={!gameOver || !opponentGrid}
            onCellClick={() => {}}
            label={`${opponentName}'s Grid`}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const {
    peerId,
    connected,
    isHost,
    error,
    createRoom,
    joinRoom,
    sendData,
    setMessageHandler,
  } = usePeer();

  const [gameStarted, setGameStarted] = useState(false);
  const [hostValue, setHostValue] = useState(false);
  const [myName, setMyName] = useState("");
  const [opponentName, setOpponentName] = useState("Opponent");
  const nameExchangedRef = useRef(false);

  const initialRoomId = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("room") || "";
  }, []);

  useEffect(() => {
    if (connected && !nameExchangedRef.current) {
      nameExchangedRef.current = true;
      sendData({ type: "name-exchange", name: myName });
    }
  }, [connected, myName, sendData]);

  useEffect(() => {
    if (!gameStarted) {
      setMessageHandler((data: any) => {
        if (data.type === "name-exchange") {
          setOpponentName(data.name || "Opponent");
          if (!gameStarted) {
            setGameStarted(true);
            setHostValue(isHost);
          }
        }
      });
    }
  }, [gameStarted, isHost, setMessageHandler]);

  useEffect(() => {
    if (connected && !gameStarted) {
      const timer = setTimeout(() => {
        if (!gameStarted) {
          setGameStarted(true);
          setHostValue(isHost);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [connected, gameStarted, isHost]);

  const handleCreateRoom = useCallback(
    (name: string) => {
      setMyName(name);
      createRoom();
    },
    [createRoom]
  );

  const handleJoinRoom = useCallback(
    (roomId: string, name: string) => {
      setMyName(name);
      joinRoom(roomId);
    },
    [joinRoom]
  );

  if (!gameStarted) {
    return (
      <RoomSetup
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        peerId={peerId}
        error={error}
        connected={connected}
        initialRoomId={initialRoomId}
      />
    );
  }

  return (
    <PeerContext.Provider value={{ sendData, setMessageHandler }}>
      <GameScreen isHost={hostValue} myName={myName} opponentName={opponentName} />
    </PeerContext.Provider>
  );
}
