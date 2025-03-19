"use client"
import React from 'react'
import style from "@/css/Dashboard.module.css"

const dashboard = () => {
  return (
    <div className={style.container}>
      <h1>Welcome to the Ivy AI Tutor!</h1>

      <h3>Let&apos;s Get Started:</h3>

      <div className={style.info}>
      <p><h4><strong>Chat:</strong></h4> Ask questions or dive deeper into topics with our AI tutor. Get instant answers and clear your doubts!</p>
  <p><h4><strong>Quiz:</strong></h4> Challenge yourself! Take quizzes by viiting our <strong>&quot;Quiz&quot;</strong> section to test and strengthen your knowledge.</p>
  <p><h4><strong>Lesson:</strong></h4> Access personalized lessons designed to meet your learning goals and progress at your own pace.</p>

      {/* <p><h4>Writing :</h4> Practice and improve your writing skills.</p> */}
      </div>

    </div>
  )
}

export default dashboard
  