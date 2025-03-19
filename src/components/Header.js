// src/app/components/Header.js
import React, { useState } from 'react';
import Select from './Select';

const Header = ({ onTutorChange, onModelChange }) => {
  const [selectedTutor, setSelectedTutor] = useState('AI tutor');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  const handleTutorChange = (tutor) => {
    setSelectedTutor(tutor);
    onTutorChange(tutor);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    onModelChange(model);
  };

  return (
    <div style={{ marginTop:10}}>
      <Select
        onSelectTutor={handleTutorChange}
        onSelectModel={handleModelChange}
      />
    </div>
  );
};

export default Header;
