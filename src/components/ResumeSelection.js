import React, { useState } from "react";
import styles from "@/css/ResumeSelection.module.css";
import { FileText, Upload } from "lucide-react"; // Importing icons from Lucide React
import ResumeSection from  "@/app/dashboard/resume/page.js";
import TemplateSelection from "./resume/TemplateSelection";
const ResumeSelection = () => {
  const [nextStep, setNextStep] = useState(false);

  const fromScratchHandler = () => {
    // setNextStep(true);
  }


  return (
    nextStep ?"":
      <div className={styles.container}>
        {/* Left Section: Guidance Text */}
        <div className={styles.textSection}>
          <h2 className={styles.heading}>Do you have a resume?</h2>
          <p className={styles.description} style={{ marginTop: 20 }}>
            If you do not have a resume, you can start from scratch.
          </p>
          <p className={styles.description} style={{ marginTop: 10 }}>
            If you already have an existing resume, go with upload resume.
          </p>
        </div>

        {/* Right Section: Resume Selection Cards */}
        <div className={styles.selectionBox}>
          {/* Start From Scratch */}
          <div className={`${styles.option} ${styles.selected}`} >
            <FileText size={30} className={styles.icon} />
            <span className={styles.filetext}>Start From Scratch</span>
            <Upload size={30} className={styles.uploadIcon} />
          </div>

          {/* Upload Resume */}
          <div className={styles.option} style={{ marginTop: 15 }}>
            <FileText size={30} className={styles.icon} />
            <span className={styles.filetext} >Upload Resume</span>
            <Upload size={30} className={styles.uploadIcon} />
          </div>
        </div>

      </div>
  );
};

export default ResumeSelection;
