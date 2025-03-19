import React, { useEffect } from "react";
import styles from "@/css/GuidancePopup.module.css";

const AnalysisPopup = ({ isOpen, closePopup }) => {
  useEffect(() => {
    console.log("Analysis Popup visibility:", isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={closePopup}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupHeader}>
        <h2 className={styles.pinfo}>Personal Information</h2>
        <span className={styles.closeBtn} onClick={closePopup}>&times;</span>
        </div>

        {/* Tab Buttons */}
        <div className={styles.buttonGroup}>
          <button
            className={styles.tabBtn}
            onClick={() => {
              closePopup();
            }}
          >
            📄 Overview
          </button>
          <button className={`${styles.tabBtn} ${styles.active}`}>🛠️ Analysis</button>
        </div>

        {/* Analysis Content */}
        <div className={styles.popupBody}>
          <h3>Analysis</h3>
          <div className={styles.analysisSection}>
            <div className={styles.analysisItem}>
             <strong>✅&nbsp;&nbsp;Name Present</strong>
              <p>Adding your first and last name to your resume can help recruiters differentiate you from other applicants. 
              </p>
            </div>
            <hr />
            <div className={styles.analysisItem}>
            <strong>✅&nbsp;&nbsp;Email Present</strong>
              <p>It is important to include your Email ID, as 75% of resumes with unprofessional email addresses get rejected. </p>
            </div>
            <hr />
            <div className={styles.analysisItem}>
           <strong>✅&nbsp;&nbsp;Phone Present</strong>
              <p>Recruiters can determine your country from the country code in your phone number. </p>
            </div>
            <hr />
            <div className={styles.analysisItem}>
              <strong>✅&nbsp;&nbsp;Location Present</strong>
              <p>By providing your location on your resume, you can gain an advantage over applicants who live far from the desired location. </p>
            </div>
            <hr />
            <div className={styles.analysisItem}>
               <strong>✅&nbsp;&nbsp;Target Job Title Present</strong>
              <p>Including a Target Job Title in your resume helps recruiters quickly identify your desired role and understand your career goals. This not only helps navigate ATS, but also boosts your visibility in the eyes of recruiters.</p>
            </div>
          </div>
          <hr />

        </div>

        {/* Footer */}
        <div className={styles.popupFooter}>
          <button className={styles.navBtn}>&lt; Previous Section</button>
          <button className={styles.navBtn}>New Section &gt;</button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPopup;
