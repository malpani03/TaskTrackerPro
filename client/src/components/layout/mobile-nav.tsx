import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Wallet2, BarChart3, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      {/* Mobile Navigation Header */}
      <div className="md:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            TaskFlow
          </h1>
          <button
            className="text-gray-600"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu (Toggleable) */}
        <div className={cn("border-t", isMenuOpen ? "block" : "hidden")}>
          {isAuthenticated && user && (
            <div className="px-4 py-3 border-b">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 mr-3 flex items-center justify-center text-primary">
                  <span className="text-sm font-medium">{user.username.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{user.username}</p>
                  <p className="text-xs text-gray-500">Logged in</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="px-2 pt-2 pb-4 space-y-1">
            <Link 
              href="/dashboard"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive("/dashboard") || isActive("/") 
                  ? "bg-indigo-50 text-primary" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link 
              href="/tasks"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive("/tasks") 
                  ? "bg-indigo-50 text-primary" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <CheckSquare className="h-5 w-5 mr-3" />
              Tasks
            </Link>
            <Link 
              href="/expenses"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive("/expenses") 
                  ? "bg-indigo-50 text-primary" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Wallet2 className="h-5 w-5 mr-3" />
              Expenses
            </Link>
            <Link 
              href="/reports"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive("/reports") 
                  ? "bg-indigo-50 text-primary" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Reports
            </Link>
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium flex items-center text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-3" />
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-lg z-10">
        <div className="flex justify-around">
          <Link 
            href="/dashboard"
            className={cn(
              "flex flex-col items-center py-2",
              isActive("/dashboard") || isActive("/") ? "text-primary" : "text-gray-500"
            )}
          >
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link 
            href="/tasks"
            className={cn(
              "flex flex-col items-center py-2",
              isActive("/tasks") ? "text-primary" : "text-gray-500"
            )}
          >
            <CheckSquare className="h-6 w-6" />
            <span className="text-xs">Tasks</span>
          </Link>
          <Link 
            href="/expenses"
            className={cn(
              "flex flex-col items-center py-2",
              isActive("/expenses") ? "text-primary" : "text-gray-500"
            )}
          >
            <Wallet2 className="h-6 w-6" />
            <span className="text-xs">Expenses</span>
          </Link>
          {isAuthenticated ? (
            <Link
              href="#" 
              onClick={(e) => { e.preventDefault(); handleLogout(); }}
              className="flex flex-col items-center py-2 text-gray-500"
            >
              <LogOut className="h-6 w-6" />
              <span className="text-xs">Logout</span>
            </Link>
          ) : (
            <Link 
              href="/login"
              className={cn(
                "flex flex-col items-center py-2",
                isActive("/login") ? "text-primary" : "text-gray-500"
              )}
            >
              <User className="h-6 w-6" />
              <span className="text-xs">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
