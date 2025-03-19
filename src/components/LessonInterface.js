import React, { useState, useEffect, useRef } from 'react';
import styles from '@/css/LessonStart.module.css';
import ProgressBar from './ProgressBar';
import { useLesson } from '@/context/LessonContext';
import Loading from './Loading';
import Chat from './Chat';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { useQuiz } from '@/context/QuizContext';


const LessonInterface = () => {
  const { lessonPlan, loadingLesson, lessonDetails, markAsComplete, lessonRes } = useLesson();

  const { createNewQuizBasedOnLessonPlan, loadingQuiz } = useQuiz();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  const handleContinue = (category) => {
    setSelectedCategory(category);
    setSelectedCategory(category);
    setIsModalOpen(false);
  };
  const toggle = () => {
    const sidebardiv = document.getElementById('sidebardiv');
    sidebardiv.classList.toggle(styles['show']);
  };

  if (loadingLesson) {
    return <Loading text='loading lesson' />
  }




  return (
    <div className={styles.container}>

      <div className={styles.chatcontainerdiv}>

        <div className={styles.lessondiv}>
          <div style={{ padding: "0px 10px" }}>
            <p className={styles.titleplan}>{lessonDetails.selectedCategory}</p>
            <ProgressBar current={lessonDetails.completedDays || 0} total={lessonDetails.totalDays || 1} />

            <div className={styles.headerplan}>
              <p className={styles.headertext}>{lessonPlan.courseOverview}</p>
            </div>
            <div className={styles.lessonPlanInfo}>
              <div className={styles.leftSide}>
                <div className={styles.Selected}>
                  <h3>Selected Lesson</h3>
                  <p>{lessonDetails.selectedTitle}</p>
                </div>
                <div className={styles.Selected}>
                  <h3>Difficulty Level</h3>
                  <p>{lessonDetails.selectedDifficulty}</p>
                </div>
                <div className={styles.Selected}>
                  <h3>How Often</h3>
                  <p>{lessonDetails.selectedTime}</p>
                </div>
              </div>
              <div className={styles.rightSide}>
                <div className={styles.Selected}>
                  <h3>Start Date</h3>
                  <p>{lessonDetails.createdAt}</p>
                </div>
                <div className={styles.Selected}>
                  <h3>How Long</h3>
                  <p>{lessonDetails.selectedDays} Days</p>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.scheduleText}>Schedule</p>
          {
            lessonPlan.dayByDayPlan.map((items, index) => {
              return (
                <div className={styles.scheduleContainer} key={index}>
                  <p className={styles.dayText}>Day {items.day}</p>
                  <div className={styles.dynamicSchedule}>
                    <div className={styles.dynamicDataGenerate}>
                      <h3>
                        <p className={styles.topicText}>
                          {items.topic}{items.isCompleted && <p className={styles.LessonCompletedButton}>completed</p>}
                        </p>
                      </h3>
                      <p className={styles.topicText}>
                        {items.keyConceptsToBeCovered}
                      </p>
                    </div>
                    <div className={styles.btnGrp}>
                      <Link href={`${lessonDetails.lessonId}/plan/${items.day}`} className={styles.LessonViewButton}>View</Link>
                      {items.module ?
                        items.isCompleted == false &&
                        <button onClick={(e) => { e.preventDefault(); markAsComplete(lessonDetails.lessonId, items._id) }} className={styles.LessonCompleteButton}>Mark as Complete</button>
                        :
                        null
                      }
                    </div>

                  </div>

                  {items.isCompleted === true &&
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <button onClick={(e) => { e.preventDefault(); createNewQuizBasedOnLessonPlan(items.keyConceptsToBeCovered, 10, lessonDetails,items.module,lessonRes) }} className={styles.startQuizBtn}>You have unlocked a quiz! Start now <MoveRight /></button>
                    </div>
                  }

                </div>
              );
            })
          }

        </div>


      </div>

    </div>
  );
};

export default LessonInterface;
