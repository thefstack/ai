// src/app/components/Modal.js

// this modal is for chat
import React, { useState } from 'react';
import styles from '@/css/Modal.module.css';

const Modal = ({ onClose, onContinue, categories, isSubCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsButtonDisabled(false);
  };

  const handleContinue = () => {
    onContinue(selectedCategory);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          {isSubCategory ? (
            <h3 style={{color:'white'}}>Select a Subject</h3>
          ) : (
            <h3 style={{ color:'white'}}>Select a Category</h3>
          )}
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.body}>
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li
                key={category}
                className={`${styles.categoryItem} ${
                  selectedCategory === category ? styles.selected : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.footer}>
          <button
            className={isButtonDisabled ? styles.continueButton : styles.enabledButton}
            onClick={handleContinue}
            disabled={isButtonDisabled}
            style={{backgroundColor:'#CF7001'}}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
