"use client"
import React, { useState } from "react";
import styles from "@/css/ResumeModal.module.css"; // Ensure correct path
import TargetJobDescriptions from "@/components/TargetJobDescription";

const Resume = () => {
  const [step, setStep] = useState(false);

  const continueBtnHandler = () => {
    console.log("Continue button clicked");
    setStep(true);

  };

  return (

    step ? <TargetJobDescriptions /> :


      <>
        <div className={styles.resumeContainer}>

          <h3 className={styles.subHeading}>AI Resume Builder</h3>
          <h1 className={styles.mainHeading}>
            Automate your CV creation <br /> with our AI resume builder.
          </h1>
          <p className={styles.description}>
            Some people simply don’t enjoy writing resumes as much as we do. <br />
            <p style={{ textAlign: "center", color: 'black' }}>
              That’s okay. Our AI Resume Writer is for you.
            </p>
          </p>
          <div className={styles.inputSection}>
            <label className={styles.inputLabel}>Target Job</label>
            <p className={styles.inputDescription}>
              Enter the job title you're aiming for or targeting in your job search.
              This helps tailor your job search and alerts to match your career
              goals.
            </p>
            <label className={styles.inputSubLabel}>Target Job Title</label>
            <input
              type="text"
              placeholder="Enter your target job title"
              className={styles.inputField}
            />
          </div>
          <button onClick={continueBtnHandler} className={styles.continueBtn}>Continue</button>

        </div>


      </>




  );
};

export default Resume;
