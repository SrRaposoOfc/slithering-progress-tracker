
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type User = {
  id: string;
  username: string;
  email?: string;
  highScore: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  updateHighScore: (score: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock user database (using localStorage in this example)
const STORAGE_KEY = "snakeWorldUsers";
const CURRENT_USER_KEY = "snakeWorldCurrentUser";

const getUsers = (): Record<string, User & { password: string }> => {
  const usersData = localStorage.getItem(STORAGE_KEY);
  return usersData ? JSON.parse(usersData) : {};
};

const saveUsers = (users: Record<string, User & { password: string }>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for logged in user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = getUsers();
      const userRecord = Object.values(users).find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );

      if (!userRecord || userRecord.password !== password) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return false;
      }

      // Remove password before setting user
      const { password: _, ...userWithoutPassword } = userRecord;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userRecord.username}!`,
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, email?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = getUsers();
      
      // Check if username already exists
      if (Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase())) {
        toast({
          title: "Registration Failed",
          description: "Username already exists",
          variant: "destructive",
        });
        return false;
      }

      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        username,
        password,
        email,
        highScore: 0,
      };

      // Add to users
      users[newUser.id] = newUser;
      saveUsers(users);

      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Snake World, ${username}!`,
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const updateHighScore = (score: number) => {
    if (!user) return;

    // Only update if the new score is higher
    if (score > user.highScore) {
      // Update in state
      setUser({
        ...user,
        highScore: score,
      });

      // Update in localStorage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        ...user,
        highScore: score,
      }));

      // Update in users database
      const users = getUsers();
      if (users[user.id]) {
        users[user.id].highScore = score;
        saveUsers(users);
      }

      toast({
        title: "New High Score!",
        description: `You've achieved a new personal best: ${score}`,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateHighScore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
