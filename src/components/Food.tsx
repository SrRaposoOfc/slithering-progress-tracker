
import React from "react";
import { useGame } from "@/context/GameContext";

const Food: React.FC = () => {
  const { food, cellSize } = useGame();
  
  return (
    <div
      className="absolute snake-food"
      style={{
        width: cellSize - 4,
        height: cellSize - 4,
        left: food.x * cellSize + 2,
        top: food.y * cellSize + 2,
      }}
    />
  );
};

export default Food;
