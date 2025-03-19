"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import "@/css/smallSidebar.css";
import logo from '@/assets/logo.png';
import userIcon from '@/assets/user.png'; // User icon
import signout from '@/assets/signout.png';
import { useAuth } from '@/context/AuthContext';
import ChatList from './ChatList';
import { MenuIcon } from 'lucide-react';
import { MessageSquareText, FileText, CalendarDays, SquarePen, Rocket,NotebookPen } from "lucide-react";
import LessonList from './LessonList';
import QuizList from './QuizList';
import UserModal from './UserModal';

const SmallSidebar = () => {
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // New state for UserModal

  const userIconRef = useRef(null); // Ref for the user icon
  const logoutRef = useRef(null); // Ref for the logout menu

  const { signOut, showMenu, setShowMenu, showComponent, setShowComponent } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  const handleClick = (component) => {
    setShowComponent(component);
  };
  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(event.target)
      ) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);


  return (
    <>
      {/* Menu button to toggle small sidebar */}
      {!showComponent && (<div className="smallMenu">
        <MenuIcon onClick={() => handleClick(!showComponent)} />
        <Image src={logo} width={60} height={60} alt="Logo" />
        <h2>Ivy AI Tutor</h2>
      </div>)}

      {/* Conditionally render the sidebar content */}

      <div className="smmenu" style={{ display: showComponent ? 'flex' : 'none' }}>
        <div className="smsidebar">
          <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={logo} width={70} height={70} alt="Logo" priority />
          </div>
          <ul className='listModules'>
            <li className={pathname.startsWith('/dashboard/chat') ? "active" : ''}>
              <Link href="/dashboard/chat" onClick={() => handleClick("chat")}>
                <MessageSquareText alt="Chat" className="iconstyle" />
                Chat
              </Link>
            </li>
            <li className={pathname.startsWith('/dashboard/quiz') ? "active" : ''}>
              <Link href="/dashboard/quiz" onClick={() => handleClick("quiz")}>
                <FileText alt="Quiz" className="iconstyle" />
                Quiz
              </Link>
            </li>
            <li className={pathname.startsWith('/dashboard/lesson') ? "active" : ''}>
              <Link href="/dashboard/lesson" onClick={() => handleClick("lesson")}>
                <CalendarDays alt="Lesson" className="iconstyle" />
                Lesson
              </Link>
            </li>
            <li className={pathname.startsWith('/dashboard/skillup') ? "active" : ''}>
              <Link href="/dashboard/skillup" onClick={() => handleClick("skillup ")}>
                <Rocket alt="skillup" className="iconstyle" />
                SkillUp </Link>
            </li>
            <li className={pathname.startsWith('/dashboard/skillup') ? "active" : ''}>
              <Link href="/dashboard/resume" onClick={() => handleClick("resume ")}>
                {/* <Rocket alt="skillup" className="iconstyle" /> */}
                <NotebookPen alt="skillup" className="iconstyle" />
                Resume </Link>
            </li>
            {/* <li className={pathname.startsWith('/dashboard/writing') ? "active" : ''}>
                <Link href="/dashboard/writing" onClick={() => handleClick("writing")}>
                <SquarePen alt="Practice Lab" className="iconstyle" />
                  Writing
                </Link>
              </li> */}

            {/* Add more links as needed */}
          </ul>
          </div>
          {/* User Icon and Logout Link */}
          <div className="userSection">
            <div
              className="userIcon"
              ref={userIconRef}
              onClick={() => setShowLogout(!showLogout)}
            // onClick={toggleUserModal}        

            >
              <Image src={userIcon} width={30} height={30} alt="User" priority />
            </div>
            {showLogout && (
              <div ref={logoutRef} style={{ position: 'absolute', zIndex: 999, left: "50px", bottom: "100%" }}><UserModal onLogout={handleLogout} onClose={toggleUserModal} /></div>
            )}
            <div className="online"></div>
          </div>
        
          </div>

        {/* User Icon and Logout Link */}

        {/* Conditionally render ChatList or other components based on pathname */}
        {pathname.startsWith("/dashboard/chat") && <ChatList btnName="chat" />}
        {pathname.startsWith("/dashboard/quiz") && <QuizList btnName="quiz" />}
        {pathname.startsWith("/dashboard/lesson") && <LessonList btnName="lesson" />}
      </div>



    </>
  );
};

export default SmallSidebar;
