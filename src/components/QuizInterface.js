import React, { useState, useEffect, useRef } from 'react';
import styles from '@/css/Quiz.module.css';
import SmallSidebar from './SmallSidebar';
import ProgressBar from './ProgressBar';
import QuizOption from './QuizOption';
import { useQuiz } from '@/context/QuizContext';
import Error from './Error';
import { useParams, useRouter } from 'next/navigation';



const Quiz = () => {

  const {currentQuestionIndex, setCurrentQuestionIndex, selectedOption, setSelectedOption, userAnswers, setUserAnswers, questions, onSubmit, selectedTool}=useQuiz()
  const [error,setError]= useState(false);
  const { id } = useParams(); // Get the dynamic route param 'id'

  const currentQuestion = questions[currentQuestionIndex];

  // erase the user answer if the page refresh or quiz id changes from url
  useEffect(()=>{
    console.log(userAnswers)
    setCurrentQuestionIndex(0);
  },[id])
  
  // this function handle the next button on quiz
  const handleNext = () => {
    if (!selectedOption){
      setError(true)
      setTimeout(()=>{
        setError(false)
      },5000)
      return;
    };

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(updatedAnswers);


    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    } else {
      onSubmit(updatedAnswers);
    }
  };

  

  if (questions.length === 0) return <div style={{marginTop:"70px"}}>No questions available.</div>;


  

  return (
    <div className={styles.quizContainer}>
      <h1 style={{fontSize:"1.6rem"}}>{selectedTool}</h1>
      <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
      <div className={styles.questionContainer}>
        <h3 className={styles.questionText}>{currentQuestion.question}</h3>
        <QuizOption
          options={currentQuestion.options}
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
      </div>
      <button
        className={styles.nextButton}
        onClick={handleNext}
      >
        Next
      </button>
      {error && <Error message="Please select one of the given option"/>}
    </div>
  );
};

export default Quiz;
