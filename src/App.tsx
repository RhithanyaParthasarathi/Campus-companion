// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Using the correct components folder
import ProtectedRoute from './auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LostAndFoundPage from './pages/LostAndFoundPage';
import NotesHubPage from './pages/NotesHubPage';
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      {/* The Layout component now wraps ALL routes */}
      <Routes>
        <Route element={<Layout />}>
          {/* The login page is public but still uses the main header */}
          <Route path="/login" element={<LoginPage />} />

          {/* These routes are protected and require a user to be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/lost-and-found" element={<LostAndFoundPage />} />
            <Route path="/notes-hub" element={<NotesHubPage />} />
            <Route path="/borrow-lend" element={<MarketplacePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;