'use client'; // Enable client-side rendering
import userIcon from '@/assets/user.png'; // User icon
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from "react";
import Link from 'next/link';
import {
    X,
    Upload,
    FolderPlus,
    Settings,
    FileText,
    Users,
} from "lucide-react";

import styles from "@/css/FilePopup.module.css";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { getAuthToken } from "@/utils/getAuthToken";
import { formattedDateWithYear } from "@/utils/FormatDate";
import Error from './Error';
import { formatFileSize } from "@/utils/formatFileSize";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { useQuiz } from "@/context/QuizContext";
import { Trash2 } from 'lucide-react';
import Tooltip from "./ToolTips";





const FilePopup=({ onClose })=> {
    const [isMonthly, setIsMonthly] = useState(true);
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
        console.log("filename:", fileName)
        // setSelectedFiles([fileName]);
        // for multiple selection
        setSelectedFiles((prevSelected) =>
            prevSelected.includes(fileName)
                ? prevSelected.filter((file) => file !== fileName)
                : [...prevSelected, fileName]
        );
    };



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
            const token = await getAuthToken();
            if (!token) {
                throw new Error("No authentication found");
            }
            const getData = await axios.get("/api/assistant?action=getUploadedFile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFiles(getData.data.assistantList);
            setIsUploadingFile(false);
        } catch (error) {
            console.log(error);
            setIsUploadingFile(false);
            handleSetError(error.response?.data?.message || "An error occurred.");
        }
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
            console.log(getData)
            console.log(getData.data.assistantList)
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
        <div >

            {/* Main Content */}
            <main>
            <h3 style={{ fontSize: 20, fontWeight: 'normal' }}>
                <FileText size={20} /> My Files
            </h3>
                <div className='container'>
                    {error != "" && <Error message={error} />}
                    <div className={styles.modal}>
                        
                        <div className={styles.header} style={{display:'flex',justifyContent:'space-between'}} >
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
                            <div className="file-count" style={{marginTop:15,marginRight:30}}>
                                <strong>Uploaded Files:</strong> {files.length}
                            </div>
                        </div>
                        <div className={styles.fileSection}>
                            
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr >
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
                                                        <div className={styles.fileNameCell}>
                                                            <FileText size={16} className={styles.fileIcon} />
                                                            <span>{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{formatFileSize(file.size)}</td>
                                                    <td>{formattedDateWithYear(file.createdAt)}</td>
                                                    <td><Tooltip text="delete"><p onClick={() => handleDeleteFile(file.fileId)}><Trash2 className={styles.deleteBtn} /></p></Tooltip></td>
                                                </tr>
                                            )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}


export default FilePopup