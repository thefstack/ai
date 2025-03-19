"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Upload,
  FolderPlus,
  Settings,
  FileText,
  Users,
} from "lucide-react";
import styles from "@/css/InstitutionalFileModal.module.css";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { getAuthToken } from "@/utils/getAuthToken";
import { formattedDateWithYear } from "@/utils/FormatDate";
import Error from "./Error";
import { formatFileSize } from "@/utils/formatFileSize";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { useQuiz } from "@/context/QuizContext";
import { Trash2 } from 'lucide-react';
import Tooltip from "./ToolTips";

const InstititionalFileModal = ({ onClose, onContinue }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingFile, setIsFetchingFile] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState("")
  const { getChatList } = useAuth();
  const { getQuizList } = useQuiz();
  const [files, setFiles] = useState([])
  const router = useRouter()
  const pathname = usePathname();


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

      const getData = await axios.get("/api/usergroup?action=getSharedFile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(getData)
      console.log(getData.data)
      setTimeout(() => {
        setFiles(getData.data.files);
        setIsFetchingFile(false);
      }, 500)

    } catch (error) {
      console.log(error)
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
      const fileId = selectedFiles; // Assuming you are passing only one file for now

      if (pathname.startsWith("/dashboard/chat")) {
        const createChat = await axios.post(`/api/assistant?action=createChat&fileId=${fileId}`, {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        
        // console.log("chat",createChat)

        if(createChat.data.success){
        router.push(`/dashboard/chat/${createChat.data.chatId}`)
        }else{
          throw new error(createChat.data.reason)
        }
        onClose();
        setLoading(false)
        getChatList()
        

      } else if (pathname.startsWith("/dashboard/quiz")) {
        //if this is quiz

        const createQuiz = await axios.get(`/api/quizAssistant?action=createQuizQuestions&fileId=${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        onClose();
        setLoading(false)
        console.log(createQuiz)
        getQuizList()
        router.push(`/dashboard/quiz/${createQuiz.data.quizId}`)

      }else if (pathname.startsWith("/dashboard/lesson")) {
        //if this is lesson
        onContinue(fileId)
        setLoading(false)

      } 
      else {
        console.log(fileId)
        setLoading(false)
        handleSetError("Error from client side");
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      handleSetError(error.response.data.message);
    }
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

  return (
    <div className={styles.overlay}>
      {error != "" && <Error message={error} />}
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <Tooltip text="close"><X size={20} /></Tooltip>
        </button>
        <h3 style={{ fontSize: 14, fontWeight: 'normal', marginBottom:"8px" }}>
            <FileText size={16} /> Institutional Files
          </h3>

        <div className={styles.fileSection}>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr >
                  <th></th>
                  <th style={{ fontWeight: '500', fontSize: 12, color: 'black' }}>File Name</th>
                  <th style={{ fontWeight: '500', fontSize: 12, color: 'black' }}>From</th>
                </tr>
              </thead>
              <tbody>
                {isUploadingFile && <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>Uploading...</td>
                </tr>}
                {isFetchingFile === true ? <div className="loader"></div> : (files.length === 0 ?
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>No files found.</td>
                  </tr>
                  : files.map((file) => (
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
                          <FileText size={16} className={styles.fileIcon} />
                          <span>{file.fileName}</span>
                        </div>
                      </td>
                      <td>{file.groupName}</td>
                    </tr>
                  )))}
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
            Continue {loading && <LoadingSpinner />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default InstititionalFileModal;
