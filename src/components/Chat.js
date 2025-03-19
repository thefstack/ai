import React, { useState, useEffect, useRef } from 'react';
import styles from '@/css/ChatAI.module.css';
import Image from 'next/image';
import logo from '@/assets/logo.png';
import user from '@/assets/user.png';
import share from '@/assets/share.png';
import { Mic } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import Header from './Header';
import { useLesson } from '@/context/LessonContext';
import { getAuthToken } from '@/utils/getAuthToken';

const Chat = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Hello!' },
    { role: 'assistant', content: 'Hello, Ivy Ai Tutor is here to help. Ask any question within the lesson plan' }
  ]); // Test data to confirm rendering
  const [typingMessage, setTypingMessage] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [tutorType, setTutorType] = useState('AI tutor');
  const messagesEndRef = useRef(null);

  const recognitionRef = useRef(null);

    const [isListening, setIsListening] = useState(false); // for managing  speech recognition

  const { lessonPlan } = useLesson();

  const fetchResponse = async (message) => {
    try {
      const token = await getAuthToken();  // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }
        const response = await fetch('/api/generateAiChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message, previousMessages: messages, lessonPlan, model: model || 'gpt-4', tutorType }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        setLoading(true);
        let accumulatedText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value, { stream: true });
            const lines = textChunk.split('\n');

            for (let line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonString = line.replace(/^data: /, '').trim();

                    if (jsonString === "[DONE]") {
                        break;
                    }

                    try {
                        const messageData = JSON.parse(jsonString);
                        if (messageData.content) {
                            const content = messageData.content;
                            accumulatedText += content;
                            setTypingMessage(prev => prev + content);
                            await new Promise(r => setTimeout(r, 10)); // Keep delay minimal for smoother experience
                        }
                    } catch (parseError) {
                        console.error('JSON parsing error:', parseError);
                        console.error('Malformed line:', jsonString);
                    }
                }
            }
        }

        setMessages(prevMessages => [
            ...prevMessages,
            { role: 'assistant', content: accumulatedText },
        ]);
        setTypingMessage('');
        setLoading(false);

    } catch (error) {
        console.error('Error fetching response:', error);
        setMessages(prevMessages => [
            ...prevMessages,
            { role: 'system', content: 'Error fetching response' },
        ]);
        setLoading(false);
    }
};




  const handleSend = async (message) => {
    if (message.trim() !== '') {
      const newMessage = { role: 'user', content: message };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      setLoading(true);
      await fetchResponse(message);
    }
  };

  // voice input
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

  
  const handleInputChange = (e) => {
    const textarea = e.target;
    setInput(textarea.value);

    // Adjust height dynamically
    textarea.style.height = "15px"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set based on scrollHeight
  };


  return (
    <div className={styles.chatContainer}>
      <Header onTutorChange={setTutorType} onModelChange={setModel} />
      <div className={styles.messages}>
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
            {msg.role === 'assistant' ? (
              <div className={styles.assistantMessage}>
                <Image style={{marginLeft:"-2px"}} src={logo} width={25} height={25} alt="Assistant Logo" className={styles.assistantLogo} />
                <div className={styles.messageContent}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className={styles.userMessage}>
                <Image src={user} width={15} height={15} alt="User Logo" className={styles.userLogo} />
                <div className={styles.messageContent}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && !typingMessage && (
          <div className={styles.loading}>.</div>
        )}
        {typingMessage && (
    <div className={`${styles.message} ${styles.assistant}`}>
        <div className={styles.assistantMessage}>
            <Image src={logo} width={20} height={20} alt="Assistant Logo" className={styles.assistantLogo} />
            <div className={styles.messageContent}>
                <ReactMarkdown>{typingMessage}</ReactMarkdown>
            </div>
        </div>
    </div>
)}

        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        {/* <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
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
