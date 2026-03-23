import React from "react";

type GameStatusProps = {
  isMyTurn: boolean;
  myLines: number;
  opponentLines: number;
  gameOver: boolean;
  winner: "me" | "opponent" | null;
  calledNumbers: number[];
  myName: string;
  opponentName: string;
  playAgainRequested: "me" | "opponent" | null;
  onPlayAgain: () => void;
};

const GameStatus: React.FC<GameStatusProps> = ({
  isMyTurn,
  myLines,
  opponentLines,
  gameOver,
  winner,
  calledNumbers,
  myName,
  opponentName,
  playAgainRequested,
  onPlayAgain,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      {!gameOver && (
        <div
          className={`p-4 rounded-2xl text-center font-bold text-lg border ${
            isMyTurn
              ? "bg-gradient-to-r from-[#6c5ce7]/20 to-[#a29bfe]/20 border-[#6c5ce7] text-[#a29bfe] animate-pulse-glow"
              : "bg-[#232740] border-[#2d3436] text-[#636e72]"
          }`}
        >
          {isMyTurn ? "🎯 Your Turn!" : `⏳ ${opponentName}'s Turn...`}
        </div>
      )}

      {gameOver && winner && (
        <div className="p-6 rounded-2xl text-center border animate-winner-pop bg-gradient-to-br from-[#232740] to-[#1a1d2e] border-[#2d3436]">
          <div className="text-4xl mb-2">{winner === "me" ? "🏆" : "😔"}</div>
          <div
            className={`text-2xl font-black ${
              winner === "me" ? "text-[#00cec9]" : "text-[#ff7675]"
            }`}
          >
            {winner === "me" ? "YOU WIN!" : "YOU LOSE!"}
          </div>
          <p className="text-[#b2bec3] text-sm mt-1">
            {winner === "me"
              ? "Congratulations! 🎉"
              : `${opponentName} wins this round!`}
          </p>
          <div className="mt-4">
            {playAgainRequested === "me" ? (
              <div className="flex items-center justify-center gap-2 text-[#fdcb6e]">
                <div className="w-2 h-2 rounded-full bg-[#fdcb6e] animate-pulse" />
                <span className="text-sm font-medium">Waiting for {opponentName}...</span>
              </div>
            ) : playAgainRequested === "opponent" ? (
              <div className="flex flex-col gap-2">
                <p className="text-[#00cec9] text-sm font-medium">
                  {opponentName} wants to play again!
                </p>
                <button
                  onClick={onPlayAgain}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00cec9] to-[#00b894] text-white font-bold text-base hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                  🎮 Accept & Play Again
                </button>
              </div>
            ) : (
              <button
                onClick={onPlayAgain}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white font-bold text-base hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                🔄 Play Again
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-[#1a1d2e] rounded-2xl p-4 border border-[#2d3436]">
        <h3 className="text-sm font-semibold text-[#636e72] uppercase tracking-wider mb-3">
          Lines Completed
        </h3>
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 text-center">
            <div className="text-3xl font-black text-[#00cec9]">{myLines}</div>
            <div className="text-xs text-[#b2bec3] mt-1 truncate max-w-[100px] mx-auto">
              {myName} (You)
            </div>
            <div className="mt-2 flex gap-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-colors ${
                    i < myLines ? "bg-[#00cec9]" : "bg-[#2d3436]"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-[#636e72] text-lg font-bold">VS</div>
          <div className="flex-1 text-center">
            <div className="text-3xl font-black text-[#ff7675]">
              {opponentLines}
            </div>
            <div className="text-xs text-[#b2bec3] mt-1 truncate max-w-[100px] mx-auto">
              {opponentName}
            </div>
            <div className="mt-2 flex gap-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-colors ${
                    i < opponentLines ? "bg-[#ff7675]" : "bg-[#2d3436]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1d2e] rounded-2xl p-4 border border-[#2d3436]">
        <h3 className="text-sm font-semibold text-[#636e72] uppercase tracking-wider mb-3">
          Called Numbers ({calledNumbers.length}/25)
        </h3>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
          {calledNumbers.length === 0 ? (
            <span className="text-[#636e72] text-sm">No numbers called yet</span>
          ) : (
            calledNumbers.map((num, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-lg bg-[#232740] text-[#dfe6e9] text-xs font-bold flex items-center justify-center border border-[#2d3436]"
              >
                {num}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
