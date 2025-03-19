import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from '@/css/FinalModal.module.css';
import DifficultyModal from './DifficultyModal';
import { useLesson } from '@/context/LessonContext';

const FinalModal = ({ onClose }) => {
  
  const {days, setDays, studyTime, setStudyTime, showDifficultyModal, setShowDifficultyModal, createLesson, setIsFinalModalOpen, setIsLessonPlanOpen} = useLesson();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Handles input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Validate days input to ensure it does not exceed 7
  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 7) {
      setErrorMessage('The maximum number of days is 7.');
      setTimeout(() => setErrorMessage(''), 4000); // Clear error message after 4 seconds
      return;
    }
    setDays(value);
  };

  // Validate inputs before showing difficulty modal
  const handleSubmit = () => {
    if (!days) {
      alert('Please enter the length of your lesson plan.');
      return;
    }
    if (studyTime === 'Select frequency') {
      alert('Please select a study frequency.');
      return;
    }

    setShowDifficultyModal(true); // Show difficulty modal on successful validation
  };

  // Handles the difficulty selection
  const handleDifficultySelection = () => {
    setShowDifficultyModal(false); // Close the modal
    setIsLessonPlanOpen(false);
    setIsFinalModalOpen(false);
    createLesson();
  };

  useEffect(()=>{
    setDays('');
    setStudyTime('Select frequency')
  },[])

  return (
    <>
      {/* Main Final Modal */}
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>What is your preference?</h2>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>

          {/* Input for Lesson Plan Length */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Length of lesson plan:</label>
            <div className={styles.inlineInputs}>
              <input
                type="number"
                value={days}
                onChange={handleDaysChange}
                className={styles.input}
                min="1"
                max="7"
              />
              <span className={styles.daysLabel}>Days</span>
            </div>
            {/* Error message */}
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
          </div>

          {/* Input for Study Frequency */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>How often would you like to study:</label>
            <select
              value={studyTime}
              onChange={handleInputChange(setStudyTime)}
              className={styles.selectInput}
            >
              <option value="">
                Select frequency
              </option>
              <option value="Low (30 minutes / day)">Low (30 minutes / day)</option>
              <option value="Moderate (1 hour / day)">Moderate (1 hour / day)</option>
              <option value="High (2 hours / day)">High (2 hours / day)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button className={styles.submitButton} onClick={handleSubmit}>
            Next
          </button>
        </div>
      </div>

      {/* Difficulty Selection Modal */}
      {showDifficultyModal && (
        <DifficultyModal
          onClose={() => setShowDifficultyModal(false)} // Close the modal
          onSelectDifficulty={handleDifficultySelection} // Pass the correct handler function
        />
      )}
    </>
  );
};

export default FinalModal;
