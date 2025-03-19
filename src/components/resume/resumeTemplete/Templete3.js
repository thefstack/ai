import React from "react";
import styles from "@/css/resume/templates/Template3.module.css"
import { Phone, Mail, MapPin } from "lucide-react";

const Templete3 = () => {
  return (
    <div className={styles.resumeContainer}>
      {/* Header Section */}
      <header className={styles.resumeHeader}>
        <h1 className={styles.resumeName}>
          Debraj <span className={styles.surname}>Chakraborty</span>
        </h1>
        <div className={styles.jobTitleBox}>
          <h2 className={styles.resumeTitle}>Full Stack Developer</h2>
        </div>
        <p className={styles.summary}>
          Experienced Full Stack Developer skilled in building scalable web applications using React.js, Node.js, and MongoDB.
          Proficient in developing RESTful APIs, database management, and cloud services. Passionate about creating efficient,
          secure, and user-friendly solutions.
        </p>
        <div className={styles.contactInfo}>
          <span><Phone size={14} /> 7699404172</span>
          <span><Mail size={14} /> tech1@ivyproschool.com</span>
          <span><MapPin size={14} /> Kolkata, WB, India</span>
        </div>
      </header>

      <hr className={styles.sectionDivider} />
      <hr className={styles.doubleDivider} />

      {/* Experience Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>Professional Experience</h3>
        <div className={styles.experienceItem}>
          <span className={styles.date}>Jun 2024 - Present</span>
          <div>
            <p className={styles.experienceTitle}>Full Stack Developer</p>
            <p className={styles.companyName}>Ivy Knowledge Services Pvt Ltd, Kolkata</p>
            <p className={styles.text}>
              Responsible for designing, developing, and maintaining scalable web applications.
            </p>
          </div>
        </div>
        <div className={styles.experienceItem}>
          <span className={styles.date}>Jun 2024 - Present</span>
          <div>
            <p className={styles.experienceTitle}>Full Stack Developer</p>
            <p className={styles.companyName}>Ivy Knowledge Services Pvt Ltd, Kolkata</p>
            <p className={styles.text}>
              Responsible for designing, developing, and maintaining scalable web applications.
            </p>
          </div>
        </div>
        <div className={styles.experienceItem}>
          <span className={styles.date}>Jun 2024 - Present</span>
          <div>
            <p className={styles.experienceTitle}>Full Stack Developer</p>
            <p className={styles.companyName}>Ivy Knowledge Services Pvt Ltd, Kolkata</p>
            <p className={styles.text}>
              Responsible for designing, developing, and maintaining scalable web applications.
            </p>
          </div>
        </div>
      </section>

      <hr className={styles.sectionDivider} />
      <hr className={styles.doubleDivider} />

      {/* Education Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>Education</h3>
        <div className={styles.educationItem}>
          <span className={styles.date}>Jun 2016 - Jul 2020</span>
          <div>
            <p className={styles.educationTitle}>B.Tech in Computer Science & Engineering</p>
            <p className={styles.text}>Maulana Abul Kalam Azad University of Technology (MAKAUT)</p>
          </div>
        </div>
      </section>

      <hr className={styles.sectionDivider} />
      <hr className={styles.doubleDivider} />

      {/* Certifications Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>Certifications</h3>
        <div className={styles.certificationItem}>
          <a href="#" className={styles.certificationName}>Full Stack Web Development Certification</a>
          <span className={styles.date}>Feb 2023</span>
        </div>
      </section>

      <hr className={styles.sectionDivider} />
      <hr className={styles.doubleDivider} />

      {/* Skills Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>Skills</h3>
        <p className={styles.skills}><strong>Frontend:</strong> ReactJS, JavaScript, HTML5, CSS, Next.js</p>
        <p className={styles.skills}><strong>Backend:</strong> Node.js, PHP, CodeIgniter, Express.js</p>
        <p className={styles.skills}><strong>Database:</strong> MySQL, MongoDB, Firebase</p>
        <p className={styles.skills}><strong>API & Integration:</strong> REST API, OpenAI API, Payment Gateway Integration</p>
        <p className={styles.skills}><strong>Cloud & DevOps:</strong> AWS, Azure, GitHub, Bitbucket</p>
      </section>

      <hr className={styles.sectionDivider} />
      <hr className={styles.doubleDivider} />

      {/* Projects Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>Projects</h3>
        <div className={styles.projectItem}>
          <span className={styles.date}>2023</span>
          <div>
            <p className={styles.projectTitle}>AI Chatbot for Learning</p>
            <p className={styles.text}>Developed an AI-powered tutor bot using Next.js and OpenAI API.</p>
          </div>
        </div>
      </section>

      <hr className={styles.sectionDivider} />
      <hr className={styles.doubleDivider} />

      {/* Interests Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>Interests</h3>
        <p className={styles.text}>AI & Machine Learning, Cloud Computing, Open Source Contributions, Tech Blogging.</p>
      </section>

      <hr className={styles.sectionDivider} />
      <hr className={styles.doubleDivider} />

      {/* Conclusion Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>Conclusion</h3>
        <p className={styles.text}>
          Passionate about solving real-world problems through technology. Always eager to learn, collaborate,
          and contribute to impactful projects.
        </p>
      </section>
    </div>
  );
};

export default Templete3;
