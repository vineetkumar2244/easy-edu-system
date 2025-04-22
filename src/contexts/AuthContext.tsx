
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserRole = "teacher" | "student" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  class?: string; // For students
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole, studentClass?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("eduUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Mock authentication functions - would connect to backend in production
  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockUser: User = {
      id: Math.random().toString(36).substring(2),
      name: email.split('@')[0],
      email,
      role,
      class: role === "student" ? "6th" : undefined
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("eduUser", JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, studentClass?: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful signup
    const mockUser: User = {
      id: Math.random().toString(36).substring(2),
      name,
      email,
      role,
      class: studentClass
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("eduUser", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("eduUser");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
