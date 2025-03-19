import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatInterface from './ChatInterface';
import { useClient } from '@/context/UserContext';

const MainInterFace = () => {
  
  const {activeItem,setActiveItem, activeSubItem, setActiveSubItem, isSidebarOpen, setIsSidebarOpen}=useClient();
  
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      
      <div className="main-content">
        {/* <Header toggleSidebar={toggleSidebar} /> */}
        <main>
          <ChatInterface activeSubItem={activeSubItem} />
        </main>
      </div>
      <style jsx>{`
        .app {
          display: flex;
          height: 100vh;
          background-color: white;
          width:100%;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        main {
          flex: 1;
          padding: 24px;
          overflow: auto;
        }
        @media (max-width: 768px) {
          .app {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

module.exports= MainInterFace;