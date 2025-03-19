import React, { useState } from "react";
import styles from "@/css/TemplateSelection.module.css";
import Image from "next/image";

// Import template images from assets folder
import Template1Image from "@/assets/temp1.PNG";
import Template2Image from "@/assets/temp2.PNG";
import Template3Image from "@/assets/temp3.PNG";
import { useCustomization } from "@/context/resume/customization-context";

const TemplateSelection = ({onNext}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const {updateTemplate, customization}=useCustomization();

  const handleSelect = (template) => {
    updateTemplate(template)
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select a Professionally Designed Template</h2>
      <p className={styles.subtitle}>Browse styles to match your profile and aspirations.</p>

      <div className={styles.templateGrid}>
        {/* Template 1 */}
        <div
          className={`${styles.templateBox} ${customization.template === "template1" ? styles.selected : ""}`}
          onClick={() => handleSelect("template1")}
        >
          <Image src={Template1Image} alt="Template 1" className={styles.templateImage} />
          <p className={styles.templateName}>Template 1</p>
        </div>

        {/* Template 2 */}
        {/* <div
          className={`${styles.templateBox} ${customization.template === "template2" ? styles.selected : ""}`}
          onClick={() => handleSelect("template2")}
        >
          <Image src={Template2Image} alt="Template 2" className={styles.templateImage} />
          <p className={styles.templateName}>Template 2</p>
        </div> */}

        {/* Template 3 */}
        {/* <div
          className={`${styles.templateBox} ${customization.template === "template3" ? styles.selected : ""}`}
          onClick={() => handleSelect("template3")}
        >
          <Image src={Template3Image} alt="Template 3" className={styles.templateImage} />
          <p className={styles.templateName}>Template 3</p>
        </div> */}
      </div>

      <button className={styles.nextButton} disabled={!customization.template} onClick={()=>    onNext("create")}>
        Continue with {selectedTemplate ? selectedTemplate.replace("template", "Template ") : "Selection"}
      </button>
    </div>
  );
};

export default TemplateSelection;
