"use client";

import LessonInterface from '@/components/LessonInterface';

import { useLesson } from '@/context/LessonContext';
import Loading from '@/components/Loading';


const QuizDetailPage = () => {

  const {getLessonData, loadingLesson}=useLesson();

  if(loadingLesson){
    return <Loading text='Please Wait...'/>
  }


  return (
    <div style={{ display: 'flex', height: '100%', width:"100%" }}>
      
      <div style={{ width: '100%'}}>
        {!loadingLesson ? <LessonInterface/> : <Loading/>}
      </div>
    </div>
  );
};

export default QuizDetailPage;
