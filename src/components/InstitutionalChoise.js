

import React, { useEffect, useState } from 'react';
import { Book, Lock } from 'lucide-react';
import styles from '@/css/ContentModal.module.css'; // Import CSS file
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { getAuthToken } from '@/utils/getAuthToken';
import PlanExpiryModal from './PlanExpiryModal';
import { useLesson } from '@/context/LessonContext';


const InstitutionalChoise = ({ onContinue, onClose, type }) => {
  
  const {handleSetError}=useAuth();
  const [isPlanExpiryModalOpen, setIsPlanExpiryModalOpen] = useState(false);
  const {setIsCategorySelection, setIsNewLessonOpen, setIsSubCategoryelection,  isFileModal,setIsFileModal, isInstitutionalPlanOpen, setIsInstutionalPlanOpen, contentType, setIsContentType, isInstitutionalModal, setIsInstitutionalModal }=useLesson()

  
  const handlePersonalContent=async()=>{

    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const res=await axios.get(`/api/subscriptionPlan?action=checkLimit&type=${type}`,{headers: {
          Authorization: `Bearer ${token}`
      }})
    if(res.data.success){
      setIsInstutionalPlanOpen(false)
      setIsFileModal(true);
      setIsContentType("personal")
    }else{
      setIsPlanExpiryModalOpen(true)
    }
      
    } catch (error) {
      console.log(error);
      setIsPlanExpiryModalOpen(true)
    }
    
  }
  const handleInstitutionalContent=async()=>{

    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const res=await axios.get(`/api/subscriptionPlan?action=checkLimit&type=${type}`,{headers: {
          Authorization: `Bearer ${token}`
      }})
      console.log(res)
    if(res.data.success){
      setIsInstutionalPlanOpen(false)
      setIsInstitutionalModal(true);
      setIsContentType("institutional")
    }else{
      setIsPlanExpiryModalOpen(true)
    }
      
    } catch (error) {
      console.log(error);
      setIsPlanExpiryModalOpen(true)
    }
    
  }

  useEffect(()=>{
    setIsSubCategoryelection(false);
    setIsCategorySelection(false);
    setIsNewLessonOpen(false);
    setIsContentType("")
  },[])



  return (
    isPlanExpiryModalOpen ? <PlanExpiryModal onClose={() => setIsPlanExpiryModalOpen(false)} type={type} />
    : <div className={styles.modalOverlay}>
    <div className={styles.modalContainer}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <h2 className={styles.modalTitle}>Ask any questions from...</h2>
      <div className={styles.optionsContainer}>
        <button className={styles.optionCard} onClick={onContinue}>
          <Book className={styles.icon} />
          <h3>Public Content</h3>
          <p>Create lesson plan based on selection different topics</p>
        </button>
        <button className={styles.optionCard} onClick={handlePersonalContent}>
          <Lock className={styles.icon} />
          <h3>Personal Content</h3>
          <p>Create lesson plan from your personal files</p>
        </button>
        <button className={styles.optionCard} onClick={handleInstitutionalContent}>
          <Lock className={styles.icon} />
          <h3>Institutional Content</h3>
          <p>Create lesson plan using content provided by institution, such as course notes.</p>
        </button>
      </div>
    </div>
  </div>
  );
};

export default InstitutionalChoise;
