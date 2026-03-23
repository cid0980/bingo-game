import React, { useState, useEffect } from "react";

type RoomSetupProps = {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (roomId: string, name: string) => void;
  peerId: string;
  error: string;
  connected: boolean;
  initialRoomId: string;
};

const RoomSetup: React.FC<RoomSetupProps> = ({
  onCreateRoom,
  onJoinRoom,
  peerId,
  error,
  connected,
  initialRoomId,
}) => {
  const [joinId, setJoinId] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [mode, setMode] = useState<"select" | "create" | "join">(
    initialRoomId ? "join" : "select"
  );
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (initialRoomId) {
      setJoinId(initialRoomId);
      setMode("join");
    }
  }, [initialRoomId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareLink = () => {
    const base = window.location.origin + window.location.pathname;
    return `${base}?room=${peerId}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareLink());
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `🎮 Join my Bingo game!\n\nRoom ID: ${peerId}\nJoin here: ${getShareLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = `🎮 Join my Bingo game! Room ID: ${peerId}`;
    const url = getShareLink();
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = `🎮 Join my Bingo game!\nRoom ID: ${peerId}\n${getShareLink()}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = "Join my Bingo game!";
    const body = `Hey! Join my Bingo game.\n\nRoom ID: ${peerId}\nJoin here: ${getShareLink()}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (connected) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] bg-clip-text text-transparent mb-3">
            BINGO
          </h1>
          <p className="text-[#b2bec3] text-lg">2-Player Online Game</p>
        </div>

        <div className="bg-[#1a1d2e] rounded-2xl p-8 border border-[#2d3436] shadow-2xl">
          {mode === "select" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#b2bec3] uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={16}
                  className="w-full px-4 py-3 rounded-xl bg-[#232740] border border-[#2d3436] text-[#dfe6e9] placeholder-[#636e72] text-center text-lg focus:outline-none focus:border-[#6c5ce7] transition-colors"
                />
              </div>
              <button
                onClick={() => {
                  if (!username.trim()) return;
                  setMode("create");
                  onCreateRoom(username.trim());
                }}
                disabled={!username.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white font-bold text-lg hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🎮 Create Room
              </button>
              <button
                onClick={() => {
                  if (!username.trim()) return;
                  setMode("join");
                }}
                disabled={!username.trim()}
                className="w-full py-4 rounded-xl bg-[#232740] text-[#dfe6e9] font-bold text-lg border border-[#2d3436] hover:border-[#6c5ce7] transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🔗 Join Room
              </button>
            </div>
          )}

          {mode === "create" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-center">Create Room</h2>
              {peerId ? (
                <>
                  <p className="text-[#b2bec3] text-center text-sm">
                    Share this Room ID with your opponent:
                  </p>
                  <div className="flex items-center gap-2 bg-[#232740] rounded-xl p-3 border border-[#2d3436]">
                    <code className="flex-1 text-center text-lg font-mono text-[#00cec9] tracking-wider">
                      {peerId}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-lg bg-[#6c5ce7] text-white text-sm font-medium hover:bg-[#5a4bd1] transition-colors"
                    >
                      {copied ? "✓ Copied" : "📋 Copy ID"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-[#636e72] text-xs uppercase tracking-wider font-semibold text-center">
                      Share Invite Link
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#232740] border border-[#2d3436] text-[#dfe6e9] text-sm font-medium hover:border-[#6c5ce7] transition-colors"
                      >
                        <span>🔗</span>
                        <span>{linkCopied ? "Copied!" : "Copy Link"}</span>
                      </button>
                      <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={handleShareTelegram}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] text-sm font-medium hover:bg-[#0088cc]/20 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        <span>Telegram</span>
                      </button>
                      <button
                        onClick={handleShareTwitter}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] text-sm font-medium hover:bg-[#1DA1F2]/20 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>Twitter/X</span>
                      </button>
                      <button
                        onClick={handleShareEmail}
                        className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#636e72]/10 border border-[#636e72]/30 text-[#b2bec3] text-sm font-medium hover:bg-[#636e72]/20 transition-colors"
                      >
                        <span>📧</span>
                        <span>Share via Email</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[#b2bec3]">
                    <div className="w-2 h-2 rounded-full bg-[#fdcb6e] animate-pulse" />
                    <span className="text-sm">Waiting for opponent to join...</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 text-[#b2bec3]">
                  <div className="w-2 h-2 rounded-full bg-[#fdcb6e] animate-pulse" />
                  <span className="text-sm">Creating room...</span>
                </div>
              )}
              <button
                onClick={() => setMode("select")}
                className="text-[#636e72] text-sm hover:text-[#dfe6e9] transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {mode === "join" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-center">Join Room</h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#b2bec3] uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={16}
                  className="w-full px-4 py-3 rounded-xl bg-[#232740] border border-[#2d3436] text-[#dfe6e9] placeholder-[#636e72] text-center text-lg focus:outline-none focus:border-[#6c5ce7] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#b2bec3] uppercase tracking-wider">
                  Room ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#232740] border border-[#2d3436] text-[#dfe6e9] placeholder-[#636e72] text-center text-lg font-mono tracking-wider focus:outline-none focus:border-[#6c5ce7] transition-colors"
                />
              </div>
              <button
                onClick={() => {
                  if (joinId.trim() && username.trim()) onJoinRoom(joinId.trim(), username.trim());
                }}
                disabled={!joinId.trim() || !username.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00cec9] to-[#00b894] text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Join Game
              </button>
              <button
                onClick={() => {
                  setMode("select");
                  setJoinId("");
                }}
                className="text-[#636e72] text-sm hover:text-[#dfe6e9] transition-colors"
              >
                ← Back
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-[#ff7675]/10 border border-[#ff7675]/30 text-[#ff7675] text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSetup;
