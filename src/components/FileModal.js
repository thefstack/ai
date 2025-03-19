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
import styles from "@/css/FileModal.module.css";
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

const FileModal = ({ onClose, onContinue }) => {
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

  // const handleUpload = async (e) => {
  //   try{

  //     const files = e.target.files; // Get the selected files
  //     if (!files.length) {
  //       return; // Exit if no files are selected
  //     }
  //     setIsUploadingFile(true);
  //     const formData = new FormData();

  //     // Append file to FormData
  //     Array.from(files).forEach((file) => {
  //       formData.append("file", file); // "files" is the key your backend expects
  //     });

  //     const token = await getAuthToken();  // Retrieve the token using the utility function

  //     if (!token) {
  //       throw new Error("No authentication found");
  //     }
  //     const response=await axios.post("/api/assistant?action=uploadFile",
  //       formData,
  //       {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //     }
  //     });

  //     // Reset the file input field after successful upload
  //     e.target.value = "";  // This clears the file input field

  //     await fetchFiles()

  //   }catch(error){
  //     console.error(error);
  //     handleSetError(error.response.data.message);
  //     setIsUploadingFile(false);
  //   }
  // };


  const handleUpload = async (e) => {
    try {
      const files = e.target.files; // Get the selected files
      if (!files.length) {
        return; // Exit if no files are selected
      }

      const allowedFileTypes = [
        "text/plain",         // .txt
        "application/pdf",    // .pdf
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "text/html",          // .html
        "application/json",   // .json
        "text/css",           // .css
        "application/javascript", // .js
        "text/javascript",    // .mjs
        "text/markdown"       // .md
      ];

      // Validate file types
      for (const file of files) {
        if (!allowedFileTypes.includes(file.type)) {
          handleSetError("File type not supported.");
          e.target.value = ""; // Clear the file input field
          return;
        }
      }

      setIsUploadingFile(true);
      const formData = new FormData();

      // Append file to FormData
      Array.from(files).forEach((file) => {
        formData.append("file", file); // "files" is the key your backend expects
      });

      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const response = await axios.post(
        "/api/assistant?action=uploadFile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset the file input field after successful upload
      e.target.value = ""; // This clears the file input field

      await fetchFiles();
    } catch (error) {
      console.error(error);
      handleSetError(error.response?.data?.message || "An error occurred.");
      setIsUploadingFile(false);
    }
  };



  const fetchFiles = async () => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function
      if (!token) {
        throw new Error("No authentication found");
      }
      const getData = await axios.get("/api/assistant?action=getUploadedFile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFiles(getData.data.assistantList);
      setIsUploadingFile(false);
    } catch (error) {
      console.log(error)
      setIsUploadingFile(false);
      handleSetError(error.response.data.message);
    }
  }

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
      // console.log(getData)
      // console.log(getData.data.assistantList)
      setTimeout(() => {
        setFiles(getData.data.assistantList);
        setIsFetchingFile(false);
      }, 500)

    } catch (error) {
      console.log(error)
      handleSetError(error.response.data.message);
      setIsFetchingFile(false);
    }
  }

  const handleDeleteFile = async (fileId) => {
    try {
      setSelectedFiles([])
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
      console.log(token)
      const res = await axios.delete("/api/assistant", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          action: "deleteFile",
          fileId: fileId
        }
      }
      );

      await fetchFiles()
    } catch (error) {
      console.log(error)
      handleSetError(error.response.data.message);
    }
  }

  const handleContinue = async () => {
    try {
      setLoading(true)

      const token = await getAuthToken();  // Retrieve the token using the utility function
     
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
        
        console.log("chat",createChat)

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

      } else if (pathname.startsWith("/dashboard/lesson")) {
        //if this is lesson
        onContinue(fileId)
        setLoading(false)

      } else {
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
        <div className={styles.header}>
          <label className={styles.actionButton}>
            <Upload size={16} />
            Upload files
            <input
              type="file"
              className={styles.fileInput}
              onChange={handleUpload}
              accept=".txt,.pdf,.docx,.html,.json,.css,.js,.mjs, .md"
            />
          </label>
          {/* <button className={styles.actionButton}>
            <FolderPlus size={16} />
            Create folder
          </button> */}
          {/* <button className={styles.actionButton} onClick={() => console.log("manage File")}>
            <Settings size={16} />
            Manage files
          </button> */}
        </div>
        <div className={styles.fileSection}>
          <h3 style={{ fontSize: 14, fontWeight: 'normal' }}>
            <FileText size={16} /> My Files
          </h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr >
                  <th></th>
                  <th style={{ fontWeight: '500', fontSize: 12, color: 'black' }}>Name</th>
                  <th style={{ fontWeight: '500', fontSize: 12, color: 'black' }}>Size</th>
                  <th style={{ fontWeight: '500', fontSize: 12, color: 'black' }}>Date</th>
                  <th style={{ fontWeight: '500', fontSize: 12, color: 'black' }}>Action</th>
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
                          <span>{file.name}</span>
                        </div>
                      </td>
                      <td>{formatFileSize(file.size)}</td>
                      <td>{formattedDateWithYear(file.createdAt)}</td>
                      <td><Tooltip text="delete"><p onClick={() => handleDeleteFile(file.fileId)}><Trash2 className={styles.deleteBtn}/></p></Tooltip></td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
          {/* <h3 style={{fontSize:16,fontWeight:'normal',marginTop:35}}>
            <Users size={16} /> Shared with me
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sharedFiles.length === 0 ? (
                <tr>
                  <td colSpan="3">There are no files shared yet.</td>
                </tr>
              ) : (
                sharedFiles.map((file) => (
                  <tr key={file.name}>
                    <td>{file.name}</td>
                    <td>{file.size}</td>
                    <td>{file.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table> */}
        </div>
        <div className={styles.footer}>
          <button
            className={styles.continueButton}
            disabled={selectedFiles.length === 0 || loading}
            onClick={handleContinue}
          >
            Continue {loading && <LoadingSpinner />}
          </button>
          <div className={styles.note}>
            <strong>Note:</strong> <span>*Please try to upload a text file for better response quality.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FileModal;
