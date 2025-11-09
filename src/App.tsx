import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import DashboardLayout from "./components/layout/DashboardLayout";
import { FixturesPage } from "./pages/admin/FixturesPage";
import { MatchResultsPage } from "./pages/admin/MatchResultsPage";
import { TeamsPage2 } from "./pages/admin/TeamsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { VenuesPage } from "./pages/admin/VenuesPage";
import MatchResults from "./pages/MatchResults";
import { ProfilePage } from "./pages/profile";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Dashboard layout wrapper
const DashboardLayoutWrapper = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout />
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
              <Route path="/match-results" element={<MatchResults />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/teamstandings" element={<TeamStandingsPage />} />

              {/* Dashboard routes (protected) */}
              <Route element={<DashboardLayoutWrapper />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* <Route path="/dashboard/profile" element={<ProfilePage />} /> */}
                <Route path="/admin/teams" element={<TeamsPage2 />} />
                <Route path="/admin/fixtures" element={<FixturesPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/venues" element={<VenuesPage />} />
                <Route path="/profile" element={<ProfilePage />} /> 
                <Route
                  path="/admin/match-results"
                  element={<MatchResultsPage />}
                />
                {/* <Route path="/admin/users" element={<UsersPage />} /> */}

                <Route
                  path="/statistics"
                  element={<div>Statistics Page</div>}
                />
                <Route path="/scoring" element={<div>Scoring Page</div>} />
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
