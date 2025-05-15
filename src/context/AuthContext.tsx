
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define user roles
export type UserRole = "customer" | "provider" | "admin";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: User[] = [
  { 
    id: "1", 
    name: "John Customer", 
    email: "customer@example.com", 
    role: "customer",
    avatar: "https://i.pravatar.cc/150?u=customer"
  },
  { 
    id: "2", 
    name: "Sarah Provider", 
    email: "provider@example.com", 
    role: "provider",
    avatar: "https://i.pravatar.cc/150?u=provider"
  },
  { 
    id: "3", 
    name: "Admin User", 
    email: "admin@example.com", 
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=admin"
  }
];

// Local storage key
const USER_STORAGE_KEY = 'app_users';
const CURRENT_USER_KEY = 'user';

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize users in localStorage if they don't exist
  useEffect(() => {
    const savedUsers = localStorage.getItem(USER_STORAGE_KEY);
    if (!savedUsers) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(MOCK_USERS));
      setUsers(MOCK_USERS);
    } else {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get users from localStorage
      const userList = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
      
      // Find user by email
      const foundUser = userList.find((u: User) => u.email === email);
      
      if (foundUser && password === "password") { // In a real app, you'd verify the password hash
        setUser(foundUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      // Get current users
      const currentUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
      
      // Check if email already exists
      if (currentUsers.some((u: User) => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser: User = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
      };
      
      // Add to users list and save to localStorage
      const updatedUsers = [...currentUsers, newUser];
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      // Set as current user
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      toast.success("Registration successful!");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
