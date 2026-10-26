import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ExploreIssues } from './pages/ExploreIssues';
import { IssueDetails } from './pages/IssueDetails';
import { ReportIssue } from './pages/ReportIssue';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { MyReports } from './pages/MyReports';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminIssues } from './pages/AdminIssues';
import { NotFound } from './pages/NotFound';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/explore" element={<ExploreIssues />} />
                <Route path="/issues/:id" element={<IssueDetails />} />

                {/* Citizen Protected Routes */}
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <ReportIssue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute roleRequired="citizen">
                      <CitizenDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-reports"
                  element={
                    <ProtectedRoute roleRequired="citizen">
                      <MyReports />
                    </ProtectedRoute>
                  }
                />

                {/* Municipal Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/issues"
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <AdminIssues />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-All 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
