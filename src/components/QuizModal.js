import React, { useState,useEffect } from 'react';
import styles from '@/css/Modal.module.css';
import { useQuiz } from '@/context/QuizContext';

const QuizModal = ({ onClose, onContinue, categories, isSubCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const {setShowPreferredTopics}=useQuiz()

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    console.log("category: ",category)
    setIsButtonDisabled(false);
  };
console.log(categories)
  const handleContinue = () => {
    onContinue(selectedCategory);
  };

  useEffect(()=>{
    setShowPreferredTopics(false)
  },[])

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
        {isSubCategory ? <h4 className={styles.fontButtton} style={{marginLeft:'auto',marginRight:'auto',color:'white'}}>Select your Tools</h4> : <h4  className={styles.fontButtton} style={{marginLeft:'auto',marginRight:'auto',color:'white'}}>What you want to learn?</h4>}
          <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>
        <div className={styles.body}>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li
                key={category}
                className={`${styles.categoryItem} ${selectedCategory === category ? styles.selected : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                 {category}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.footer}>
          <button className={isButtonDisabled ? styles.continueButton : styles.enabledButton} onClick={handleContinue} disabled={isButtonDisabled}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
