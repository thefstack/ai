import React from 'react';
import { Book, Lock } from 'lucide-react';
import styles from '@/css/ContentModal.module.css'; // Import CSS file

const ContentModal = ({ isOpen, onClose }) => {
  // if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Ask any questions from...</h2>
        <div className={styles.optionsContainer}>
          <div className={styles.optionCard}>
            <Book className={styles.icon} />
            <h3>Public Content</h3>
            <p>Ask questions on any topic using public content and knowledge.</p>
          </div>
          <div className={styles.optionCard}>
            <Lock className={styles.icon} />
            <h3>Personal Content</h3>
            <p>Ask questions about content you provide, such as course notes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
