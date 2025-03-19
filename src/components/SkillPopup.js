import React, { useEffect, useState } from "react";
import styles from "@/css/GuidancePopup.module.css";
import { X } from "lucide-react";

const SkillPopup = ({ isOpen, closePopup }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState("");

  useEffect(() => {
    console.log("Popup visibility:", isOpen);
  }, [isOpen]);

  const handleSkillInput = (event) => {
    if (event.key === "Enter" && inputSkill.trim() !== "") {
      addSkill(inputSkill.trim());
      setInputSkill("");
    }
  };

  const handleSkillClick = (skill) => {
    if (!selectedSkills.includes(skill)) {
      addSkill(skill);
    }
  };

  const addSkill = (skill) => {
    setSelectedSkills((prevSkills) => [...prevSkills, skill]);
  };

  const skillSuggestions = ["Javascript", "Python", "SQL", "Machine Learning", "Generative AI", "PowerBI", "Excel"];

  return (
    <div className={styles.popupOverlay} onClick={closePopup}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.skillPopup}>
          <div className={styles.popupHeader}>
            <h3>Add Skill</h3>
            <X size={20} className={styles.closeIcon} onClick={closePopup} />
          </div>
          <p className={styles.requiredText}>*Indicates required</p>
          <label className={styles.label}>Skill*</label>
          <input
            type="text"
            className={styles.popupInput}
            placeholder="Type a skill"
            value={selectedSkills.length > 0 ? selectedSkills.join(" | ") : inputSkill}
            onChange={(e) => setInputSkill(e.target.value)}
            onKeyPress={handleSkillInput}
          />
          <div className={styles.suggestionsBox}>
            <p>Suggested based on your profile</p>
            <div className={styles.suggestionsList}>
              {skillSuggestions.map((skill, index) => (
                <button
                  key={index}
                  className={selectedSkills.includes(skill) ? styles.selectedSkill : styles.skillButton}
                  onClick={() => handleSkillClick(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillPopup;
