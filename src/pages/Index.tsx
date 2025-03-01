
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Play, Trophy, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center pt-20 pb-12 px-4 text-center min-h-[60vh]">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="animate-snake-move mb-6">
              <span className="text-6xl md:text-7xl">🐍</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 animate-slide-down">
              Welcome to <span className="text-primary">Snake World</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              Experience the classic Snake game reimagined for the modern web. Challenge yourself, compete globally, and become the Snake World champion!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              <Button size="lg" asChild className="gap-2 h-12 px-6">
                <Link to="/game">
                  <Play size={18} />
                  Play Now
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild className="gap-2 h-12 px-6">
                <Link to="/leaderboard">
                  <Trophy size={18} />
                  Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Game Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Classic Gameplay",
                  description: "Control the snake, eat food, and grow longer without hitting walls or yourself.",
                  icon: "🎮",
                },
                {
                  title: "Global Leaderboard",
                  description: "Compete with players around the world and see your rank on the global leaderboard.",
                  icon: "🏆",
                },
                {
                  title: "Progressive Difficulty",
                  description: "The game gets faster and more challenging as your score increases.",
                  icon: "📈",
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card p-6 flex flex-col items-center text-center animate-fade-in opacity-0"
                  style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join Snake World?
            </h2>
            <p className="text-muted-foreground mb-8">
              {isAuthenticated
                ? "Jump back into the game and set a new high score!"
                : "Create an account to track your progress and compete with players worldwide."}
            </p>
            <Button size="lg" asChild className="gap-2">
              {isAuthenticated ? (
                <Link to="/game">
                  Play Now <ArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/register">
                  Register Now <ArrowRight size={16} />
                </Link>
              )}
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border/40 py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Snake World. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
