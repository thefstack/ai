"use client";

import React, { useState } from "react";
import styles from "../css/PlanExpiryModal.module.css";
import { AlertTriangle } from "lucide-react";

const PlanExpiryModal = ({ onClose, type }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header Section with Icon */}
        <div className={styles.header}>
          <AlertTriangle className={styles.icon} />
          <h2 className={styles.title}>
            Upgrade to unlock more lesson plans and premium features
          </h2>
        </div>

        {/* Description Text */}
        <p className={styles.description}>
          Upgrade your plan to unlock more lesson plans per month, assessments,
          quizzes, and more.
        </p>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.upgradeButton}>Upgrade</button>
        </div>
      </div>
    </div>
  );
};

export default PlanExpiryModal;
