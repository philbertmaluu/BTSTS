import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MatchesPage } from "./pages/MatchesPage";
import { TeamsPage } from "./pages/TeamsPage";
import { NewsPage } from "./pages/NewsPage";
import TeamStandingsPage from "./pages/TeamStandings";
import { NotFoundPage } from "./pages/NotFoundPage";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Role-based protected route component
const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, hasAnyRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Dashboard layout wrapper
const DashboardLayoutWrapper = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/news" element={<NewsPage />} />

              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teamstandings" element={<TeamStandingsPage />} />

              {/* Dashboard routes (protected) */}
              <Route element={<DashboardLayoutWrapper />}>
                <Route path="/dashboard" element={<DashboardPage />} />

                <Route
                  path="/statistics"
                  element={<div>Statistics Page</div>}
                />
                <Route path="/scoring" element={<div>Scoring Page</div>} />
                <Route
                  path="/admin"
                  element={
                    <RoleProtectedRoute allowedRoles={["Admin"]}>
                      <AdminDashboard />
                    </RoleProtectedRoute>
                  }
                />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
