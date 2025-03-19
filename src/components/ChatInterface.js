import React, { useState, useEffect, useRef } from "react";
import styles from "@/css/Chat.module.css";
import Image from "next/image";
import logo from "@/assets/logo.png";
import user from "@/assets/user.png";
import share from "@/assets/share.png";
import ReactMarkdown from "react-markdown";
import Header from "./Header";
import { ThumbsUp as Like } from "lucide-react";
import { ThumbsDown as Dislike, Copy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { Mic } from "lucide-react";
import CopyButton from "./CopyButton";
import ReadAloudButton from "./ReadAloud";
import { getAuthToken } from "@/utils/getAuthToken";


const Chat = () => {
  const { subCategory, category, chatRes, setChatRes } = useAuth();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [typingMessage, setTypingMessage] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [tutorType, setTutorType] = useState("AI tutor");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState([]);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [learnMoreLiked, setLearnMoreLiked] = useState(false); // State to track like beside "Would you like to learn more?"
  const [learnMoreDisliked, setLearnMoreDisliked] = useState(false); // State to track like beside "Would you like to learn more?"
  const [displayCount, setDisplayCount] = useState(15); // Number of messages to display initially
  const [isHideContain, setIsHideContain] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false); // State to toggle modal visibility
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [feedback,setFeedback]=useState("");

  const { saveChat, chatData, showMenu, setShowMenu, handleResponseFeedback, SaveResponseUnderstand, showLoading, setShowLoading, handleSaveQuestions, handleSetError } = useAuth();

  const recognitionRef = useRef(null);

  const [isListening, setIsListening] = useState(false); // for managing  speech recognition

  const params = useParams();

  const handleChatDataSequentially = (chatDataArray) => {
    const newMessages = chatDataArray.flatMap((chatData) => {
      const messageQueue = [];
      if (chatData.question) {
        messageQueue.push({ role: "user", content: chatData.question });
      }
      if (chatData.answer) {
        messageQueue.push({ role: "assistant", content: chatData.answer });
      }
      return messageQueue;
    });
  
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };
  
  
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && chatData.length > 0) {
      handleChatDataSequentially(chatData);
      isInitialized.current = true; // Mark as initialized
    }
  }, [chatData]);
  

  const fetchResponse = async (message) => {
    try {
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }


      // Reset like/dislike states for each new response
      setLiked(false);
      setDisliked(false);
      setLearnMoreLiked(false);
      setLearnMoreDisliked(false);
      setIsGenerating(true)
      const response = await fetch("/api/generateChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          previousMessages: messages,
          model: model || "gpt-4o-mini",
          tutorType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulatedText = "";
      let tokenUsage = {};  // Variable to store token usage data

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split("\n");

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.replace(/^data: /, "").trim();

            if (jsonString === "[DONE]") {
              break;
            }

            try {
              const messageData = JSON.parse(jsonString);
              // Check if this is the token usage data
              if (messageData.usage) {
                tokenUsage = messageData.usage;
              } else if (messageData.content) {
                const content = messageData.content;
                accumulatedText += content;
                setTypingMessage((prev) => prev + content);
                await new Promise((r) => setTimeout(r, 10)); // Keep delay minimal for smoother experience
              }
            } catch (parseError) {
              console.error("JSON parsing error:", parseError);
              console.error("Malformed line:", jsonString);
            }
          }
        }
      }

      await saveChat({
        chatId: params.id,
        question: message,
        answer: accumulatedText,
        usage: tokenUsage
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: accumulatedText }
      ]);
      setTypingMessage("");
      setLoading(false);
      setShowFollowUp(true);

      // // const data = await response.json();
      // // console.log('Response data:', data);
      // setTypingMessage('');
      // simulateTyping(data.content);
      // // Save chat history after response is received
      // saveChat({chatId:params.id,question:message,answer:data.content})
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Error fetching response" },
      ]);
      setLoading(false);
      setTypingMessage("");
      setShowFollowUp(true);
    } finally {
      setIsGenerating(false);
    }
  };


  const fetchResponseWithFile = async (message) => {
    try {
      console.log("fetching using file....")
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }


      // Reset like/dislike states for each new response
      setLiked(false);
      setDisliked(false);
      setLearnMoreLiked(false);
      setLearnMoreDisliked(false);
      setIsGenerating(true)
      const response = await fetch(`/api/generateChatWithFile?action=chatWithFile&chatId=${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          tutorType,
        }),
      });

      if (!response.ok) {
        // Read the response body as JSON
    const errorData = await response.json();
    // Display the error message
    console.error("Error:", errorData.message || "Unknown error occurred");
      handleSetError(errorData.message || "error while fetching")
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedMessage = "";
      let finalResponse;
      let tokenUsage = {};  // Variable to store token usage data

      // Read streamed data
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split("\n");

        for (let line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.replace(/^data: /, "").trim();

            if (jsonString === "[DONE]") {
              break;
            }

            try {
              const messageData = JSON.parse(jsonString);
              // Check if this is the token usage data
              if (messageData.usage) {
                tokenUsage = messageData.usage;
              } else if (messageData.value) {
                const content = messageData.value;
                accumulatedMessage += content;
                setTypingMessage((prev) => prev + content);
                await new Promise((r) => setTimeout(r, 10)); // Keep delay minimal for smoother experience
              } else if (messageData.finalResponse) {
                finalResponse = messageData.finalResponse
              }
            } catch (parseError) {
              console.error("JSON parsing error:", parseError);
              console.error("Malformed line:", jsonString);
            }
          }
        }
      }

      await saveChat({
        chatId: params.id,
        question: message,
        answer: accumulatedMessage,
        usage: tokenUsage
      });


      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: accumulatedMessage }
      ]);
      setTypingMessage("");
      setLoading(false);
      setShowFollowUp(true);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Error fetching response" },
      ]);
      setLoading(false);
      setTypingMessage("");
      setShowFollowUp(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async (message) => {
    if (isGenerating == true) {
      return;
    }
    setSuggestedQuestions([]);
    setDisplayCount(20);
    setShowFollowUp(false);
    if (message.trim() !== "") {
      const newMessage = { role: "user", content: message };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        // Save chat history after user sends a message
        return updatedMessages;
      });
      setInput("");
      setLoading(true);
      setIsHideContain(true);
      if (chatRes.personalContent) {
        await fetchResponseWithFile(message)
      } else {
        await fetchResponse(message);
      }
      handleSuggestionClick(null);
    }
  };

  const fetchPrompts = async () => {
    try {
      setShowLoading(true);
      console.log("fetching non personal content...")
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const response = await fetch("/api/generatePrompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject:chatRes.title, category:chatRes.category, personalContent:false }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestedQuestions(data.questions.slice(0, 3));
      handleSaveQuestions(params.id,data.questions)
      setShowLoading(false);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };
  const fetchPersonalPrompts = async () => {
    try {
      console.log("Personal content question fetching ....")
      setShowLoading(true);
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const response = await fetch(`/api/assistant?action=fetchQuestions&chatId=${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChatRes(data.chatData)
      console.log(data)
      setSuggestedQuestions(data.chatData.questions.questions);
      setShowLoading(false);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setShowLoading(false)
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 15); // Increase the number of displayed messages by 50
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion == null) {
      return;
    }
    setShowFollowUp(false); // hide follow button
    setLiked(false);
    setDisliked(false);
    setLearnMoreLiked(false);
    setSelectedSuggestion(null);
    console.log("Suggestion clicked:", suggestion); // Debug output
    if (selectedSuggestion === suggestion) return; // Prevent re-selection
    setSelectedSuggestion(suggestion);
    handleSend(suggestion);
  };

  // const simulateTyping = (text) => {
  //   const words = text.split(' ');
  //   let currentIndex = 0;

  //   setTypingMessage('');
  //   const intervalId = setInterval(() => {
  //     if (currentIndex < words.length) {
  //       setTypingMessage((prev) => prev + words[currentIndex] + ' ');
  //       currentIndex++;
  //     } else {
  //       clearInterval(intervalId);
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { role: 'assistant', content: text },
  //       ]);
  //       setTypingMessage('');
  //       setLoading(false);
  //       setShowFollowUp(true);
  //     }
  //   }, 10);

  // };

  const handleFollowUp = async (action) => {
    setSuggestedQuestions([]);
    setShowLoading(true)
    setSelectedSuggestion(null)
    if (action === "learnMore") {
      try {
        const token = await getAuthToken(); // Retrieve the token using the utility function

        let sendData;
        if (chatRes.personalContent) {
          sendData = {
            summary: chatRes.questions.summary,
            personalContent: true
          }
        } else {
          sendData = {
            subject: subCategory,
            category,
            personalContent: false
          }
        }

        if (!token) {
          throw new Error("No authentication found");
        }
        const response = await fetch("/api/generatePrompts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sendData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setFollowUpSuggestions(data.questions.slice(0, 3));
        setShowLoading(false)
      } catch (error) {
        console.error("Error fetching more prompts:", error);
      }
    } else if (action === "dislike") {
      const userMessage = {
        role: "user",
        content:
          "Would it be possible for your response to be made clearer?",
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      await fetchResponse(userMessage.content);
    }
  };

  const handleLikeClick = () => {
    if (liked || disliked) return; // Prevent further changes if already liked or disliked
    SaveResponseUnderstand(params.id, true);
    setLiked(true);
    setDisliked(false); // Ensure dislike is resetsetLiked((prev) => !prev);
    if (!liked) setDisliked(false); // Ensure dislike is reset if like is clicked
  };

  const handleDislikeClick = () => {
    // alert("bhdshbd")
    setIsPopupVisible(!isPopupVisible);
    setIsExpanded(false);
    if (liked || disliked) return; // Prevent further changes if already liked or disliked
    // SaveResponseUnderstand(params.id, false);
    // handleSend("Would it be possible for your response to be made clearer?");
    setDisliked(true);
    setLiked(false); // Ensure like is reset
  };

  const handleLearnMoreLikeClick = () => {
    setSuggestedQuestions([]);
    if (learnMoreLiked || learnMoreDisliked) return; // Prevent further changes if already liked or disliked
    setLearnMoreLiked(true);
    setLearnMoreDisliked(false); // Ensure dislike is reset
    setIsHideContain(true);
    handleFollowUp("learnMore");
  };

  const handleLearnMoreDislikeClick = () => {
    if (learnMoreLiked || learnMoreDisliked) return; // Prevent further changes if already liked or disliked
    setLearnMoreDisliked(true);
    setLearnMoreLiked(false); // Ensure like is reset
  };


  const fetchFirstData = async () => {

    if (chatData.length == 0 && loading == false && showSuggestions && chatRes.personalContent == false) {
      await fetchPrompts();
      // console.log("chat Data :",chatData);
    } else if (chatData.length == 0 && loading == false && showSuggestions && chatRes.personalContent == true && !chatRes.questions) {
      await fetchPersonalPrompts();
    }

  }

  //speech recognition setup
  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => console.log("Voice recognition started.");
    recognition.onend = () => console.log("Voice recognition stopped.");
    recognition.onerror = (event) => console.error("Recognition error:", event.error);

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      let previousInput = ""; // Store the last input to compare

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript + " ";
        }
      }

      // Combine final and interim transcripts, but avoid repeating the same phrase
      const combinedTranscript = (finalTranscript + interimTranscript).trim();

      if (combinedTranscript !== previousInput) {
        previousInput = combinedTranscript; // Update previous input for comparison
        setInput((prev) => combinedTranscript);
      }
    };


    return recognition;
  };

  useEffect(() => {
    recognitionRef.current = initializeRecognition();
    return () => {
      // Proper cleanup
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onspeechend = null;
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  useEffect(() => {
    if (chatRes) {
      if (!chatRes.questions) {
        fetchFirstData()
      } else {
        if(chatRes.personalContent){
          setSuggestedQuestions(chatRes.questions.questions);
        }else{
          setSuggestedQuestions(chatRes.questions);
        }
      }
    }
  }, [subCategory]);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  // Allowed file types
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  // Function to handle file uploads
  const handleFileUpload = async (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert("Unsupported file type. Please upload a valid file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error("No authentication found");
      }

      // Show uploaded file in chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "user",
          content: file.type.startsWith("image/")
            ? "Uploaded an image:"
            : `Uploaded file: ${file.name}`,
          image: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
        },
      ]);

      setLoading(true);
      setTypingMessage("Processing the uploaded file...");

      // Send file to the API for processing
      const response = await fetch("/api/processFile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Display assistant's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.response },
      ]);
      setTypingMessage("");
      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Error processing the uploaded file." },
      ]);
      setTypingMessage("");
      setLoading(false);
    }
  };

  // Triggered when a file is selected
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowFileUploadModal(false); // Close modal
      handleFileUpload(file);
    }
  };

  // Handle Google Drive upload
  const handleGoogleDriveUpload = () => {
    setShowFileUploadModal(false); // Close modal
    alert("Google Drive integration coming soon!");
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setIsExpanded(false);
    setShowThankYou(false);
  };

  // const togglePopup = () => {
  //   setIsPopupVisible(!isPopupVisible);
  //   setIsExpanded(false);
  // };

  const expandPopup = () => {
    setIsExpanded(true);
  };

  const handleOptionClick = async(e) => {
    e.preventDefault();
    await handleResponseFeedback(params.id,e.target.value)
    setShowThankYou(true);
    setTimeout(() => {
      closePopup();
    }, 3000); // Close after 3 seconds
  };

  const handleFormSubmit = async(event) => {
    event.preventDefault();
    await handleResponseFeedback(params.id,feedback)
    setShowThankYou(true);
    setFeedback("")
    setTimeout(() => {
      closePopup();
    }, 3000); // Close after 3 seconds
  };


  const handleInputChange = (e) => {
    const textarea = e.target;
    setInput(textarea.value);

    // Adjust height dynamically
    textarea.style.height = "15px"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set based on scrollHeight
  };


  return (
    <div
      className={styles.chatContainer}
      style={{ paddingTop: !showMenu ? "60px" : "" }}
    >
      {/* <button onClick={handleShowHistory} className={styles.showHistoryButton}>
        Show History
      </button> */}

      <h1
        className={styles.subjectTitle}
        style={{ fontWeight: 600, fontSize: 18 }}
      >
        {subCategory}
      </h1>
      <Header onTutorChange={setTutorType} onModelChange={setModel} />
      <div className={styles.messages}>
        {chatData.length == 0 && showSuggestions && (
          <div className={styles.suggestions}>
            {chatRes && chatRes.personalContent ? chatRes.questions && <>
              <p style={{ fontSize: 15, fontWeight: "600", marginBottom: "10px" }}>
                {chatRes.questions.greeting}
              </p>
              {chatRes.questions.questions && <p style={{ color: "gray", fontSize: 14, marginTop: 8 }}>
                Here are a few questions you might consider asking:
              </p>}
            </>
              :
              <>
                <p style={{ fontSize: 15, fontWeight: "600" }}>
                  Hello, what would you like help with in {subCategory}?
                </p>
                <p style={{ color: "gray", fontSize: 14, marginTop: 8 }}>
                  Here are a few questions you might consider asking:
                </p>
              </>}
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className={`${styles.suggestionButton} ${selectedSuggestion ? styles.disabled : ""
                  } ${selectedSuggestion === question ? styles.selected : ""}`}
                disabled={selectedSuggestion && selectedSuggestion !== question}
              >
                {question}
              </button>
            ))}

          </div>
        )}

        {displayCount < chatData.length && (
          <button onClick={handleLoadMore} className={styles.loadMoreButton}>
            Load More Messages
          </button>
        )}
        
        {Array.isArray(messages) &&
          messages.slice(-displayCount).map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${styles[msg.role]}`}
            >
              {msg.role === "assistant" ? (
                <div className={`${styles.assistantMessageai}`} id="ai">
                  <Image
                    src={logo}
                    width={40}
                    height={40}
                    alt="Assistant Logo"
                    className={styles.assistantLogo}
                  />
                  <div className={styles.dummyText}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    <div className={styles.tools}>
                      <ReadAloudButton content={msg.content} />
                      <CopyButton content={msg.content}><Copy size={17} /></CopyButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 15 }} className={styles.userMessage}>
                  <Image
                    src={user}
                    width={20}
                    height={20}
                    alt="User Logo"
                    className={styles.userLogotyping}
                  />
                  <div className={styles.dummyText}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>

                  </div>
                </div>
              )}
            </div>
          ))}

        {loading && !typingMessage && <div className={styles.loading}>.</div>}
        {typingMessage && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.assistantMessageai}>
              <Image
                src={logo}
                width={40}
                height={40}
                alt="Assistant Logo"
                className={styles.assistantLogo}
              />
              <div className={styles.dummyText}>
                <ReactMarkdown>{typingMessage}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        {showFollowUp && !typingMessage && (
          <div className={styles.followUp}>
            {isHideContain == true ? (
              <p className={styles.followUpQuestion}>
                <span
                  role="button"
                  onClick={() => handleFollowUp("learnMore")}
                  style={{
                    cursor: "pointer",
                    fontWeight: "600",
                    marginRight: "10px",
                    fontSize: 14,
                    color: "black",
                  }}
                >
                  Do you understand the response?
                </span>
                <button
                  className={`${styles.likeDislikeButton} ${styles.likeButton} ${liked ? styles.clicked : ""}`}
                  onClick={handleLikeClick}
                  disabled={liked || disliked} // Disable after one choice
                >
                  <Like alt="Like" />
                </button>
                <button
                  className={`${styles.likeDislikeButton} ${styles.dislikeButton} ${disliked ? styles.clicked : ""}`}
                  onClick={handleDislikeClick}
                  disabled={liked || disliked} // Disable after one choice
                >
                  <Dislike alt="Dislike" />
                </button>
              </p>
            ) : null}

            <div className={styles.popupContainer}>
              {isPopupVisible && (
                <div className={isExpanded ? styles.popupExpanded : styles.popup}>
                  {!showThankYou ? (
                    <>
                      <div className={styles.popupHeader}>
                        <p className={styles.popupTitle}>
                          {isExpanded ? "Add your feedback:" : "Tell us more:"}
                        </p>
                        <button className={styles.closeButton} onClick={closePopup}>
                          ×
                        </button>
                      </div>

                      {!isExpanded ? (
                        <div className={styles.optionsGrid}>
                          <button
                            className={styles.optionButton}
                            onClick={(e)=>handleOptionClick(e)}
                            value="Response was incorrect"
                          >
                            Response was incorrect
                          </button>
                          <button
                            className={styles.optionButton}
                            onClick={(e)=>handleOptionClick(e)}
                            value="Didn’t understand my question"
                          >
                            Didn&apos;t understand my question
                          </button>
                          <button
                            className={styles.optionButton}
                            onClick={(e)=>handleOptionClick(e)}
                            value="Response was confusing"
                          >
                            Response was confusing
                          </button>
                          <button
                            className={styles.optionButton}
                            onClick={(e)=>handleOptionClick(e)}
                            value="Not factually correct"
                          >
                            Not factually correct
                          </button>
                          <button
                            className={styles.optionButton}
                            onClick={(e)=>handleOptionClick(e)}
                            value="Didn't fully follow instructions"
                          >
                            Didn&apos;t fully follow instructions
                          </button>
                          <button
                            className={styles.optionButton}
                            onClick={() => setIsExpanded(true)}
                          >
                            More...
                          </button>
                        </div>
                      ) : (
                        <form className={styles.expandedForm} onSubmit={handleFormSubmit}>
                        <textarea
                          className={styles.textArea}
                          name="feedback"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Add your comments here..."
                        ></textarea>
                        <button type="submit" className={styles.submitButton}>
                          Submit
                        </button>
                      </form>
                      
                      )}
                    </>
                  ) : (
                    <div className={styles.thankYouMessage}>
                      <p>Thanks for your feedback!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {liked && (
              <>
                {isHideContain == true ? (
                  <p className={styles.followUpQuestion}>
                    <span
                      style={{
                        cursor: "pointer",
                        fontWeight: "600",
                        marginRight: "10px",
                        fontSize: 14,
                        color: "black",
                      }}
                    >
                      Would you like to learn more?
                    </span>
                    <button
                      className={`${styles.likeDislikeButton} ${styles.likeButton} ${learnMoreLiked ? styles.clicked : ""}`}
                      onClick={handleLearnMoreLikeClick}
                      disabled={learnMoreLiked || learnMoreDisliked} // Disable after one choice
                    >
                      <Like alt="Learn more like" />
                    </button>
                    <button
                      className={`${styles.likeDislikeButton} ${styles.learnMoreDislikeButton} ${learnMoreDisliked ? styles.clicked : ""}`}
                      onClick={handleLearnMoreDislikeClick}
                      disabled={learnMoreLiked || learnMoreDisliked} // Disable after one choice
                    >
                      <Dislike alt="Learn More Dislike" />
                    </button>

                  </p>
                ) : null}

                {learnMoreLiked ? (
                  <p style={{ color: "gray", fontSize: 14, marginTop: -5 }}>
                    Here are a few questions you might consider asking:
                  </p>
                ) : null}

                {learnMoreLiked && !showLoading &&
                  followUpSuggestions.map((question, index) => (
                    <>
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(question)}
                        className={`${styles.suggestionButton} ${selectedSuggestion ? styles.disabled : ""
                          } ${selectedSuggestion === question ? styles.selected : ""
                          }`}
                      >
                        {question}
                      </button>
                    </>
                  ))}
              </>
            )}

            {/* {disliked && (
              <p className={styles.followUpPrompt}>
              Would it be possible for your response to be made clearer?
              </p>
            )} */}
          </div>
        )}

        <div ref={messagesEndRef} />
        {showLoading && <div class="loader"></div>}
      </div>

      <div className={styles.inputContainer}>
        {/* <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Type your message..."
          className={styles.input}
          maxLength={200}
        /> */}
        <textarea
          className={styles.input}
          value={input}
          style={{resize: "none", // Disable manual resizing
          height:"38px",
        minHeight: "35px", // Minimum height
        maxHeight: "200px", // Maximum height for scrolling
        overflowY: input.length > 0 ? "auto" : "hidden", // Scroll only if content exceeds
        border: "1px solid #ccc",
        boxSizing: "border-box", // Include padding in width/height
        }}
          onChange={handleInputChange}
          placeholder="Type your message..."
        ></textarea>
        {/* <div className={styles.fileUploadContainer}>
          <button
            className={styles.fileUploadButton}
            onClick={() => setShowFileUploadModal(true)}
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            accept=".txt,.pdf,.doc,.docx,.xlsx" // Supported file formats
          />
        </div> */}

        {showFileUploadModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button
                className={styles.optionButton}
                onClick={() => document.getElementById("fileInput").click()}
              >
                Upload from Computer
              </button>
              <button
                className={styles.optionButton}
                onClick={handleGoogleDriveUpload}
              >
                Upload from Google Drive
              </button>
              <button
                className={styles.closeButton}
                onClick={() => setShowFileUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          className={styles.inputMic}
          onClick={toggleListening} // Use toggle function for click
          style={{ background: isListening ? "red" : "transparent" }}
        >
          <Mic />
        </button>


        <button onClick={() => handleSend(input)} className={styles.sendButton}>
          <Image src={share} width={20} height={20} alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
