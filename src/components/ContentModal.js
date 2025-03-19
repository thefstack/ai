import React, { useState } from 'react';
import { Book, Lock } from 'lucide-react';
import styles from '@/css/ContentModal.module.css'; // Import CSS file
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { getAuthToken } from '@/utils/getAuthToken';
import PlanExpiryModal from './PlanExpiryModal';


const ContentModal = ({ type }) => {
  
  const { isModalOpen,setIsModalOpen, isContentModal,setIsContentModal, isFileModal,setIsFileModal, handleSetError, isInstitutionalModal, setIsInstitutionalModal}=useAuth();
  const [isPlanExpiryModalOpen, setIsPlanExpiryModalOpen] = useState(false);

  const handlePublicContent=async()=>{
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const res=await axios.get(`/api/subscriptionPlan?action=checkLimit&type=${type}`,{headers: {
          Authorization: `Bearer ${token}`
      }})
    if(res.data.success){
      setIsContentModal(false);
      setIsModalOpen(true);
    }else{
      setIsPlanExpiryModalOpen(true)
    }
      
    } catch (error) {
      console.log(error);
      setIsPlanExpiryModalOpen(true)
    }
    
  }
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
      setIsContentModal(false);
      setIsFileModal(true);
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
    if(res.data.success){
      setIsContentModal(false);
      setIsInstitutionalModal(true);
    }else{
      setIsPlanExpiryModalOpen(true)
    }
      
    } catch (error) {
      console.log(error);
      setIsPlanExpiryModalOpen(true)
    }
    
  }



  return (
    isPlanExpiryModalOpen ? <PlanExpiryModal onClose={() => setIsPlanExpiryModalOpen(false)} type={type} />
    : <div className={styles.modalOverlay}>
    <div className={styles.modalContainer}>
      <button className={styles.closeButton} onClick={()=>setIsContentModal(false)}>
        &times;
      </button>
      <h2 className={styles.modalTitle}>Ask any questions from...</h2>
      <div className={styles.optionsContainer}>
        <button className={styles.optionCard} onClick={handlePublicContent}>
          <Book className={styles.icon} />
          <h3>Public Content</h3>
          <p>Ask questions on any topic using public content and knowledge.</p>
        </button>
        <button className={styles.optionCard} onClick={handlePersonalContent}>
          <Lock className={styles.icon} />
          <h3>Personal Content</h3>
          <p>Ask questions about content you provide, such as course notes.</p>
        </button>
        <button className={styles.optionCard} onClick={handleInstitutionalContent}>
          <Lock className={styles.icon} />
          <h3>Institutional Content</h3>
          <p>Ask questions about content provided by institution, such as course notes.</p>
        </button>
      </div>
    </div>
  </div>
  );
};

export default ContentModal;
