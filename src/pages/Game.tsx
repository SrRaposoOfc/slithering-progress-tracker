
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Trophy, ArrowLeft } from "lucide-react";
import GameBoard from "@/components/GameBoard";
import Navbar from "@/components/Navbar";

const Game: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { score, highScore, gameStatus, startGame, pauseGame, resumeGame, resetGame } = useGame();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const handleActionButton = () => {
    switch (gameStatus) {
      case "READY":
      case "GAME_OVER":
        startGame();
        break;
      case "PLAYING":
        pauseGame();
        break;
      case "PAUSED":
        resumeGame();
        break;
    }
  };

  // Get action button text based on game status
  const getActionButtonText = () => {
    switch (gameStatus) {
      case "READY":
        return "Start Game";
      case "PLAYING":
        return "Pause";
      case "PAUSED":
        return "Resume";
      case "GAME_OVER":
        return "Play Again";
    }
  };

  // Get action button icon based on game status
  const getActionButtonIcon = () => {
    switch (gameStatus) {
      case "READY":
      case "GAME_OVER":
        return <Play size={16} />;
      case "PLAYING":
        return <Pause size={16} />;
      case "PAUSED":
        return <Play size={16} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-10 px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Snake World</h1>
              <p className="text-muted-foreground">
                Welcome, {user?.username}! Control the snake and eat to grow.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <span onClick={() => navigate("/")}>
                  <ArrowLeft size={14} className="mr-1" /> Back to Home
                </span>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <span onClick={() => navigate("/leaderboard")}>
                  <Trophy size={14} className="mr-1" /> Leaderboard
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Game Info and Controls */}
            <div className="w-full md:w-64 glass-card p-4 rounded-xl flex flex-col">
              {/* Score Display */}
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">Current Score</div>
                <div className="text-3xl font-bold">{score}</div>
                
                <div className="mt-4 text-sm text-muted-foreground mb-1">High Score</div>
                <div className="text-xl font-semibold text-primary">{highScore}</div>
              </div>

              {/* Game Controls */}
              <div className="flex flex-col gap-3">
                {/* Action Button */}
                <Button
                  onClick={handleActionButton}
                  size="lg"
                  className="w-full gap-2"
                  variant={gameStatus === "GAME_OVER" ? "default" : gameStatus === "PLAYING" ? "outline" : "default"}
                >
                  {getActionButtonIcon()}
                  {getActionButtonText()}
                </Button>

                {/* Reset Button - Only visible when game is in progress or paused */}
                {(gameStatus === "PLAYING" || gameStatus === "PAUSED") && (
                  <Button onClick={resetGame} variant="outline" size="lg" className="w-full gap-2">
                    <RotateCcw size={16} />
                    Reset Game
                  </Button>
                )}
              </div>

              {/* Controls Information */}
              <div className="mt-6 text-sm text-muted-foreground">
                <h3 className="font-medium mb-2">Controls:</h3>
                <ul className="space-y-1">
                  <li>↑ / W - Move Up</li>
                  <li>↓ / S - Move Down</li>
                  <li>← / A - Move Left</li>
                  <li>→ / D - Move Right</li>
                </ul>
                <p className="mt-2 text-xs">On mobile, swipe to change direction</p>
              </div>
            </div>

            {/* Game Board */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <GameBoard />
                
                {/* Game Status Overlay */}
                {gameStatus !== "PLAYING" && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-md">
                    <div className="text-center text-white p-4">
                      {gameStatus === "READY" && (
                        <>
                          <h2 className="text-2xl font-bold mb-2">Ready to Play?</h2>
                          <p className="mb-4">Press Start Game to begin!</p>
                        </>
                      )}
                      
                      {gameStatus === "PAUSED" && (
                        <>
                          <h2 className="text-2xl font-bold mb-2">Game Paused</h2>
                          <p className="mb-4">Current Score: {score}</p>
                        </>
                      )}
                      
                      {gameStatus === "GAME_OVER" && (
                        <>
                          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                          <p className="mb-1">Your Score: {score}</p>
                          <p className="mb-4">High Score: {highScore}</p>
                        </>
                      )}
                      
                      <Button 
                        onClick={handleActionButton}
                        size="lg"
                        className="gap-2"
                      >
                        {getActionButtonIcon()}
                        {getActionButtonText()}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
