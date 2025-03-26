import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Expenses from "@/pages/expenses";
import Reports from "@/pages/reports";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { AuthProvider } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/auth/protected-route";

function AuthenticatedApp() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Switch>
            <Route path="/" component={() => <Redirect to="/dashboard" />} />
            <Route path="/dashboard">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Route>
            <Route path="/tasks">
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            </Route>
            <Route path="/expenses">
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            </Route>
            <Route path="/reports">
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthenticatedApp />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
