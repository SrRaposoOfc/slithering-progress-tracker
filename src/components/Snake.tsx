
import React from "react";
import { useGame } from "@/context/GameContext";

const Snake: React.FC = () => {
  const { snake, direction, cellSize } = useGame();
  
  return (
    <>
      {snake.map((segment, index) => {
        const isHead = index === 0;
        
        // Determine snake segment rotation for the head
        let rotation = "rotate-0";
        if (isHead) {
          switch (direction) {
            case "UP":
              rotation = "rotate-0";
              break;
            case "DOWN":
              rotation = "rotate-180";
              break;
            case "LEFT":
              rotation = "-rotate-90";
              break;
            case "RIGHT":
              rotation = "rotate-90";
              break;
          }
        }
        
        return (
          <div
            key={`${segment.x}-${segment.y}`}
            className={`absolute snake-segment ${
              isHead ? "snake-head" : "snake-body"
            } transition-all duration-100`}
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
              left: segment.x * cellSize + 1,
              top: segment.y * cellSize + 1,
              borderRadius: isHead ? "4px" : index === snake.length - 1 ? "4px" : "2px",
            }}
          >
            {isHead && (
              <div className={`flex items-center justify-center h-full w-full ${rotation}`}>
                <div className="flex items-center justify-between w-3/5">
                  <div className="bg-white/70 rounded-full w-1.5 h-1.5"></div>
                  <div className="bg-white/70 rounded-full w-1.5 h-1.5"></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Snake;
