import React, { useState, useEffect } from 'react';
import styles from '@/css/PreferredTopics.module.css';
import dStyles from '@/css/DifficultyModal.module.css';
import { useQuiz } from '@/context/QuizContext';
import categoryData from '@/lib/categoryData'; // Adjust the path accordingly

const PreferredTopics = ({ onContinue, onLoading, onClose, selectedCategory, selectedTool }) => {
  const {
    selectedTopics = [],
    setSelectedTopics,
    setLoading,
    selectedDifficulty,
    setSelectedDifficulty,
    setIsSubModalOpen,
  } = useQuiz();
  const [topics, setTopics] = useState([]);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

  useEffect(() => {
    if (selectedCategory && selectedTool) {
      const topicsForTool = categoryData[selectedCategory]?.topics[selectedTool] || [];
      setTopics(topicsForTool);
    }
  }, [selectedCategory, selectedTool]);

  useEffect(() => {
    setSelectedTopics([]); // empty the selected topics when it is rendered again
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedTopics((prevSelected) => {
      if (prevSelected.includes(topic)) {
        return prevSelected.filter((item) => item !== topic);
      } else {
        return [...prevSelected, topic];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      // Deselect all if all topics are already selected
      setSelectedTopics([]);
    } else {
      // Select all topics
      setSelectedTopics(topics);
    }
  };

  const handleContinue = () => {
    setIsDifficultyOpen(true);
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleGenerateQuiz = () => {
    if (selectedDifficulty === '') {
      alert('Please select a difficulty level.');
      return;
    }

    onLoading(true);
    onContinue(selectedTopics);
    setIsDifficultyOpen(false);
  };

  useEffect(() => {
    setIsDifficultyOpen(false);
    setSelectedDifficulty('');
  }, []);

  return (
    <div className={styles.modalOverlay}>
      {isDifficultyOpen ? (
        <div className={dStyles.modalOverlay}>
          <div className={dStyles.modalContainer}>
            <div className={dStyles.header}>
              <h2 className={dStyles.title}>Select the Difficulty Level</h2>
              <button className={dStyles.closeButton} onClick={onClose}>
                &times;
              </button>
            </div>
            <div className={dStyles.inputGroup}>
              <div className={dStyles.optionContainer}>
                {['Basic', 'Intermediate', 'Advanced'].map((difficulty) => (
                  <div
                    key={difficulty}
                    className={`${dStyles.option} ${selectedDifficulty === difficulty ? dStyles.selected : ''}`}
                    onClick={() => handleDifficultyClick(difficulty)}
                  >
                    {difficulty}
                  </div>
                ))}
              </div>
            </div>
            <button className={dStyles.submitButton} onClick={handleGenerateQuiz}>
              Generate Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <h4 style={{ color: 'white' }}>Select Your Preferred Topics</h4>
            <button className={styles.closeButton} onClick={onClose}>
              X
            </button>
          </div>
          <p className={styles.chooseText}>(Choose one or more)</p>
          <div className={styles.body}>
            <ul className={styles.categoryList}>
              {topics.length === 0 && <p>No topic available</p>}
              {topics.map((topic) => (
                <li
                  key={topic}
                  className={`${styles.categoryItem} ${
                    selectedTopics.includes(topic) ? styles.selected : ''
                  }`}
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.footer}>
            <button className={styles.selectAllButton} onClick={handleSelectAll}>
              {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              className={styles.nextButton}
              onClick={handleContinue}
              disabled={topics.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferredTopics;
