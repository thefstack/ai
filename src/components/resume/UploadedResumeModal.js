import React, { useState } from "react";
import styles from "@/css/UploadedResumeModal.module.css";
import { X, Upload } from "lucide-react";

const UploadResumeModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTitle("");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add document</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <label className={styles.label}>* Select File</label>
          <div className={styles.uploadContainer}>
            {file ? (
              <div className={styles.fileDisplay}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)}KB</span>
                <button className={styles.removeFileButton} onClick={handleRemoveFile}>
                  <X size={14} style={{marginLeft:5,marginTop:3}} />
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className={styles.uploadButton}>
                <Upload size={16} /> Upload file
                <input id="file-upload" type="file" onChange={handleFileChange} hidden />
              </label>
            )}
          </div>

          <label className={styles.label}>* Title</label>
          <input type="text" className={styles.inputField} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

          <label className={styles.label}>* Document Category</label>
          <select className={styles.selectField}>
            <option>Resume</option>
            <option>Cover Letter</option>
            <option>Portfolio</option>
            <option>Certificates</option>
            <option>Resource</option>
            <option>Work History</option>
            <option>Offer letter</option>
            <option>oTHER</option>
          </select>

          <label className={styles.label}>Description</label>
          <textarea className={styles.textArea} placeholder="Description"></textarea>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.discardButton} onClick={onClose}>
            Discard <X size={14} className={styles.discardIcon} />
          </button>
          <button className={styles.saveButton}>Save Document</button>
        </div>
      </div>
    </div>
  );
};

export default UploadResumeModal;
