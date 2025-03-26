import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => 
      apiRequest({ 
        url: "/api/auth/user", 
        method: "GET" 
      }).catch(() => null),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return apiRequest({
        url: "/api/auth/login",
        method: "POST",
        data: credentials,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], data);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest({
        url: "/api/auth/logout",
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 100);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      return apiRequest({
        url: "/api/auth/register",
        method: "POST",
        data: credentials,
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      });
      navigate("/login");
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const register = async (username: string, password: string) => {
    await registerMutation.mutateAsync({ username, password });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
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