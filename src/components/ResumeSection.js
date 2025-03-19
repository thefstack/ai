import React, { useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, ArrowLeft, X, MoreHorizontal, Plus, List, FileText, BarChart, BookOpen, Calendar, Briefcase, Building, Edit, School, Award, Trash2, Percent } from "lucide-react";
import styles from "@/css/ResumeSection.module.css";
import Skillup from  "./SkillPopup";
import CategoryPopup from "./CategoryPopup";
import GuidancePopup from "./GuidancePopup";
const sections = [
  { title: "Personal Information", open: true, icon: <List size={18} /> },
  { title: "Work Experience & Education", open: false, icon: <FileText size={18} /> },
  { title: "Skills", open: false, icon: <BarChart size={18} /> },
  { title: "Projects", open: false, icon: <List size={18} /> },
  { title: "Certify Courses", open: false, icon: <BookOpen size={18} /> },
];

const CircularProgress = ({ percentage }) => {
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={radius} stroke="#222222" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx="40"
        cy="40"
        r={radius}
        stroke="#007BFF"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="none">
        {percentage}%
      </text>
    </svg>
  );
};

const ResumeSection = () => {
  const [expandedSections, setExpandedSections] = useState(sections);
  const [activeSection, setActiveSection] = useState(0);
  const [viewGuidance, setViewGuidance] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);
  const [showSkillPopup, setShowSkillPopup] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const openSkillPopup = () => setShowSkillPopup(true);
  const closeSkillPopup = () => setShowSkillPopup(false);
  const [skillPopup,setSkillPopup] = useState(false);
  const [catPopup,setCatPopup] = useState(false);

  const skillSuggestions = ["Javascript", "Python", "SQL", "Machine Learning", "Generative AI", "PowerBI", "Excel"];


  const handleSkillInput = (event) => {
    if (event.key === "Enter" && inputSkill.trim() !== "") {
      setSelectedSkills([...selectedSkills, inputSkill.trim()]);
      setInputSkill("");
    }
  };

  const handleSkillClick = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };


  const toggleSection = (index) => {
    const newSections = expandedSections.map((sec, i) =>
      i === index ? { ...sec, open: !sec.open } : sec
    );
    setExpandedSections(newSections);
    setActiveSection(index);
  };

  const guidanceHandler = () => {
    setViewGuidance(true);
  };
  const skillPopupHandler = () => {
    setSkillPopup(true);
  };
  const catPopupHandler = () => {
    setCatPopup(true);
  };


  const openExperienceSection = (event) => {
    event.preventDefault(); // Prevent page refresh
    setOpenExperience(!openExperience);
  }

  const renderFormContent = () => {
    switch (activeSection) {
      case 0:
        return (
          <>
            <h4>Personal Information</h4>

            <div className={styles.row}>

              <input type="text" placeholder="First Name" className={styles.inputField} />
              <input type="text" placeholder="Last Name" className={styles.inputField} />
            </div>
            <div className={styles.row}>

              <input type="text" placeholder="Headline/Target Job Title" className={styles.inputField} />
            </div>

            <div className={styles.row}>
              <input type="email" placeholder="Email" className={styles.inputField} />
              <input type="tel" placeholder="Phone Number" className={styles.inputField} />
            </div>
            <h4>Location</h4>
            <div className={styles.row}>

              <input type="text" placeholder="Address" className={styles.inputField} />
            </div>

            <div className={styles.row}>
              <input type="text" placeholder="City" className={styles.inputField} />
              <input type="text" placeholder="State" className={styles.inputField} />
            </div>
            <div className={styles.row}>
              <input type="text" placeholder="Country" className={styles.inputField} />
              <input type="text" placeholder="Pin" className={styles.inputField} />
            </div>
            <h4>Social Link</h4>
            <div className={styles.row}>
              <input type="text" placeholder="LinkedIn" className={styles.inputField} />
            </div>
            <div className={styles.row}>
              <input type="text" placeholder="Github (Optional)" className={styles.inputField} />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className={styles.workContainer}>
              <div className={styles.workHeader}>
                <h4 className={styles.exwork}>Work Experience <Edit s size={16} className={styles.editIcon} /></h4>
                <button className={styles.guidanceButton}>
                  <Eye size={16} /> View Guidance
                </button>
              </div>

              <hr className={styles.divider} />

              <div className={styles.experienceBox}>
                <span className={styles.experienceText}>Experience#1</span>
                <div className={styles.experienceIcons}>
                  <Eye size={16} className={styles.icon} />
                  <Trash2 size={16} className={styles.icon} />
                  <ChevronDown size={16} className={styles.icon} />
                </div>
              </div>

              <button className={styles.addExperienceButton} onClick={openExperienceSection}>
                <Plus size={16} /> Add Experience
              </button>
            </div>
            {openExperience && (
              <>
                <div className={styles.workContainer}>

                  <div className={styles.workRow}>
                    <div className={styles.workInputContainer}>
                      <input type="text" placeholder="Job Title" className={styles.workInput} />
                      <Briefcase size={18} className={styles.workIcon} />
                    </div>
                    <div className={styles.workInputContainer}>
                      <input type="text" placeholder="Company" className={styles.workInput} />
                      <Building size={18} className={styles.workIcon} />
                    </div>
                  </div>

                  <div className={styles.workRow}>
                    <div className={styles.workInputContainer}>
                      <input type="text" placeholder="Start Date" className={styles.workInput} />
                      <Calendar size={18} className={styles.workIcon} />
                    </div>
                    <div className={styles.workInputContainer}>
                      <input type="text" placeholder="End Date" className={styles.workInput} />
                      <Calendar size={18} className={styles.workIcon} />
                    </div>
                  </div>

                  <div className={styles.workInputContainer}>
                    <textarea placeholder="Description" className={styles.workInput} rows={4} />
                    <Edit size={18} className={styles.workIcon} />
                  </div>
                </div>
              </>
            )}


            <div className={styles.workContainer}>
              <div className={styles.workHeader}>
                <h4 className={styles.exwork}>Education <Edit s size={16} className={styles.editIcon} /></h4>
                <button className={styles.guidanceButton}>
                  <Eye size={16} /> View Guidance
                </button>
              </div>

              <hr className={styles.divider} />

              <div className={styles.experienceBox}>
                <span className={styles.experienceText}>Education#1</span>
                <div className={styles.experienceIcons}>
                  <Eye size={16} className={styles.icon} />
                  <Trash2 size={16} className={styles.icon} />
                  <ChevronDown size={16} className={styles.icon} />
                </div>
              </div>
              <div className={styles.workRow} style={{ marginTop: 30 }}>
                <div className={styles.workInputContainer} >
                  <input type="text" placeholder="Institute" className={styles.workInput} />
                  <School size={18} className={styles.workIcon} />
                </div>
                <div className={styles.workInputContainer}>
                  <input type="text" placeholder="Degree" className={styles.workInput} />
                  <Award size={18} className={styles.workIcon} />
                </div>
              </div>

              <div className={styles.workRow}>
                <div className={styles.workInputContainer}>
                  <input type="text" placeholder="CGPA" className={styles.workInput} />
                  <Percent size={18} className={styles.workIcon} />
                </div>
                <div className={styles.workInputContainer}>
                  <input type="text" placeholder="Graduation Year" className={styles.workInput} />
                  <Calendar size={18} className={styles.workIcon} />
                </div>
              </div>


            </div>


          </>
        );
      case 2:
        return (
          <div className={styles.workContainer}>
            {/* Header Section */}
            <div className={styles.workHeader}>
              <h4 className={styles.exwork}>
                Skills <Edit size={16} className={styles.editIcon} />
              </h4>
              <button className={styles.guidanceButton}>
                <Eye size={16} /> View Guidance
              </button>
            </div>

            <hr className={styles.divider} />

            {/* Category Section */}
            <div className={styles.skillBox}>
              <span className={styles.skillTitle}>Category</span>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="Add Category" className={styles.skillInput} />
                <div className={styles.icons}>
                  <Edit size={16} className={styles.icon} />
                  <Plus size={16} className={styles.icon} onClick={catPopupHandler} />
                </div>
              </div>
            </div>

            {/* Skill Section */}
            <div className={styles.skillBox}>
              <span className={styles.skillTitle}>Skill</span>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="Add Skill" className={styles.skillInput} />
                <div className={styles.icons}>
                  <Edit size={16} className={styles.icon} />
                  <Plus size={16} className={styles.icon} onClick={skillPopupHandler} />
                </div>
              </div>
            </div>
            {/* {showSkillPopup && (
              <div className={styles.skillPopup}>
                <div className={styles.popupHeader}>
                  <h3>Add Skill</h3>
                  <X size={20} className={styles.closeIcon} onClick={closeSkillPopup} />
                </div>
                <p className={styles.requiredText}>*Indicates required</p>
                <label className={styles.label}>Skill*</label>
                <input 
                  type="text" 
                  className={styles.popupInput} 
                  placeholder="Type a skill" 
                  value={inputSkill} 
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
            )} */}

          </div>
        );
      case 3:
        return (
          <div className={styles.workContainer}>
            <div className={styles.workContainer}>
              {/* Header Section */}
              <div className={styles.header}>
                <h3>Projects</h3>
                <button className={styles.guidanceButton}>
                  <Eye size={16} /> View Guidance
                </button>
              </div>

              {/* Project Card */}
              <div className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <span className={styles.projectTitle}>Project#1</span>
                  <div className={styles.projectIcons}>
                    <Eye size={16} className={styles.icon} />
                    <Trash2 size={16} className={styles.icon} />
                    <ChevronDown size={16} className={styles.icon} />
                  </div>
                </div>

                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Project Title <Edit size={14} /></label>
                    <input type="text" className={styles.inputField} />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Project URL <Edit size={14} /></label>
                    <input type="text" className={styles.inputField} />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Organization</label>
                    <input type="text" className={styles.inputField} />
                  </div>

                  <div className={styles.flexRow}>
                    <div style={{ width: '50%' }} className={styles.formGroup}>
                      <label>City</label>
                      <input type="text" className={styles.inputField} />
                    </div>
                    <div style={{ width: '50%' }} className={styles.formGroup}>
                      <label>Country</label>
                      <input type="text" className={styles.inputField} />
                    </div>
                  </div>

                  <div className={styles.flexRow}>
                    <div style={{ width: '50%' }} className={styles.formGroup}>
                      <label>Start Year</label>
                      <input type="text" className={styles.inputField} />
                    </div>
                    <div style={{ width: '50%' }} className={styles.formGroup}>
                      <label>End Year</label>
                      <input type="text" className={styles.inputField} />
                    </div>
                  </div>

                  <div className={styles.checkboxContainer}>
                    <input type="checkbox" id="currentlyWorking" />
                    <label htmlFor="currentlyWorking">I am Currently working on this project</label>
                  </div>
                </div>

                {/* AI Writing Section */}
                <div className={styles.aiWritingSection}>
                  <div className={styles.aiHeader}>
                    <span className={styles.boldUnderline}>B / U</span>
                    <button className={styles.aiButton}>Write with AI</button>

                  </div>
                  <textarea className={styles.textArea}></textarea>
                </div>

                {/* Footer Buttons */}
                <div className={styles.footerButtons}>
                  <button className={styles.cancelButton}>Cancel</button>
                  <button className={styles.saveButton}>Save</button>
                </div>
              </div>
            </div>
          </div>
        );



      case 4:
        return (
          <div className={styles.workContainer}>
            {/* Header Section */}
            <div className={styles.header}>
              <h3>Certification</h3>
              <button className={styles.guidanceButton}>
                <Eye size={16} /> View Guidance
              </button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.experienceBox}>
              <span className={styles.experienceText}>Certification#1</span>
              <div className={styles.experienceIcons}>
                <Eye size={16} className={styles.icon} />
                <Trash2 size={16} className={styles.icon} />
                <ChevronDown size={16} className={styles.icon} />
              </div>
            </div>

            {/* Certification Card */}
            <div className={styles.certificationCard}>


              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Certification Name</label>
                  <input type="text" className={styles.inputField} />
                </div>

                <div className={styles.formGroup}>
                  <label>Authority</label>
                  <input type="text" className={styles.inputField} />
                </div>

                <div className={styles.formGroup}>
                  <label>Certification URL / Code</label>
                  <input type="text" className={styles.inputField} />
                </div>

                <div className={styles.formGroup}>
                  <label>Certification Date</label>
                  <input type="date" className={styles.inputField} />
                </div>
              </div>

              {/* Footer Button */}
              <div className={styles.footerButtons}>
                <button className={styles.addButton}><Plus size={16} /> Add Certification</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }


  };

  return (


    <div className={styles.container}>



      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <ArrowLeft size={22} className={styles.backIcon} />
          <h2 className={styles.sidebarTitle}>Section</h2>
          <Plus size={22} className={styles.plusIcon} />
        </div>
        {expandedSections.map((section, index) => (
          <div
            key={index}
            className={`${styles.section} ${activeSection === index ? styles.active : ""}`}
            onClick={() => toggleSection(index)}
          >
            <div className={styles.sectionHeader}>
              {section.icon}
              <span className={styles.sectionTitle}>{section.title}</span>
              {section.open ? <Eye size={16} /> : <EyeOff size={16} />}
            </div>
          </div>
        ))}
      </aside>


      <main className={styles.mainContent}>
        <div className={styles.guidanceContainer}>
          <div className={styles.card}>
            <div style={{ display: "flex" }}>
              <FileText size={22} />
              <h4 style={{ marginLeft: 5, marginTop: 2 }}>Resume Analysis Course</h4>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <p style={{ textAlign: 'left', fontSize: 'small', marginTop: 25, width: '50%' }}>
                Aim for a higher score for an optimized resume which follows best practices
              </p>
              <div className={styles.progressCircle}>
                <CircularProgress percentage={17.5} />
              </div>
            </div>
            <button onClick={guidanceHandler} className={styles.guidanceButton}><Eye size={16} /> View Guidance</button>
          </div>
          <div className={styles.card}>
            <div style={{ display: "flex" }}>
              <BarChart size={22} />
              <h4 style={{ marginLeft: 5, marginTop: 2 }}>Skills Score</h4>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <p style={{ textAlign: 'left', fontSize: 'small', marginTop: 25, width: '50%' }}>
                Aim for a higher score for an optimized resume which follows best practices
              </p>
              <div className={styles.progressCircle}>
                <CircularProgress percentage={17.5} />
              </div>
            </div>
            <button className={styles.reportButton}><Eye size={16} /> View Details</button>
          </div>
        </div>



        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            {/* <h3>{expandedSections[activeSection].title}</h3> */}
            {/* <button className={styles.reportButton}><Eye size={16} /> View Guidance</button> */}
          </div>
          <form className={styles.form}>
            {renderFormContent()}
          </form>
        </div>
      </main>
      {viewGuidance && <GuidancePopup isOpen={viewGuidance} closePopup={() => setViewGuidance(false)} />}
      {skillPopup && <Skillup  Open={skillPopup} closePopup={() => setSkillPopup(false)} />}
      {catPopup && <CategoryPopup  Open={catPopup} closePopup={() => setCatPopup(false)} />}





    </div>
  );
};

export default ResumeSection;