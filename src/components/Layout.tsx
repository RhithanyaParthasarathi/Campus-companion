// src/components/Layout.tsx

import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { useUIStore } from '../stores/uiStore';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Layout = () => {
  const location = useLocation();
  const showModal = useUIStore((state) => state.showModal);
  const [user] = useAuthState(auth);

  const handleFabClick = () => {
    if (location.pathname.includes('/lost-and-found')) {
      showModal('lostAndFound');
    }
  };

  return (
    // A simple fragment <> now wraps everything
    <>
      {/* Header is now a direct child, allowing it to be fixed */}
      <Header />
      
      {/* The content-container now only holds the main content */}
      <div className="content-container">
        <main className="app-main">
          <Outlet />
        </main>

        {/* The FAB is now inside the content-container to be positioned relative to it */}
        {user && location.pathname !== "/" && (
          <button onClick={handleFabClick} className="fab">+</button>
        )}
      </div>
    </>
  );
};

export default Layout;