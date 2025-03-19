"use client";
import Sidebar from '@/components/Sidebar';
import SmallSidebar from '@/components/SmallSidebar';
import { useAuth } from '@/context/AuthContext';
import Protected from '@/utils/Protected';
import { useEffect } from 'react';
import Error from '@/components/Error';
import { useUser } from '@/context/UserContext';

const DashboardLayout = ({ children }) => {
  const { showMenu, setShowMenu, setShowComponent,error } = useAuth();
   

  useEffect(() => {
    // Function to handle media query change
    const mediaQuery = window.matchMedia('(max-width: 734px)');

    const handleMediaChange = (e) => {
      if (e.matches) {
        // If media query matches (below 734px)
        setShowMenu(false);
      } else {
        // If media query doesn't match (above 734px)
        setShowMenu(true);
        setShowComponent(false);
      }
    };

    // Set overflow styles for body and html
   document.documentElement.style.overflow = 'hidden'; // Applies to <html>
   document.body.style.overflow = 'hidden'; // Applies to <body>

    // Attach the listener to the media query using addEventListener
    mediaQuery.addEventListener('change', handleMediaChange);

    // Initial check for sidebar visibility when the component mounts
    handleMediaChange(mediaQuery); // Check immediately on component mount

    // Clean up the event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [setShowMenu, setShowComponent]);

  return (
    <Protected>
      <div style={{ display: 'flex', height: '100%', minHeight: '100vh',}}>
        {showMenu ? <Sidebar /> : <div><SmallSidebar /></div>} {/* Sidebar will only be rendered when visible */}
        <main style={{ width: '100%' }}>
          {children} {/* This will render the chat list or chat details */}
        </main>
      </div>
    </Protected>
  );
};

export default DashboardLayout;
