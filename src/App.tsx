import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { SubjectListPage } from './pages/SubjectListPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { BooksPage } from './pages/BooksPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { SchedulePage } from './pages/SchedulePage';
import { TasjilPage } from './pages/TasjilPage';
import { PodcastsPage } from './pages/PodcastsPage';
import { AdhkarPage } from './pages/AdhkarPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressDashboardPage } from './pages/ProgressDashboardPage';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { CollaborationDetailPage } from './pages/CollaborationDetailPage';
import { MainLayout } from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectListPage />} />
          <Route path="/subjects/:id" element={<SubjectDetailPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/tasjil" element={<TasjilPage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/adhkar" element={<AdhkarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/progress" element={<ProgressDashboardPage />} />
          <Route path="/collaborations" element={<CollaborationsPage />} />
          <Route path="/collaborations/:id" element={<CollaborationDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
