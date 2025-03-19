import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import Tooltip from './ToolTips'; // Import Tooltip component
import styles from '@/css/ReadAloud.module.css'; // Add your CSS file for styling

const ReadAloudButton = ({ content }) => {
  const [isReading, setIsReading] = useState(false); // Track if the content is being read
  const readAloud = () => {
    if ('speechSynthesis' in window) {
      console.log(content)
      if (isReading) {
        // If currently reading, stop the speech and set state to false
        speechSynthesis.cancel();
        setIsReading(false);
      } else {
        // If not reading, start reading and change the button state
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.rate = 1; // Speed of speech (1 is the normal rate)
        speechSynthesis.speak(utterance);
        setIsReading(true);

        // Detect when the speech ends, and reset the state
        utterance.onend = () => {
          setIsReading(false);
        };
      }
    } else {
      alert('Sorry, your browser does not support speech synthesis.');
    }
  };

// Effect to handle stopping the speech when the route changes or page is refreshed
useEffect(() => {
  // Function to cancel speech on route change
  const handleRouteChange = () => {
      speechSynthesis.cancel();
      setIsReading(false);
  };

  // Observe when the pathname changes
  handleRouteChange(); // Cancel speech on initial mount
  return () => handleRouteChange(); // Cleanup on unmount
}, []); // Dependency on router to detect route change

  return (
    <Tooltip text="Read Aloud"> {/* Wrap the button with Tooltip */}
      <button
        onClick={readAloud}
        className={`${styles.readAloudButton} ${isReading ? styles.active : ''}`} // Apply active class when reading
      >
        <Volume2 size={17} />
      </button>
    </Tooltip>
  );
};

export default ReadAloudButton;
