import React from 'react';
import "@/css/loading.css"

const Loading = ({text="loading"}) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      <p className="loading-text">{text}</p>
      
    </div>
  );
};
//generate a loading animation with 3 circles


export default Loading;