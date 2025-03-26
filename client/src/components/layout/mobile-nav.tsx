import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Wallet2, BarChart3, Menu, X } from "lucide-react";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <nav className="px-2 pt-2 pb-4 space-y-1">
            <Link 
              href="/"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                isActive("/") 
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
          </nav>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-lg z-10">
        <div className="flex justify-around">
          <Link 
            href="/"
            className={cn(
              "flex flex-col items-center py-2",
              isActive("/") ? "text-primary" : "text-gray-500"
            )}
          >
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xs">Home</span>
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
          <Link 
            href="/reports"
            className={cn(
              "flex flex-col items-center py-2",
              isActive("/reports") ? "text-primary" : "text-gray-500"
            )}
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs">Reports</span>
          </Link>
        </div>
      </div>
    </>
  );
}
