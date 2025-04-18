import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Wallet2, BarChart3, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="bg-white shadow md:w-64 w-full md:min-h-screen md:flex md:flex-col hidden">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
          </svg>
          TaskFlow
        </h1>
      </div>
      
      {isAuthenticated && user && (
        <div className="p-4 border-b">
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
      
      <nav className="flex-1 p-4 space-y-2">
        <Link 
          href="/dashboard"
          className={cn(
            "block px-4 py-2 rounded-md font-medium flex items-center",
            isActive("/dashboard") || isActive("/") 
              ? "bg-indigo-50 text-primary" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
        <Link 
          href="/tasks"
          className={cn(
            "block px-4 py-2 rounded-md font-medium flex items-center",
            isActive("/tasks") 
              ? "bg-indigo-50 text-primary" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <CheckSquare className="h-5 w-5 mr-3" />
          Tasks
        </Link>
        <Link 
          href="/expenses"
          className={cn(
            "block px-4 py-2 rounded-md font-medium flex items-center",
            isActive("/expenses") 
              ? "bg-indigo-50 text-primary" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Wallet2 className="h-5 w-5 mr-3" />
          Expenses
        </Link>
        <Link 
          href="/reports"
          className={cn(
            "block px-4 py-2 rounded-md font-medium flex items-center",
            isActive("/reports") 
              ? "bg-indigo-50 text-primary" 
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <BarChart3 className="h-5 w-5 mr-3" />
          Reports
        </Link>
      </nav>
      
      <div className="p-4 border-t">
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium flex items-center"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        ) : (
          <Link 
            href="/login"
            className="block w-full px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium flex items-center"
          >
            <User className="h-5 w-5 mr-3" />
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}
