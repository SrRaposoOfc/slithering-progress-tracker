
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

// Types
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Position = { x: number; y: number };
export type GameStatus = "READY" | "PLAYING" | "PAUSED" | "GAME_OVER";

type GameContextType = {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  gameStatus: GameStatus;
  speed: number;
  gridSize: { rows: number; cols: number };
  cellSize: number;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  changeDirection: (newDirection: Direction) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

// Constants
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];
const INITIAL_DIRECTION = "RIGHT";
const INITIAL_SPEED = 150; // ms
const GRID_SIZE = { rows: it(), cols: 20 };
const CELL_SIZE = 20; // px

function it(): number {
  // The grid is slightly taller than it is wide for aesthetic reasons
  return Math.floor(window.innerHeight * 0.75 / CELL_SIZE);
}

// Helper to generate random food position
const getRandomPosition = (snake: Position[], gridSize: { rows: number; cols: number }): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize.cols),
      y: Math.floor(Math.random() * gridSize.rows),
    };
    // Make sure the food doesn't appear on the snake
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  return newFood;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateHighScore } = useAuth();
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(user?.highScore || 0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("READY");
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gridSize = GRID_SIZE;
  const cellSize = CELL_SIZE;
  
  const gameInterval = useRef<number | null>(null);

  // Update high score when user changes
  useEffect(() => {
    if (user) {
      setHighScore(user.highScore);
    }
  }, [user]);

  // Game loop
  useEffect(() => {
    const moveSnake = () => {
      if (gameStatus !== "PLAYING") return;

      setDirection(nextDirection);
      setSnake(prevSnake => {
        // Calculate the new head position
        const head = prevSnake[0];
        let newHead: Position;

        switch (nextDirection) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Check for collisions with walls
        if (
          newHead.x < 0 ||
          newHead.x >= gridSize.cols ||
          newHead.y < 0 ||
          newHead.y >= gridSize.rows
        ) {
          // Game over due to wall collision
          endGame();
          return prevSnake;
        }

        // Check for collisions with self (except the tail which will move)
        for (let i = 0; i < prevSnake.length - 1; i++) {
          if (prevSnake[i].x === newHead.x && prevSnake[i].y === newHead.y) {
            // Game over due to self collision
            endGame();
            return prevSnake;
          }
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if snake eats food
        if (newHead.x === food.x && newHead.y === food.y) {
          // Snake grows (don't remove the tail)
          const newScore = score + 10;
          setScore(newScore);
          setFood(getRandomPosition(newSnake, gridSize));
          
          // Increase speed every 50 points
          if (newScore % 50 === 0) {
            setSpeed(prevSpeed => Math.max(prevSpeed - 10, 50)); // Min speed cap at 50ms
          }
        } else {
          // Snake moves (remove the tail)
          newSnake.pop();
        }

        return newSnake;
      });
    };

    if (gameStatus === "PLAYING") {
      // Clear any existing interval
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
      // Set new interval with current speed
      gameInterval.current = window.setInterval(moveSnake, speed);
    }

    return () => {
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    };
  }, [gameStatus, nextDirection, food, score, speed, gridSize]);

  // Handle game end
  const endGame = () => {
    setGameStatus("GAME_OVER");
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
      gameInterval.current = null;
    }
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      if (user) {
        updateHighScore(score);
      }
    }
  };

  // Game controls
  const startGame = () => {
    resetGame();
    setGameStatus("PLAYING");
  };

  const pauseGame = () => {
    if (gameStatus === "PLAYING") {
      setGameStatus("PAUSED");
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
        gameInterval.current = null;
      }
    }
  };

  const resumeGame = () => {
    if (gameStatus === "PAUSED") {
      setGameStatus("PLAYING");
    }
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPosition(INITIAL_SNAKE, gridSize));
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const changeDirection = (newDirection: Direction) => {
    // Prevent 180-degree turns
    if (
      (direction === "UP" && newDirection === "DOWN") ||
      (direction === "DOWN" && newDirection === "UP") ||
      (direction === "LEFT" && newDirection === "RIGHT") ||
      (direction === "RIGHT" && newDirection === "LEFT")
    ) {
      return;
    }
    
    setNextDirection(newDirection);
  };

  return (
    <GameContext.Provider
      value={{
        snake,
        food,
        direction,
        nextDirection,
        score,
        highScore,
        gameStatus,
        speed,
        gridSize,
        cellSize,
        startGame,
        pauseGame,
        resumeGame,
        resetGame,
        changeDirection,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
