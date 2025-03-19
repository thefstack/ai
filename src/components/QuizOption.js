import React from 'react';
import styles from '@/css/QuizOption.module.css';

const QuizOption = ({ options, selectedOption, onSelectOption }) => {
  return (
    <div className={styles.optionContainer}>
      {options.map((option, index) => (
        <button
          key={index}
          className={`${styles.optionButton} ${selectedOption === option.text ? styles.selected : ''}`}
          onClick={() => onSelectOption(option.text)}
        >
          <span className={styles.optionLabel}>{option.label}</span> {option.text}
        </button>
      ))}
    </div>
  );
};

export default QuizOption;