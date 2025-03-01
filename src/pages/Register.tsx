
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;
    
    // Username validation
    if (!username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (username.length > 20) {
      errors.username = "Username must be less than 20 characters";
      isValid = false;
    }
    
    // Email validation (optional)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await register(username, password, email || undefined);
      if (success) {
        // Redirect to game
        navigate("/game");
      } else {
        // Error is handled by the auth context (toast)
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in">
          <Card className="glass-card border-primary/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Register to track your scores and compete globally
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                    {formError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.username && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.username}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Used for account recovery (optional)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.password && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline focus:outline-none focus:underline">
                    Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Register;
