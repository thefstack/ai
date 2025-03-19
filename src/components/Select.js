import React, { useState } from 'react';
import styles from '@/css/Selector.module.css';

const Selector = ({ onSelectTutor, onSelectModel }) => {
  const [selectedTutor, setSelectedTutor] = useState('AI tutor');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  const handleTutorChange = (e) => {
    const newTutor = e.target.value;
    setSelectedTutor(newTutor);
    onSelectTutor(newTutor);
  };

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    onSelectModel(newModel);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <label className={styles.labelStyle} >
        Select persona
        <select
          className={styles.selectStyle}
          value={selectedTutor}
          onChange={handleTutorChange}
          style={{
            border: 'none',
            width: '145px',
            padding: '5px',
            marginLeft:"5px",
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            fontWeight: 'bold'
          }}
          onFocus={(e) => e.target.style.backgroundColor = '#e0e0e0'}
          onBlur={(e) => e.target.style.backgroundColor = '#f0f0f0'}
        >
          <option value="AI tutor">AI Tutor</option>
          <option value="Albert Einstein">Albert Einstein</option>
          <option value="Captain America">Captain America</option>
          <option value="Iron Man">Iron Man</option>
        </select>
      </label>
      {/* <label className={styles.labelStyle} >
        Model-
        <select
          className={styles.selectStyle}
          value={selectedModel}
          onChange={handleModelChange}
          style={{
            border: 'none',
            width: '95px',
            padding: '5px',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            fontWeight: 'bold'

          }}
          onFocus={(e) => e.target.style.backgroundColor = '#e0e0e0'}
          onBlur={(e) => e.target.style.backgroundColor = '#f0f0f0'}
        >
          <option value="gpt-3.5">GPT - 3.5</option>
          <option value="gpt-4">GPT - 4</option>
        </select>
      </label> */}
    </div>
  );
};

export default Selector;
