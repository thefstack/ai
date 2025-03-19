"use client";
import { useQuiz } from '@/context/QuizContext';
import React from 'react'
import Loading from '@/components/Loading';
import style from "@/css/Dashboard.module.css"
import { useLesson } from '@/context/LessonContext';

const QuizPage = () => {

  const { loadingQuiz } = useQuiz();

  if(loadingQuiz){
    return <Loading text='Setting up the environment for quiz'/>
  }
  
  return (
      <div className={style.container}>
      <h1>Welcome to Quiz Section!</h1>

      <h3>Ready to test your knowledge? </h3>


      <div className={style.info}>
      <h5>Here&apos;s how you can get started:</h5>

      <p>- Click on <strong>&quot;New Quiz&quot;</strong> to choose from a variety of topics and start a new quiz!</p>

      <p>- If you&apos;d like to review your quiz, click on &quot;Past Quiz List on left side&quot; to see your previous quiz attempts and track your improvements over time.</p>
      
    <p>- Additionally, consider checking out our <strong>Chat</strong> section for clearing your doubts and deepening your understanding of each topic!</p>

      <p>- Don&apos;t forget to explore the <strong>Lesson Plan</strong> section to create personalized study plans that complement your quiz practice!</p>

      </div>

    </div>
  )
}

export default QuizPage
