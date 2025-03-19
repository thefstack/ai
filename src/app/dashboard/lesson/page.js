"use client";
import Loading from '@/components/Loading';
import { useLesson } from '@/context/LessonContext'
import React from 'react'
import style from "@/css/Dashboard.module.css"

const Lesson = () => {

  const {loadingLesson}=useLesson();

  if(loadingLesson){
    return <Loading text='Creating Your Lesson Plan'/>
  }
  return (
    <div className={style.container}>
      <h1>Welcome to the Lesson Planning Section!</h1>

      <h3>Start Your Lesson Journey:</h3>

      <div className={style.info}>
      <h5>Here&apos;s how you can get started:</h5>
      
      <p>- To begin, click on &quot;New Lesson&quot; and choose from the available options below. Once you&apos;ve made your selections, a customized lesson plan will be generated just for you!</p>

      <p>- If you&apos;d like to review your progress, click on <strong>&quot;Recent Lesson Plan&quot;</strong> to see your previous plan and track your improvements over time.</p>
      
      <p>- Additionally, consider checking out our <strong>Chat</strong> section for clearing your doubts and gaining deeper insights on any topic!</p>

      <p>- Don&apos;t forget to explore the <strong>Quiz</strong> section to test your knowledge and reinforce the concepts you learn in your lessons!</p>
      </div>

    </div>
  )
}

export default Lesson
