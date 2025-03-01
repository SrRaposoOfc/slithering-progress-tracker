
import React, { useEffect } from "react";
import { useGame, Direction } from "@/context/GameContext";
import Snake from "./Snake";
import Food from "./Food";

const GameBoard: React.FC = () => {
  const { 
    gridSize,
    cellSize,
    gameStatus,
    changeDirection,
  } = useGame();

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "PLAYING") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          changeDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          changeDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          changeDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStatus, changeDirection]);

  // Handle touch controls
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (gameStatus !== "PLAYING") return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameStatus !== "PLAYING" || !touchStartX || !touchStartY) return;

      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      // Determine swipe direction based on the greatest difference
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 10) {
          changeDirection("LEFT");
        } else if (diffX < -10) {
          changeDirection("RIGHT");
        }
      } else {
        // Vertical swipe
        if (diffY > 10) {
          changeDirection("UP");
        } else if (diffY < -10) {
          changeDirection("DOWN");
        }
      }

      // Reset starting position
      touchStartX = 0;
      touchStartY = 0;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameStatus, changeDirection]);

  return (
    <div 
      className="relative bg-secondary border border-border rounded-md overflow-hidden shadow-soft"
      style={{ 
        width: gridSize.cols * cellSize,
        height: gridSize.rows * cellSize,
      }}
    >
      <Snake />
      <Food />

      {/* Mobile Control Overlay */}
      <div className="md:hidden absolute inset-0 z-10 opacity-0">
        {/* This is an invisible overlay for touch controls */}
      </div>
    </div>
  );
};

export default GameBoard;
