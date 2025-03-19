"use client";
import { useParams } from 'next/navigation';
import LessonInterface from '@/components/LessonInterface';
import { useEffect, useState } from 'react';
import { useLesson } from '@/context/LessonContext';
import Loading from '@/components/Loading';
import Chat from '@/components/Chat';
import styles from '@/css/LessonStart.module.css';
import { ChevronLeft as AiOutlineArrowLeft } from 'lucide-react';
import { useQuiz } from '@/context/QuizContext';
import MovingIcon from '@/components/MovingEffectIcon';

const LessonIdLayout = ({ children }) => {
    const { id } = useParams(); // Get the dynamic route param 'id'
    const { getLessonData, loadingLesson } = useLesson();
    const {loadingQuiz}=useQuiz();
    const [isChatVisible, setIsChatVisible] = useState(true); // State for chat visibility
    const [showChat,setShowChat]=useState(true);

    // Set overflow styles for body and html
    document.documentElement.style.overflow = 'hidden'; // Applies to <html>
    document.body.style.overflow = 'hidden'; // Applies to <body>

    
    useEffect(() => {
        if (id) {
            getLessonData(id); // Fetch Lesson data by ID when the component mounts
        }
    }, [id]);

    // Function to handle media query change
    const mediaQuery = window.matchMedia('(max-width: 1100px)');

    useEffect(() => {
        const handleMediaChange = (e) => {
          if (e.matches) {
            // If media query matches (below 734px)
            setShowChat(false);
          } else {
            // If media query doesn't match (above 734px)
            setShowChat(true);
          }
        };
    
        // Attach the listener to the media query using addEventListener
        mediaQuery.addEventListener('change', handleMediaChange);
    
        // Initial check for sidebar visibility when the component mounts
        handleMediaChange(mediaQuery); // Check immediately on component mount
    
        // Clean up the event listener on component unmount
        return () => {
          mediaQuery.removeEventListener('change', handleMediaChange);
        };
      }, [mediaQuery]);

    if (loadingLesson) {
        return <Loading text='Please Wait...' />;
    }
    if(loadingQuiz){
        return <Loading text='Creating quiz based on lesson plan' />
      }

    return (
        <div style={{ display: 'flex', height: '100%', width:"100%" }}>
            <div style={{ width: '100%', display: 'flex' }}>
                {children}
                {showChat && 
                    <div className={styles.showChat} style={{ display:"flex", justifyContent:"center", alignItems:"center", position: !isChatVisible && "absolute", right:!isChatVisible && "5px", width:isChatVisible ? "1px" : "30px", height:"100%"}}>
                   
                    <MovingIcon showList={!isChatVisible} onTouch={()=>setIsChatVisible(!isChatVisible)}/>
                </div>
                }
            </div>
             
            <div style={{width: !isChatVisible && "100%", transform:!isChatVisible && "translateX(100%)", position:!isChatVisible && "absolute"}}  className={styles.chatsectiondiv}>
                <Chat />
            </div>
        </div>
    );
};

export default LessonIdLayout;
