"use client";
import ReactMarkdown from 'react-markdown';
import { useParams, useRouter } from 'next/navigation';
import { useLesson } from '@/context/LessonContext';
import styles from '@/css/LessonPlanView.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { MoveRight } from 'lucide-react';
import { useQuiz } from '@/context/QuizContext';
import rehypeRaw from 'rehype-raw';

const Page = () => {
  const { id, planId } = useParams();
  const { lessonPlanView, getPlanView, lessonDetails, markAsComplete, lessonRes } = useLesson();
  const {createNewQuizBasedOnLessonPlan}=useQuiz();
  const hasFetched = useRef(false); // Track if fetch is already done
  const [fetched,setFetched]=useState(false);
  const router = useRouter();

  // Set overflow styles for body and html
  document.documentElement.style.overflow = 'hidden'; // Applies to <html>
  document.body.style.overflow = 'hidden'; // Applies to <body>


  const handleNext = () => {
    let numPlanId = parseInt(planId) + 1;
    console.log(numPlanId)
    if (numPlanId > lessonDetails.totalDays) {
      return;
    } else {
      router.push(`/dashboard/lesson/${id}/plan/${numPlanId}`)
    }
  }

  const handlePrevious = () => {
    let numPlanId = parseInt(planId) - 1;
    console.log(numPlanId)
    if (numPlanId <= 0) {
      return;
    } else {
      router.push(`/dashboard/lesson/${id}/plan/${numPlanId}`)
    }
  }

  const getPlanData=async()=>{
    if (!hasFetched.current) {
      await getPlanView(id, planId - 1); // Start streaming the lesson plan
      setFetched(true);
      hasFetched.current = true; // Set to true after fetching
    }
  }

  

  useEffect(() => {
    setFetched(false)
    getPlanData()
  }, [planId]); // Only re-run if planId changes

  return (
    <div className={styles.container}>
       <div className={styles.navigation}>
        <button className={styles.navbutton} onClick={handlePrevious}>‹ Previous</button>
        <button className={styles.navbutton} onClick={handleNext}>Next ›</button>
      </div>
      <div className={styles.dummyText}>
      <ReactMarkdown
  rehypePlugins={[rehypeRaw]} // Enables raw HTML rendering
  components={{
    // Customize specific tag rendering if needed
    a: ({ node, ...props }) => <a style={{ color: 'green' }} {...props} />,
  }}
>
   {lessonPlanView}
</ReactMarkdown>
      </div>
      {lessonPlanView=="" && <div class="loader"></div>}
      
      {fetched && <div style={{display:"flex", flexDirection:"column", gap:"8px"}}> 
      
      { lessonRes && lessonRes.lessonPlan.dayByDayPlan[planId-1].isCompleted == false 
        ?
        <button onClick={(e) => { e.preventDefault(); markAsComplete(lessonDetails.lessonId, lessonRes.lessonPlan.dayByDayPlan[planId-1]._id ) }} className={styles.LessonCompleteButton}>Mark as Complete</button>
        :
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button onClick={(e) => { e.preventDefault(); createNewQuizBasedOnLessonPlan(lessonRes.lessonPlan.dayByDayPlan[planId-1].keyConceptsToBeCovered, 10, lessonDetails,lessonRes.lessonPlan.dayByDayPlan[planId-1].module,lessonRes) }} className={styles.startQuizBtn}>You have unlocked a quiz! Start now <MoveRight /></button>
        </div>
      }


      <div className={styles.navigation}>
        <button className={styles.navbutton} onClick={handlePrevious}>‹ Previous</button>
        <button className={styles.navbutton} onClick={handleNext}>Next ›</button>
      </div>
      </div>}
    </div>
  );
};

export default Page;
