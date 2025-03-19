"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  FileText,
} from "lucide-react";
import styles from "@/css/FileModal.module.css";
import axios from "axios";
import { getAuthToken } from "@/utils/getAuthToken";
import { formattedDateWithYear } from "@/utils/FormatDate";
import Error from "./Error";
import LoadingSpinner from "./LoadingSpinner";
import Tooltip from "./ToolTips";
import Success from "./Success";

const GroupFileShare = ({ onClose, groupId, groupData }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingFile, setIsFetchingFile] = useState(false);
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [files, setFiles] = useState([]);
  const [alreadyAddedFiles, setAlreadyAddedFiles] = useState([]);



  const handleCheckboxChange = (fileName) => {
    console.log("filename:",fileName)
    // setSelectedFiles([fileName]);
    // for multiple selection
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileName)
        ? prevSelected.filter((file) => file !== fileName)
        : [...prevSelected, fileName]
    );
  };


  const handleGetFileData = async () => {
    try {
      setIsFetchingFile(true)
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const getData = await axios.get("/api/assistant?action=getUploadedFile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // extracting already added files in separate variable
      const allFiles = getData.data.assistantList;
      const existingFiles = groupData?.[0]?.accessMaterials || [];

      setAlreadyAddedFiles(allFiles.filter((file) => existingFiles.includes(file._id)));
      setFiles(allFiles.filter((file) => !existingFiles.includes(file._id)));
        setIsFetchingFile(false);

    } catch (error) {
      // console.log(error)
      handleSetError(error.response.data.message);
      setIsFetchingFile(false);
    }
  }


  const handleContinue = async () => {
    try {
      setLoading(true)

      const token = await getAuthToken();  // Retrieve the token using the utility function
      console.log(token)
      if (!token) {
        throw new Error("No authentication found");
      }
      // Make sure selectedFiles is populated correctly
      if (selectedFiles.length === 0) {
        setLoading(false)
        return handleSetError("no files selected");
      }
      const fileId = selectedFiles; // passing only one file for now
        const response = await axios.post(`/api/usergroup?action=shareFiles`, {
            groupId: groupId,
            fileId: fileId
        },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        

        if(response.data.success){
          handleSetSuccess(response.data.message);
          setAlreadyAddedFiles([...alreadyAddedFiles, ...files.filter((file) => selectedFiles.includes(file._id))]);
          setFiles(files.filter((file) => !selectedFiles.includes(file._id)));
          setSelectedFiles([]);
        }else{
          handleSetError(response.data.message);
        }
    } catch (error) {
      console.log(error)
      handleSetError(error.response.data.message);
    }finally{
        setLoading(false)
    }
  }

  const handleSetSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => {
        setSuccess("");
    }, 3000)
    }

  const handleSetError = (msg) => {
    
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 3000)
  }

  useEffect(() => {
    handleGetFileData()
  }, [])

 

  return (<div className={styles.overlay}>
    {error && <Error message={error} />}
    {success && <Success message={success} />}
    <div className={styles.modal}>
      <button className={styles.closeButton} onClick={onClose}>
        <Tooltip text="Close">
          <X size={20} />
        </Tooltip>
      </button>

      <div className={styles.fileSection}>
        <h3 style={{ fontSize: 14, fontWeight: "normal" }}>
          <FileText size={16} /> My Files
        </h3>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th style={{ fontWeight: "500", fontSize: 12, color: "black" }}>Name</th>
                <th style={{ fontWeight: "500", fontSize: 12, color: "black" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {isFetchingFile ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>No files found.</td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file._id}>
                    <td>
                      <Tooltip text="Select" top="true">
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedFiles.includes(file._id)}
                          onChange={() => handleCheckboxChange(file._id)}
                        />
                      </Tooltip>
                    </td>
                    <td>
                      <div className={styles.fileNameCell}>
                        <FileText size={20} className={styles.fileIcon} />
                        <span>{file.name}</span>
                      </div>
                    </td>
                    <td>{formattedDateWithYear(file.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.continueButton}
          disabled={selectedFiles.length === 0 || loading}
          onClick={handleContinue}
        >
          Share {loading && <LoadingSpinner />}
        </button>
      </div>

      {alreadyAddedFiles.length > 0 && (
        <div className={styles.fileSection} style={{ marginTop: "20px" }}>
          <h3 style={{ fontSize: 14, fontWeight: "normal", marginBottom: "10px" }}>
            <FileText size={16} /> Already Added Files
          </h3>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ fontWeight: "500", fontSize: 12, color: "black" }}>Name</th>
                  <th style={{ fontWeight: "500", fontSize: 12, color: "black" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {alreadyAddedFiles.map((file) => (
                  <tr key={file._id}>
                    <td>
                      <div className={styles.fileNameCell}>
                        <FileText size={20} className={styles.fileIcon} />
                        <span>{file.name}</span>
                      </div>
                    </td>
                    <td>{formattedDateWithYear(file.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>);
};

export default GroupFileShare;
