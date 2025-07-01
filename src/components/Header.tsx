// src/components/Header.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After signing out, Firebase's onAuthStateChanged will trigger,
      // and our ProtectedRoute will automatically redirect to /login.
      // But we can also navigate manually for a faster user experience.
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-placeholder"></div>
        <h1>Campus Companion</h1>
      </div>

      <div className="header-right">
        <button className="menu-button" onClick={toggleMenu}>
          {/* SVG for the three dots (more_vert icon) */}
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>

        {isMenuOpen && (
          <div className="dropdown-menu">
            <Link to="/contact" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link to="/about" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <button className="dropdown-item logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;