import React from "react";

type GridProps = {
  grid: number[];
  markedNumbers: Set<number>;
  completedIndices: Set<number>;
  isMyTurn: boolean;
  gameOver: boolean;
  isOpponent: boolean;
  hidden: boolean;
  onCellClick: (num: number) => void;
  label: string;
};

const Grid: React.FC<GridProps> = ({
  grid,
  markedNumbers,
  completedIndices,
  isMyTurn,
  gameOver,
  isOpponent,
  hidden,
  onCellClick,
  label,
}) => {
  if (hidden) {
    return (
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-lg font-bold text-[#b2bec3]">{label}</h3>
        <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-2xl bg-[#232740] border border-[#2d3436] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-[#232740]/80" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <svg className="w-12 h-12 text-[#636e72]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            <span className="text-[#636e72] text-sm font-medium">Hidden until game ends</span>
          </div>
        </div>
      </div>
    );
  }

  const canClick = !isOpponent && isMyTurn && !gameOver;

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-lg font-bold text-[#b2bec3]">{label}</h3>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {grid.map((num, idx) => {
          const isMarked = markedNumbers.has(num);
          const isInLine = completedIndices.has(idx);
          const clickable = canClick && !isMarked;

          let cellClass =
            "w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center transition-all duration-200 select-none ";

          if (isMarked && isInLine) {
            cellClass += "bg-gradient-to-br from-[#00cec9] to-[#00b894] text-white shadow-lg shadow-[#00cec9]/30 scale-105 ";
          } else if (isMarked) {
            cellClass += "bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] text-white shadow-lg shadow-[#6c5ce7]/30 ";
          } else {
            cellClass += "bg-[#232740] text-[#dfe6e9] border border-[#2d3436] ";
          }

          if (clickable) {
            cellClass += "cursor-pointer hover:bg-[#2d3154] hover:border-[#6c5ce7] hover:scale-105 active:scale-95 ";
          } else if (!isOpponent && !gameOver && !isMyTurn) {
            cellClass += "cursor-not-allowed opacity-60 ";
          }

          return (
            <button
              key={idx}
              className={cellClass}
              onClick={() => {
                if (clickable) onCellClick(num);
              }}
              disabled={!clickable}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
