
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Medal, Trophy, User, Crown } from "lucide-react";
import { Link } from "react-router-dom";

// Type for leaderboard entry
type LeaderboardEntry = {
  id: string;
  username: string;
  highScore: number;
};

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    // Get all users from local storage
    const fetchLeaderboard = () => {
      setIsLoading(true);
      try {
        const usersData = localStorage.getItem("snakeWorldUsers");
        const users = usersData ? JSON.parse(usersData) : {};

        // Convert to array and sort by high score
        const leaderboardData = Object.values(users)
          .filter((user: any) => user.highScore > 0) // Only include users with scores
          .map((user: any) => ({
            id: user.id,
            username: user.username,
            highScore: user.highScore,
          }))
          .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.highScore - a.highScore);

        setLeaderboard(leaderboardData);

        // Find user's rank if logged in
        if (user) {
          const rank = leaderboardData.findIndex((entry: LeaderboardEntry) => entry.id === user.id);
          setUserRank(rank !== -1 ? rank + 1 : null);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    // Add a refresh interval
    const intervalId = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  // Helper function to get medal for top ranks
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 0: // First place
        return <Crown className="text-yellow-500" size={18} />;
      case 1: // Second place
        return <Medal className="text-gray-400" size={18} />;
      case 2: // Third place
        return <Medal className="text-amber-700" size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="text-primary" size={24} />
                Global Leaderboard
              </h1>
              <p className="text-muted-foreground mt-1">
                See the top Snake Masters from around the world
              </p>
            </div>

            <Button asChild>
              <Link to="/game">Play Game</Link>
            </Button>
          </div>

          {/* User's rank (if logged in) */}
          {user && userRank !== null && (
            <div className="mb-8 glass-card p-5 rounded-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">Your Ranking</h3>
                    <p className="text-muted-foreground text-sm">
                      {userRank > 100 ? "Outside top 100" : `#${userRank} on the leaderboard`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">High Score</div>
                  <div className="text-xl font-semibold">{user.highScore}</div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border/40 bg-secondary/40 flex items-center justify-between">
              <h2 className="font-semibold">Top Players</h2>
              <div className="text-right text-sm text-muted-foreground">
                {leaderboard.length} {leaderboard.length === 1 ? "player" : "players"}
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading leaderboard...</div>
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No scores recorded yet. Be the first to play!
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.id}
                    className={`flex items-center justify-between p-4 ${
                      user && entry.id === user.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8">
                        {getMedalIcon(index) || (
                          <span className="text-muted-foreground font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="font-medium">
                        {entry.username}
                        {user && entry.id === user.id && (
                          <span className="ml-2 text-xs text-primary">(You)</span>
                        )}
                      </div>
                    </div>
                    <div className="font-semibold">{entry.highScore}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Call to action */}
          <div className="mt-8 text-center">
            {!user ? (
              <div className="p-6 glass-card rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Want to join the leaderboard?</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account to track your high scores and compete globally!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild>
                    <Link to="/register">Create Account</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </div>
            ) : user.highScore === 0 ? (
              <div className="p-6 glass-card rounded-xl">
                <h3 className="text-lg font-semibold mb-2">You haven't played yet!</h3>
                <p className="text-muted-foreground mb-4">
                  Start playing now to get on the leaderboard.
                </p>
                <Button asChild>
                  <Link to="/game">Play Now</Link>
                </Button>
              </div>
            ) : (
              <div className="p-6 glass-card rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Think you can do better?</h3>
                <p className="text-muted-foreground mb-4">
                  Your high score: {user.highScore}. Challenge yourself to beat it!
                </p>
                <Button asChild>
                  <Link to="/game">Play Again</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
