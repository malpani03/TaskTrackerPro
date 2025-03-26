import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Small delay to avoid navigation issues
    const timer = setTimeout(() => {
      if (!isLoading && !isAuthenticated && !user) {
        navigate("/login");
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    ); // Will redirect in the useEffect
  }

  return <>{children}</>;
}