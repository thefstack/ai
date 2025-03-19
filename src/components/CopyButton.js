import React, { useState } from 'react';
import Tooltip from './ToolTips'; // Import Tooltip component
import styles from '@/css/Copy.module.css'; // Add your CSS file for styling

const CopyButton = ({ content,ToolTipColor,children }) => {
  const [isCopied, setIsCopied] = useState(false); // State to manage the notification

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setIsCopied(true); // Show the notification
        setTimeout(() => setIsCopied(false), 2000); // Hide after 2 seconds
      }).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      alert('Clipboard API is not supported in your browser.');
    }
  };

  return (
    <>
      {/* Conditionally render the "Copied to clipboard" message at the top */}
      {isCopied && (
        <div className={styles.copiedNotification}>
          Copied to clipboard!
        </div>
      )}

      <Tooltip text="Copy" ToolTipColor={ToolTipColor}> {/* Wrap the button with Tooltip */}
        <button
          onClick={copyToClipboard}
          className={styles.copyButton}  // Apply CSS class
        >
          {children}
        </button>
      </Tooltip>
    </>
  );
};

export default CopyButton;
