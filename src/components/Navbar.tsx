
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Trophy, Home, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-bold flex items-center gap-2 text-primary hover:opacity-90 transition-opacity"
        >
          <span className="text-2xl">🐍</span>
          <span className="tracking-tight">Snake World</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" icon={<Home size={16} />} active={location.pathname === "/"}>
            Home
          </NavLink>
          <NavLink to="/game" icon={<Menu size={16} />} active={location.pathname === "/game"}>
            Play
          </NavLink>
          <NavLink 
            to="/leaderboard" 
            icon={<Trophy size={16} />} 
            active={location.pathname === "/leaderboard"}
          >
            Leaderboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <span className="text-sm text-muted-foreground">
                  Hi, <span className="font-medium text-foreground">{user?.username}</span>
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center gap-2" asChild>
                    <Link to="/game">
                      <Menu size={16} />
                      <span>Play Game</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2" asChild>
                    <Link to="/leaderboard">
                      <Trophy size={16} />
                      <span>Leaderboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon?: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, active, children }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default Navbar;
