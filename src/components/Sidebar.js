"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import "@/css/sidebar.css";
import logo from '@/assets/logo.png';
import userIcon from '@/assets/user.png'; // User icon
import signout from '@/assets/signout.png';
import { useAuth } from '@/context/AuthContext';
import ChatList from './ChatList';
import { MessageSquareText, FileText, CalendarDays, Rocket, SquarePen, LogOut, ChevronLeft, ChevronRight, NotebookPen } from "lucide-react";
import QuizList from './QuizList';
import LessonList from './LessonList';
import UserModal from './UserModal';
import MovingIcon from './MovingEffectIcon';

const Sidebar = () => {
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);
  const [showComponent, setShowComponent] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // New state for UserModal
  const [showList, setShowList] = useState(true);
  const [switchList, setSwitchList] = useState("")

  const { signOut } = useAuth()
  const userIconRef = useRef(null); // Ref for the user icon
  const logoutRef = useRef(null); // Ref for the logout menu




  const handleLogout = () => {
    signOut();
  };

  const handleClick = (c) => {
    setShowComponent(c)
  }

  const toggleUserModal = () => {
    setIsUserModalOpen(!isUserModalOpen);
  };

  const checkPathname = () => {
    if (pathname.startsWith("/dashboard/chat")) {
      setSwitchList("chat")
    } else if (pathname.startsWith("/dashboard/quiz")) {
      setSwitchList("quiz")
    } else if (pathname.startsWith("/dashboard/lesson")) {
      setSwitchList("lesson")
    } else {
      setSwitchList("")
    }
  }

  useEffect(() => {
    checkPathname()
  }, [pathname])

  useEffect(() => {
    setShowList(true)
  }, [switchList])

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
    <div className='menu' style={{ zIndex: 99 }}>
      <div className="sidebar">
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={logo} width={70} height={70} alt="Logo" priority />
          </div>

          <ul className='listModules'>
            <li className={pathname.startsWith('/dashboard/chat') ? "active" : ''}>
              <Link href="/dashboard/chat" onClick={() => handleClick("chat")}>
                <MessageSquareText alt="Chat" className="iconstyle" />
                Chat</Link>
            </li>
            <li className={pathname.startsWith('/dashboard/quiz') ? "active" : ''}>
              <Link href="/dashboard/quiz" onClick={() => handleClick("quiz")}>
                <FileText alt="Quiz" className="iconstyle" />
                Quiz</Link>
            </li>
            <li className={pathname.startsWith('/dashboard/lesson') ? "active" : ''}>
              <Link href="/dashboard/lesson" onClick={() => handleClick("lesson")}>
                <CalendarDays alt="Lesson" className="iconstyle" />
                Lesson</Link>
            </li>
            <li className={pathname.startsWith('/dashboard/skillup') ? "active" : ''}>
              <Link href="/dashboard/skillup" onClick={() => handleClick("skillup ")}>
                <Rocket alt="skillup" className="iconstyle" />
                SkillUp </Link>
            </li> 
           <li className={pathname.startsWith('/dashboard/resumedashboard') ? "active" : ''}>
              <Link href="/dashboard/resumedashboard" onClick={() => handleClick("resume ")}>
                <NotebookPen alt="skillup" className="iconstyle" />
                Resume </Link>
            </li>
            {/* <li className={pathname.startsWith('/dashboard/writing') ? "active" : ''}>
              <Link href="/dashboard/writing" onClick={() => handleClick("writing")}>
                <SquarePen alt="Practice Lab" className="iconstyle" />
                Open editor</Link>
            </li> */}
            {/* Add more links as needed */}
          </ul>
        </div>
        <div>
          {/* {isUserModalOpen && (
        <UserModal onClose={toggleUserModal} />
        )} */}
        </div>

        <div style={{ width: "100%", height: "30px" }}>
          {/* User Icon and Logout Link */}
          <div className="userSection">
            <div
              className="userIcon"
              ref={userIconRef}
              onClick={(event) => {
                event.preventDefault();
                setShowLogout(!showLogout);
              }}
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
      </div>

      <div style={{ transform: !showList ? "translateX(-200%)" : "", position: !showList ? "absolute" : "", zIndex: 10 }}>
        {switchList == "chat" && <ChatList btnName="chat" />}
        {switchList == "quiz" && <QuizList btnName="quiz" />}
        {switchList == "lesson" && <LessonList btnName="lesson" />}
      </div>

      {/* UserModal */}

      {switchList && <div style={{ position: "absolute", right: "-25px", height: "100vh", display: "flex", alignItems: "center" }}><MovingIcon showList={showList} onTouch={() => { setShowList(!showList) }} /></div>}

    </div>
  );
};

export default Sidebar;
