import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MatchesPage } from "./pages/MatchesPage";
import { PlayersPage } from "./pages/PlayersPage";
import { TeamsPage } from "./pages/TeamsPage";
import { NewsPage } from "./pages/NewsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="*" element={<NotFoundPage />} />
              {/* <Route path="/lui" element={<div style={{ color:"red"}}> my name is Lui</div>}></Route> */}
            </Routes>
          </AnimatePresence>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
