"use client";
import React, { useEffect, useState } from 'react';
import styles from '@/css/Modal.module.css';
import lessonplan from '@/assets/lessonplan.png';
import Image from 'next/image';
import LessonPlanCourse from './LessonPlanCourse';
import { useLesson } from '@/context/LessonContext';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';
import PlanExpiryModal from './PlanExpiryModal';
import axios from 'axios';
import { getAuthToken } from '@/utils/getAuthToken';
import InstitutionalPlan from './InstitutionalPlan';
import InstitutionalChoise from './InstitutionalChoise';
import FileModal from './FileModal';
import DifficultyModal from './DifficultyModal';
import FinalModal from './FinalModal';
import InstititionalFileModal from './InstitutionalFileModal';

const LessonPlanModal = ({ onClose, onContinue, type }) => {
  const { setIsLessonModalOpen, isLessonPlanOpen, setIsLessonPlanOpen, selected, setSelected, setIsNewModelOpen, isNewLessonOpen, setIsNewLessonOpen, isFileModal,setIsFileModal, isInstitutionalPlanOpen, setIsInstutionalPlanOpen,fileIds, setFileIds, isInstitutionalModal, setIsInstitutionalModal } = useLesson();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isPlanExpiryModalOpen, setIsPlanExpiryModalOpen] = useState(false);
  const [isDifficultyModal, setIsDifficultyModal]=useState(false);


  const {setIsModalOpen}=useQuiz();

  const router=useRouter();

  const handleBodyClick = async() => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const res=await axios.get(`/api/subscriptionPlan?action=checkLimit&type=${type}`,{headers: {
          Authorization: `Bearer ${token}`
      }})
    if(res.data.success){
      setSelected(!selected);
    setTimeout(() => {
      setIsInstutionalPlanOpen(false)
      setIsNewModelOpen(true);
      setIsLessonPlanOpen(true);
    }, 300);
    }else{
      setIsPlanExpiryModalOpen(true)
    }
      
    } catch (error) {
      console.log(error);
      setIsPlanExpiryModalOpen(true)
    }

    
  };
  const handleChoiseClick = async() => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const res=await axios.get(`/api/subscriptionPlan?action=checkLimit&type=${type}`,{headers: {
          Authorization: `Bearer ${token}`
      }})
    if(res.data.success){
      setSelected(!selected);
      setTimeout(() => {
      setIsNewModelOpen(true);
      setIsInstutionalPlanOpen(true)
    }, 300);
    }else{
      setIsPlanExpiryModalOpen(true)
    }
      
    } catch (error) {
      console.log(error);
      setIsPlanExpiryModalOpen(true)
    }

    
  };

  const handleDiagnosticsClick = async() => {

    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const res=await axios.get(`/api/subscriptionPlan?action=checkLimit&type=${type}`,{headers: {
          Authorization: `Bearer ${token}`
      }})
    if(res.data.success){
      
    // setShowComingSoon(true);
    // setTimeout(() => {
    //   setShowComingSoon(false);
    // }, 5000); // 5 seconds
    setIsModalOpen(true);
    router.push("/dashboard/quiz")
    }else{
      setIsPlanExpiryModalOpen(true)
    }
      
    } catch (error) {
      console.log(error);
      setIsPlanExpiryModalOpen(true)
    }

  };

  const handleFileContinue = async(fileId) => {
    setIsDifficultyModal(true)
    setIsFileModal(false)
    setIsInstitutionalModal(false)
    setFileIds(fileId)
  };

  const handleLessonPlanClose = () => {
    setIsLessonPlanOpen(false);
    setIsLessonModalOpen(false);
    setIsInstutionalPlanOpen(false)
    setIsFileModal(false)
  };

  useEffect(() => {
    setIsNewLessonOpen(true);
    
  }, []);

  return (
    isPlanExpiryModalOpen ? <PlanExpiryModal onClose={() => setIsPlanExpiryModalOpen(false)} type={type} />
    :
    <>
      {isNewLessonOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContentplan}>
            <div className={styles.header}>
              <h3 style={{ color: 'white', marginLeft: 'auto', marginRight: 'auto', marginBottom: "10px" }}>
                How would you like to proceed?
              </h3>
              <button className={styles.closeButton} onClick={onClose}>X</button>
            </div>

            {/* Container for side-by-side cards */}
            <div className={styles.cardContainer}>
              {/* Lesson Plan Box */}
              <div className={`${styles.bodymodal} ${selected ? styles.selected : ''}`} onClick={handleChoiseClick}>
                <Image src={lessonplan} width={100} height={100} alt="Assistant Logo" style={{ marginTop: 20 }} />
                <p className={styles.maintext}>Lesson Plan</p>
                <p className={styles.submaintext}>
                  Detailed blueprint provides guidance to deliver educational content effectively.
                </p>
              </div>

              {/* Diagnostics Plan Box */}
              <div className={styles.bodymodal} onClick={handleDiagnosticsClick}>
                <Image src={lessonplan} width={100} height={100} alt="Assistant Logo" style={{ marginTop: 20 }} />
                <p className={styles.maintext}>Diagnostics Plan</p>
                <p className={styles.submaintext}>
                Diagnostic tools to assess understanding and progress.
                </p>
              </div>

              {/* Group/Institutional Plan Box */}
              {/* <div className={styles.bodymodal} onClick={handleInstitutionClick}>
                <Image src={lessonplan} width={100} height={100} alt="Assistant Logo" style={{ marginTop: 20 }} />
                <p className={styles.maintext}>Institutional / Group Plan</p>
                <p className={styles.submaintext}>
                  Create lesson plan using notes/files from user groups.
                </p>
              </div> */}
            </div>

            {/* Coming Soon Message */}
            {showComingSoon && (
              <p className={styles.comingSoonMessage}> 🚧 Diagnostics Plan Coming Soon! 🚧</p>
            )}
          </div>
        </div>
      )}

      {isLessonPlanOpen && (
        <LessonPlanCourse
          onClose={handleLessonPlanClose}
          onContinue={onContinue}
        />
      )}

      {isInstitutionalPlanOpen && (
        <InstitutionalChoise
          onClose={handleLessonPlanClose}
          onContinue={handleBodyClick}
          type="lesson"
        />
      )}
      {isInstitutionalModal && (
        <InstititionalFileModal
          onClose={()=>setIsInstitutionalModal(false)}
          onContinue={handleFileContinue}
        />
      )}
      {isFileModal && (
        <FileModal 
          onClose={handleLessonPlanClose}
          onContinue={handleFileContinue}
        />
      )}
      {isDifficultyModal && (
        <FinalModal
          onClose={handleLessonPlanClose}
         />
      )}
      
    </>
  );
};

export default LessonPlanModal;
