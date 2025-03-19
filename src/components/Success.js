import React, { useEffect, useState } from "react";

const Success = ({ message }) => {
  const [visibleMessage, setVisibleMessage] = useState(message);
  useEffect(() => {
    if (message) {
      setVisibleMessage(message);
      const timer = setTimeout(() => {
        setVisibleMessage('');  // Clear the message after 5 seconds
      }, 3000);

      return () => clearTimeout(timer);  // Clear the timer when the component is unmounted or on re-renders
    }
  }, [message]);
 

  return (
    <>
      {visibleMessage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position:"absolute",
            zIndex:999,
            top:"20px",
            left:"50%",
            transform:"translateX(-50%)",
            padding:"10px 15px",
            backgroundColor:'#0bf64fc4',
            borderRadius:"8px"
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {visibleMessage}
          </p>
        </div>
      )}
    </>
  );
};

export default Success;
