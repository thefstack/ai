"use client"
import React, { useState, useEffect } from "react";
import styles from "@/css/Chat.module.css";
import Image from "next/image";
import logo from "@/assets/logo.png";
import user from "@/assets/user.png";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import ReadAloudButton from "@/components/ReadAloud";
import Loading from "@/components/Loading";

const Chat = () => {
  const { subCategory, getShareChat,loading } = useAuth();
  const { chatData,} = useAuth();
  const [isChat, setIsChat] = useState();


  const {id} = useParams();

    
  const getChat=()=>{

  }

useEffect(()=>{
    setIsChat(getShareChat(id));
},[])

if(loading){
    return <Loading text="Fetching Chat"/>
}

if(isChat==false){
    return <p>Unauthorised</p>
}


  return (
    <div
      className={styles.chatContainer} style={{padding:"10px"}}>
      <h1
        className={styles.subjectTitle}
        style={{ fontWeight: 600, fontSize: 18 , padding:"0px 25px"}}
      >
        {subCategory}
      </h1>
      <div className={styles.messages}>
        {chatData.length > 0 &&
          chatData.map((items, index) => {
            return (
              <div
                key={index}
                className={`${styles.message} ${styles["assistant"]}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "30px",
                  overflow:"hidden"
                }}
              >
                <div className={styles.assistantMessage}>
                  <Image
                    src={user}
                    width={20}
                    height={20}
                    alt="Assistant Logo"
                    className={styles.assistantLogo}
                  />
                  <div className={styles.messageContent}>{items.question}</div>
                </div>
                <div className={styles.userMessage}>
                  <Image
                    src={logo}
                    width={40}
                    height={40}
                    alt="User Logo"
                    className={styles.userLogo}
                  />
                  <div className={styles.dummyText}>
                    <ReactMarkdown>{items.answer}</ReactMarkdown>
                    <div className={styles.tools}>
                      <ReadAloudButton content={items.answer} />
                      <CopyButton content={items.answer} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          </div>
          </div>
  );
};

export default Chat;
