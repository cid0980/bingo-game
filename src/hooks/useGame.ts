import { useState, useCallback, useRef } from "react";

const LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function shuffleGrid(): number[] {
  const nums = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

function countLines(grid: number[], marked: Set<number>): number {
  let count = 0;
  for (const line of LINES) {
    if (line.every((idx) => marked.has(grid[idx]))) {
      count++;
    }
  }
  return count;
}

function getCompletedLineIndices(grid: number[], marked: Set<number>): Set<number> {
  const indices = new Set<number>();
  for (const line of LINES) {
    if (line.every((idx) => marked.has(grid[idx]))) {
      line.forEach((idx) => indices.add(idx));
    }
  }
  return indices;
}

export function useGame(isHost: boolean) {
  const [grid, setGrid] = useState<number[]>(() => shuffleGrid());
  const [markedNumbers, setMarkedNumbers] = useState<Set<number>>(new Set());
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [myLines, setMyLines] = useState(0);
  const [opponentLines, setOpponentLines] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(isHost);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<"me" | "opponent" | null>(null);
  const [opponentGrid, setOpponentGrid] = useState<number[] | null>(null);
  const [toast, setToast] = useState<{ number: number; visible: boolean } | null>(null);
  const [playAgainRequested, setPlayAgainRequested] = useState<"me" | "opponent" | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameOverRef = useRef(false);
  const isHostRef = useRef(isHost);

  const showToast = useCallback((num: number) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ number: num, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));
      setTimeout(() => setToast(null), 300);
    }, 2000);
  }, []);

  const getCompletedIndices = useCallback(
    (targetGrid: number[], marked: Set<number>) => {
      return getCompletedLineIndices(targetGrid, marked);
    },
    []
  );

  const resetGame = useCallback(() => {
    const newGrid = shuffleGrid();
    setGrid(newGrid);
    setMarkedNumbers(new Set());
    setCalledNumbers([]);
    setMyLines(0);
    setOpponentLines(0);
    setIsMyTurn(isHostRef.current);
    setGameOver(false);
    setWinner(null);
    setOpponentGrid(null);
    setToast(null);
    setPlayAgainRequested(null);
    gameOverRef.current = false;
  }, []);

  const requestPlayAgain = useCallback(
    (sendToOpponent: (data: any) => void) => {
      if (playAgainRequested === "opponent") {
        resetGame();
        sendToOpponent({ type: "play-again-accept" });
      } else {
        setPlayAgainRequested("me");
        sendToOpponent({ type: "play-again-request" });
      }
    },
    [playAgainRequested, resetGame]
  );

  const receivePlayAgainRequest = useCallback(
    (sendToOpponent: (data: any) => void) => {
      if (playAgainRequested === "me") {
        resetGame();
        sendToOpponent({ type: "play-again-accept" });
      } else {
        setPlayAgainRequested("opponent");
      }
    },
    [playAgainRequested, resetGame]
  );

  const receivePlayAgainAccept = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const callNumber = useCallback(
    (num: number, sendToOpponent: (data: any) => void) => {
      if (gameOverRef.current) return;

      const newMarked = new Set(markedNumbers);
      newMarked.add(num);
      setMarkedNumbers(newMarked);
      setCalledNumbers((prev) => [...prev, num]);

      const myNewLines = countLines(grid, newMarked);
      setMyLines(myNewLines);

      sendToOpponent({ type: "call", number: num });

      if (myNewLines >= 5) {
        gameOverRef.current = true;
        setGameOver(true);
        setWinner("me");
        sendToOpponent({ type: "game-over", winner: "opponent", grid });
        return;
      }

      setIsMyTurn(false);
    },
    [markedNumbers, grid]
  );

  const receiveNumber = useCallback(
    (num: number) => {
      if (gameOverRef.current) return;

      const newMarked = new Set(markedNumbers);
      newMarked.add(num);
      setMarkedNumbers(newMarked);
      setCalledNumbers((prev) => [...prev, num]);

      const myNewLines = countLines(grid, newMarked);
      setMyLines(myNewLines);

      showToast(num);

      if (myNewLines >= 5) {
        gameOverRef.current = true;
        setGameOver(true);
        setWinner("me");
        return;
      }

      setIsMyTurn(true);
    },
    [markedNumbers, grid, showToast]
  );

  const receiveGameOver = useCallback(
    (data: { winner: "me" | "opponent"; grid: number[] }) => {
      gameOverRef.current = true;
      setGameOver(true);
      setWinner(data.winner);
      setOpponentGrid(data.grid);

      const newMarked = new Set(markedNumbers);
      const myNewLines = countLines(grid, newMarked);
      setMyLines(myNewLines);
    },
    [markedNumbers, grid]
  );

  const receiveOpponentLineCount = useCallback((count: number) => {
    setOpponentLines(count);
  }, []);

  const setOpponentGridData = useCallback((g: number[]) => {
    setOpponentGrid(g);
  }, []);

  return {
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
    requestPlayAgain,
    receivePlayAgainRequest,
    receivePlayAgainAccept,
    countLines: (g: number[], m: Set<number>) => countLines(g, m),
  };
}
