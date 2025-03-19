import React, { useState, useEffect } from 'react';
import styles from '@/css/LessonPlanCourse.module.css';
import FinalModal from './FinalModal';
import categoryData from '@/lib/categoryData';
import { useLesson } from '@/context/LessonContext';

const LessonPlanCourse = ({ onClose }) => {
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
  const [choise,setChoise]=useState();

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
    <>
    <div className={styles.lessonPlanOverlay}>
      {isNewModelOpen && (
        <div className={styles.lessonPlanContent}>
          <div className={styles.header}>
            <h3>
              {isSubCategoryelection
                ? 'Select Your Preferred Topics'
                : isCategorySelection
                ? 'Select Tools'
                : 'What you want to learn?'}
            </h3>
            <button className={styles.closeButton} onClick={onClose}>
              X
            </button>
          </div>

          {!isCategorySelection ? (
            <div className={styles.courseList}>
              {Object.keys(categoryData).map((course) => (
                <div
                  key={course}
                  className={`${styles.courseItem} ${
                    selectedTitle === course ? styles.selected : ''
                  }`}
                  onClick={() => handleTitleClick(course)}
                >
                  {course}
                </div>
              ))}
            </div>
          ) : !isSubCategoryelection ? (
            <div className={styles.courseList}>
              {categoryData[selectedTitle]?.tools.map((tool) => (
                <div
                  key={tool}
                  className={`${styles.courseItem} ${
                    selectedCategory === tool ? styles.selected : ''
                  }`}
                  onClick={() => handleToolClick(tool)}
                >
                  {tool}
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className={styles.chooseText}>(Choose one or more)</p>
              <div className={styles.courseList}>
                {categoryData[selectedTitle]?.topics[selectedCategory]?.map((topic) => (
                  <div
                    key={topic}
                    className={`${styles.courseItem} ${
                      selectedSubCategory.includes(topic) ? styles.topicselected : ''
                    }`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className={styles.footer}>
            {isSubCategoryelection && (
              <button className={styles.selectAllButton} onClick={handleSelectAll}>
                {selectedSubCategory.length ===
                (categoryData[selectedTitle]?.topics[selectedCategory] || []).length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            )}
            <button
              className={styles.nextButton}
              onClick={handleNextClick}
              disabled={
                (!isCategorySelection && !selectedTitle) ||
                (isCategorySelection && !isSubCategoryelection && !selectedCategory) ||
                (isSubCategoryelection && selectedSubCategory.length === 0)
              }
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isFinalModalOpen && <FinalModal onClose={handleCloseFinalModal} />}
    </div>
    </>
  );
};

export default LessonPlanCourse;
