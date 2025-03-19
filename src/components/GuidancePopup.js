import React, { useEffect, useState } from "react";
import styles from "@/css/GuidancePopup.module.css";
import AnalysisPopup from "./AnalysisPopup";

const GuidancePopup = ({ isOpen, closePopup }) => {
  useEffect(() => {
    console.log("Popup visibility:", isOpen);
  }, [isOpen]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {!showAnalysis ? (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h2 className={styles.pinfo}>Personal Information</h2>
              <span className={styles.closeBtn} onClick={closePopup}>&times;</span>
            </div>
            <div className={styles.popupBody}>
              <div className={styles.buttonGroup}>
                <button className={`${styles.tabBtn} ${styles.active}`}>📄 Overview</button>
                <button className={styles.tabBtn} onClick={()=>setShowAnalysis(true)}>🛠️ Analysis</button>
              </div>
              <h3>Guidance</h3>
              <p>
                Personal information in a resume is important because it provides essential details about you as a candidate...
              </p>
              <ul className={styles.guidanceList}>
                <li>Including your LinkedIn URL on your resume is a good idea. It makes you look more professional and gives extra info about your work. </li>
                <li>Adding links to your portfolio like your personal website or Github in your resume is important because it shows a glimpse of your work and proves your skills. These links let recruiters see examples of your projects, skills, and accomplishments. By sharing a link to your portfolio, you help recruiters check your abilities and understand how you can contribute to their team.</li>
                <li>Including a target title in your resume is a good idea because it helps recruiters understand what job you want. It also makes your resume more likely to be noticed by the Applicant Tracking System(ATS) that many companies use to find resumes. The target title is like a short headline that tells recruiters the kind of job you're looking for, making it easier for them to see if you're a good fit.</li>
                <li>When sending your resume, avoid sharing certain details like Marital status, Religion, Age, Nationality, Race, Sexual orientation, and Applicant photo. This helps prevent discrimination and serves other purposes too.</li>
              </ul>
            </div>
            <div className={styles.borderbottomstyle}>

            </div>
            <div className={styles.popupFooter}>
              <button className={styles.navBtn}>&lt; Previous Section</button>
              <button className={styles.navBtn}>New Section &gt;</button>
            </div>
          </div>
        </div>
      ) : (
        <AnalysisPopup isOpen={showAnalysis} closePopup={() => setShowAnalysis(false)} />
      )}
    </>
  );
};

export default GuidancePopup;
