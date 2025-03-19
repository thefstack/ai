import React, { useEffect } from 'react';
import styles from '@/css/DifficultyModal.module.css';
import { useLesson } from '@/context/LessonContext';

const DifficultyModal = ({ onClose, onSelectDifficulty }) => { 
  
  const {selectedDifficulty, setSelectedDifficulty,setIsLessonModalOpen}=useLesson();

  // Handles difficulty selection
  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  // Generates lesson plan based on selected difficulty
  const handleGenerateLessonPlan = () => {
    if (!selectedDifficulty) {
      alert('Please select a difficulty level.');
      return;
    }

    setIsLessonModalOpen(false);
    // Call the parent callback if defined
    if (typeof onSelectDifficulty === 'function') {
      onSelectDifficulty(); 
    } else {
      console.error('onSelectDifficulty is not a function or is undefined');
    }
  };

  useEffect(()=>{
    setSelectedDifficulty('');
  },[])

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Select the Difficulty Level</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.optionContainer}>
            {['Basic', 'Intermediate', 'Advanced'].map((difficulty) => (
              <div
                key={difficulty}
                className={`${styles.option} ${selectedDifficulty === difficulty ? styles.selected : ''}`}
                onClick={() => handleDifficultyClick(difficulty)}
              >
                {difficulty}
              </div>
            ))}
          </div>
        </div>
        <button className={styles.submitButton} onClick={handleGenerateLessonPlan}>
          Generate Lesson Plan
        </button>
      </div>
    </div>
  );
};

export default DifficultyModal;
