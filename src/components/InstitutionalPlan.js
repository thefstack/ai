import React, { useState, useEffect } from 'react';
import styles from '@/css/InstitutionalFileModal.module.css';
import FinalModal from './FinalModal';
import categoryData from '@/lib/categoryData';
import { useLesson } from '@/context/LessonContext';
import InstititionalFileModal from './InstitutionalFileModal';

const InstitutionalPlan = ({ onClose }) => {
  const {
    selectedTitle,
    setSelectedTitle,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    isCategorySelection,
    setIsCategorySelection,
    isSubCategoryelection,
    setIsSubCategoryelection,
    isFinalModalOpen,
    setIsFinalModalOpen,
    isNewModelOpen,
    setIsNewModelOpen,
    setIsNewLessonOpen,
    setIsLessonModalOpen,
  } = useLesson();

  const handleTitleClick = (course) => {
    setSelectedTitle(course);
    setSelectedCategory('');
    setSelectedSubCategory([]);
  };

  const handleToolClick = (tool) => {
    setSelectedCategory(tool);
    setSelectedSubCategory([]);
  };

  const handleTopicClick = (topic) => {
    setSelectedSubCategory((prevSubCategory) =>
      prevSubCategory.includes(topic)
        ? prevSubCategory.filter((t) => t !== topic)
        : [...prevSubCategory, topic]
    );
  };

  const handleSelectAll = () => {
    const allTopics = categoryData[selectedTitle]?.topics[selectedCategory] || [];
    if (selectedSubCategory.length === allTopics.length) {
      setSelectedSubCategory([]); // Deselect all
    } else {
      setSelectedSubCategory(allTopics); // Select all
    }
  };

  const handleNextClick = () => {
    if (!isCategorySelection) {
      setIsCategorySelection(true);
    } else if (!isSubCategoryelection) {
      setIsSubCategoryelection(true);
    } else {
      setIsFinalModalOpen(true);
      setIsNewLessonOpen(false);
      setIsNewModelOpen(false);
    }
  };

  const handleCloseFinalModal = () => {
    setIsFinalModalOpen(false);
    onClose();
  };

  useEffect(() => {
    setIsSubCategoryelection(false);
    setIsCategorySelection(false);
    setIsNewLessonOpen(false);
  }, []);

  return (
    <div className={styles.lessonPlanOverlay}>
      {isNewModelOpen && (
        <div>
            <InstititionalFileModal onClose={onClose}/>
        </div>       
      )}

      {isFinalModalOpen && <FinalModal onClose={handleCloseFinalModal} />}
    </div>
  );
};

export default InstitutionalPlan;
