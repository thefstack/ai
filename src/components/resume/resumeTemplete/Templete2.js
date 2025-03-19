import React from "react";
import styles from "@/css/resume/templates/Template2.module.css";

const Template2 = ({ resume }) => {
    if (!resume) return <p>Loading...</p>;

    const {
        jobTitle,
        jobDescription,
        personalInfo,
        experience,
        education,
        certifications,
        projects,
        skills = {},
        socialLinks,
        customSections
    } = resume;

    return (
        <div className={styles.resumeContainer}>
            {/* Header Section */}
            <header className={styles.resumeHeader}>
                <h1 className={styles.resumeName}>{personalInfo?.firstName} {personalInfo?.lastName}</h1>
                <div className={styles.contactInfo}>
                    <a href={`tel:${personalInfo?.phone}`} className={styles.contactLink}>{personalInfo?.phone}</a> •
                    <a href={`mailto:${personalInfo?.email}`} className={styles.contactLink}>{personalInfo?.email}</a> •
                    <span>{personalInfo?.location?.address}, {personalInfo?.location?.city}, {personalInfo?.location?.state}, {personalInfo?.location?.country}</span> •
                    {socialLinks?.linkedin && <a href={socialLinks.linkedin} className={styles.contactLink}>LinkedIn</a>}
                </div>
            </header>

            <hr className={styles.sectionDivider} />
            <section className={styles.resumeTitleSection}>
                <h2 className={styles.resumeTitle}>{jobTitle}</h2>
            </section>

        

            {experience.length > 0 && (
                <>
                    <hr className={styles.sectionDivider} />
                    <h3 className={styles.sectionTitle}>Professional Experience</h3>
                    <hr className={styles.doubleDivider} />
                    <section className={styles.resumeSection}>
                        {experience.map((job, index) => (
                            <div key={index} className={styles.job}>
                                <h4 className={styles.jobCompany}>{job.company}, {job.location}</h4>
                                <p className={styles.jobTitle}>{job.title} <span className={styles.date}>{new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : "Present"}</span></p>
                                <p className={styles.text}>{job.description}</p>
                            </div>
                        ))}
                    </section>
                </>
            )}

            {education.length > 0 && (
                <>
                    <hr className={styles.sectionDivider} />
                    <h3 className={styles.sectionTitle}>Education</h3>
                    <hr className={styles.doubleDivider} />
                    <section className={styles.resumeSection}>
                        {education.map((edu, index) => (
                            <div key={index}>
                                <p className={styles.educationTitle}>{edu.institute}</p>
                                <p className={styles.text}>{edu.degree}, {edu.field} (GPA: {edu.cgpa}) - {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </section>
                </>
            )}

            {certifications.length > 0 && (
                <>
                    <hr className={styles.sectionDivider} />
                    <h3 className={styles.sectionTitle}>Certifications</h3>
                    <hr className={styles.doubleDivider} />
                    <section className={styles.resumeSection}>
                        {certifications.map((cert, index) => (
                            <div key={index} className={styles.certificationItem}>
                                <a href={cert.credentialUrl} className={styles.certificationName}>{cert.name}</a>
                                <span className={styles.certificationDate}>{new Date(cert.issueDate).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </section>
                </>
            )}

            {skills.categorySkillsMap && Object.entries(skills.categorySkillsMap).length > 0 && (
                <>
                    <hr className={styles.sectionDivider} />
                    <h3 className={styles.sectionTitle}>Core Competencies</h3>
                    <hr className={styles.doubleDivider} />
                    <section className={styles.resumeSection}>
                        {Object.entries(skills.categorySkillsMap).map(([category, skillList], index) => (
                            <p key={index} className={styles.skills}><strong>{category}:</strong> {skillList.join(", ")}</p>
                        ))}
                    </section>
                </>
            )}

            {projects.length > 0 && (
                <>
                    <hr className={styles.sectionDivider} />
                    <h3 className={styles.sectionTitle}>Projects</h3>
                    <hr className={styles.doubleDivider} />
                    <section className={styles.resumeSection}>
                        {projects.map((project, index) => (
                            <p key={index} className={styles.text}>
                                <strong>{project.title}</strong> - {project.description}
                                <br />
                                ({new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"})
                                <br />
                                <a href={project.url} className={styles.certificationName} style={{ textDecoration: "underline", color: "blue" }}>View</a>
                            </p>
                        ))}
                    </section>
                </>
            )}

            {customSections.length > 0 && customSections.map((section, index) => (
                section.description && section.bullets.length > 0 && (
                    <>
                        <hr className={styles.doubleDivider} />
                        <section key={index} className={styles.resumeSection}>
                            <h3 className={styles.sectionTitle}>{section.description}</h3>
                            <hr className={styles.doubleDivider} />
                            <ul className={styles.text}>
                                {section.bullets.map((bullet) => (
                                    <li key={bullet.id}>{bullet.text}</li>
                                ))}
                            </ul>
                        </section>
                    </>
                )
            ))}
        </div>
    );
};

export default Template2;
