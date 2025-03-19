import React, { useState } from "react";
import styles from "@/css/UploadedResume.module.css";
import { Search, Upload, FileText, Circle, CheckCircle } from "lucide-react";
import UploadResumeModal from "./UploadedResumeModal";

const UploadedResume = () => {
    const [selectedResume, setSelectedResume] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    
    const resumes = [
        "Full Stack Engineer",
        "Software Developer",
        "resume_debraj_chakraborty (2).pdf",
        "Software Developer",
        "resume_debraj_chakraborty (2).pdf",
        "Software Developer",
    ];

    return (
        <div className={styles.resumePageContainer}>
            <h2 className={styles.pageTitle}>Select a Resume</h2>
            <div className={styles.resumeHeader}>
                <div className={styles.resumeHeaderLeft}>Resumes List</div>
                <div className={styles.resumeHeaderRight}>
                    <div className={styles.searchContainer}>
                        <Search size={16} className={styles.searchIcon} />
                        <input type="text" placeholder="Search" className={styles.searchInput} />
                    </div>
                    <button className={styles.uploadButton} onClick={() => setShowUploadModal(true)}>
                        <Upload size={16} /> Upload New Resume
                    </button>
                </div>
            </div>

            <div className={styles.resumeList}>
                {resumes.map((resume, index) => (
                    <div
                        key={index}
                        className={`${styles.resumeItem} ${selectedResume === index ? styles.selected : ""}`}
                        onClick={() => setSelectedResume(index)}
                    >
                        <div className={styles.resumeContent}>
                            <FileText size={16} className={styles.fileIcon} />
                            <span className={styles.resumeName}>{resume}</span>
                        </div>
                        <div className={styles.selectionIcon}>
                            {selectedResume === index ? <CheckCircle size={18} /> : <Circle size={18} />}
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.footerButtons}>
                <button className={styles.prevButton}>Prev</button>
                <button className={styles.continueButton}>Continue</button>
            </div>

            {showUploadModal && <UploadResumeModal onClose={() => setShowUploadModal(false)} />}
        </div>
    );
};

export default UploadedResume;