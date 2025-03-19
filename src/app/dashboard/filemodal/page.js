"use client";
import React, { useState } from "react";
import {
  X,
  Upload,
  FolderPlus,
  Settings,
  FileText,
  Users,
} from "lucide-react";
import styles from "@/css/FileModal.module.css";
import FileModals from "@/components/FileModal";

const FileModal = ({ onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);

  const handleCheckboxChange = (fileName) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileName)
        ? prevSelected.filter((file) => file !== fileName)
        : [...prevSelected, fileName]
    );
  };

  const handleUpload = (e) => {
    //called file save api
    console.log(e)
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      date: new Date().toLocaleString(),
    }));
    setSharedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const files = [
    { name: "Ivy Ai Tutor Flow.pptx", size: "964.32 KB", date: "2024-11-25 16:31 PM" },
    { name: "propmt.txt", size: "454 bytes", date: "2024-11-25 16:31 PM" },
    { name: "seo.txt", size: "323 bytes", date: "2024-11-25 16:31 PM" },
  ];

  return (
    <FileModals/>
  );
};

export default FileModal;
