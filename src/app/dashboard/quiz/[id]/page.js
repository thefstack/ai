"use client";
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import QuizInterface from '@/components/QuizInterface';
// import List from '@/components/List'; // Chat list component
import Loading from '@/components/Loading';
import { useQuiz } from '@/context/QuizContext';
import QuizReview from '@/components/QuizReview';
import { useLesson } from '@/context/LessonContext';

const QuizDetailPage = () => {
  const { id } = useParams(); // Get the dynamic route param 'id'
  const { getQuizData, loading, showQuiz,loadingQuiz,loadingReview } = useQuiz();
  const {loadingLesson}=useLesson();


  useEffect(() => {
    if (id) {
      getQuizData(id); // Fetch chat data by ID when the component mounts
    }
  }, [id]);

  if(loadingQuiz){
    return <Loading text='Setting up the environment for quiz'/>
  }
  if(loadingReview){
    return <Loading text='Evaluating your response'/>
  }
  if(loadingLesson){
    return <Loading text='Creating your lesson plan'/>
  }


  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Chat list on the left
      <div style={{ width: '180px', borderRight: '1px solid #ddd' }}>

      </div> */}
      {/* Chat interface on the right */}
      <div style={{ width: '100%'}}>
        {loading ? (
          <Loading text='Please Wait ....'/>
        ) : (
          showQuiz ? <QuizInterface />: <QuizReview/>
        )}
      </div>
    </div>
  );
};

export default QuizDetailPage;
