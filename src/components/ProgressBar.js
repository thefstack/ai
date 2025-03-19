import React from 'react';
import styles from '@/css/ProgressBar.module.css';

const ProgressBar = ({ current, total }) => {

  const percentage = (current / total) * 100;
  return (
    <div style={{display: "flex", alignItems: "center", gap:"10px"}}>
      <div className={styles.progressContainer}>
      <div className={styles.progressBar} style={{ width: `${percentage}%` }} />   
    </div>
    <div className={styles.progressText}>({current}/{total})</div>
    </div>    
  );
};

export default ProgressBar;
