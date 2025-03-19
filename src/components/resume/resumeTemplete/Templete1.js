"use client"
import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer"

// Define styles for PDF to exactly match the CSS
const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    fontFamily: "Times-Roman",
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
  },
  resumeContainer: {
    backgroundColor: "white",
  },
  resumeHeader: {
    textAlign: "center",
    marginBottom: 15,
  },
  resumeName: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
    color: "black",
  },
  resumeTitle: {
    fontSize: 15,
    fontFamily: "Helvetica", // Arial equivalent in PDF
    color: "#444",
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addressRow: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  contactItem: {
    fontSize: 14,
    color: "#444",
    marginHorizontal: 4,
    textAlign: "center",
  },
  contactLink: {
    fontSize: 14,
    color: "#1570ef",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#2c5283",
    borderBottomWidth: 2,
    borderBottomColor: "black",
    borderBottomStyle: "solid",
    paddingBottom: 1,
    marginBottom: 10,
  },
  resumeSection: {
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    color: "#333",
    lineHeight: 1.5,
    marginBottom: 3,
  },
  job: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 2,
  },
  company: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#535151",
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 3,
  },
  educationTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    marginBottom: 2,
  },
  certificationLink: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
  skills: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
    lineHeight: 1.5,
  },
  skillCategory: {
    fontWeight: "bold",
    color: "black",
  },
})

// PDF Document Component
const ResumePDF = ({ resume }) => {
  if (!resume) return null

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
    customSections,
  } = resume

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.resumeContainer}>
          {/* Header Section */}
          <View style={pdfStyles.resumeHeader}>
            <Text style={pdfStyles.resumeName}>
              {personalInfo?.firstName} {personalInfo?.lastName}
            </Text>
            <Text style={pdfStyles.resumeTitle}>{jobTitle}</Text>

            {/* Contact Info - First Row: Phone & Email */}
            <View style={pdfStyles.contactRow}>
              <Text style={pdfStyles.contactLink}>{personalInfo?.phone}</Text>
              <Text style={pdfStyles.contactLink}>{personalInfo?.email}</Text>
              {socialLinks?.linkedin && <Text style={pdfStyles.contactLink}>LinkedIn</Text>}
            </View>

            {/* Contact Info - Second Row: Address */}
            <View style={pdfStyles.addressRow}>
              <Text style={pdfStyles.contactItem}>
                {personalInfo?.location?.address}, {personalInfo?.location?.city}, {personalInfo?.location?.state},{" "}
                {personalInfo?.location?.country}
              </Text>
            </View>
          </View>

          {/* Experience Section */}
          {experience?.length > 0 && (
            <View style={pdfStyles.resumeSection}>
              <Text style={pdfStyles.sectionTitle}>EXPERIENCE</Text>
              {experience.map((job, index) => (
                <View key={index} style={pdfStyles.job}>
                  <Text style={pdfStyles.jobTitle}>{job.title}</Text>
                  <Text style={pdfStyles.company}>
                    {job.company} - {job.location}
                  </Text>
                  <Text style={pdfStyles.date}>
                    {new Date(job.startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}{" "}
                    —{" "}
                    {job.endDate
                      ? new Date(job.endDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })
                      : "Present"}
                  </Text>
                  <Text style={pdfStyles.text}>{job.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education Section */}
          {education?.length > 0 && (
            <View style={pdfStyles.resumeSection}>
              <Text style={pdfStyles.sectionTitle}>EDUCATION</Text>
              {education.map((edu, index) => (
                <View key={index} style={pdfStyles.job}>
                  <Text style={pdfStyles.educationTitle}>
                    {edu.degree} - {edu.field}
                  </Text>
                  <Text style={pdfStyles.text}>{edu.institute}</Text>
                  <Text style={pdfStyles.text}>
                    GPA: {edu.cgpa} |{" "}
                    {new Date(edu.startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}{" "}
                    —{" "}
                    {new Date(edu.endDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications Section */}
          {certifications?.length > 0 && (
            <View style={pdfStyles.resumeSection}>
              <Text style={pdfStyles.sectionTitle}>CERTIFICATIONS</Text>
              {certifications.map((cert, index) => (
                <View key={index} style={{ marginBottom: 5 }}>
                  <Text style={pdfStyles.text}>
                    <Text style={pdfStyles.certificationLink}>{cert.name}</Text>
                    {" - "}
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                    {cert.organization && ` (by ${cert.organization})`}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Skills Section */}
          {skills?.categorySkillsMap && Object.entries(skills.categorySkillsMap).length > 0 && (
            <View style={pdfStyles.resumeSection}>
              <Text style={pdfStyles.sectionTitle}>SKILLS</Text>
              {Object.entries(skills.categorySkillsMap).map(([category, skillList], index) => (
                <Text key={index} style={pdfStyles.skills}>
                  <Text style={pdfStyles.skillCategory}>{category}: </Text>
                  {Array.isArray(skillList) ? skillList.join(", ") : skillList}
                </Text>
              ))}
            </View>
          )}

          {/* Projects Section */}
          {projects?.length > 0 && (
            <View style={pdfStyles.resumeSection}>
              <Text style={pdfStyles.sectionTitle}>PROJECTS</Text>
              {projects.map((project, index) => (
                <View key={index} style={pdfStyles.job}>
                  <Text style={pdfStyles.text}>
                    <Text style={{ fontWeight: "bold" }}>{project.title}</Text>
                    {" - "}
                    {project.description}
                  </Text>
                  <Text style={pdfStyles.date}>
                    (
                    {new Date(project.startDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })
                      : "Ongoing"}
                    )
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Custom Sections */}
          {customSections &&
            customSections.map(
              (section, index) =>
                section.description &&
                section.bullets.length > 0 && (
                  <View key={index} style={pdfStyles.resumeSection}>
                    <Text style={pdfStyles.sectionTitle}>{section.description}</Text>
                    {section.bullets.map((bullet) => (
                      <Text key={bullet.id} style={pdfStyles.text}>
                        • {bullet.text}
                      </Text>
                    ))}
                  </View>
                ),
            )}
        </View>
      </Page>
    </Document>
  )
}

const Template1 = ({ resume }) => {
  if (!resume) return <p>Loading...</p>

  const { personalInfo } = resume

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* PDF Viewer */}
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <ResumePDF resume={resume} />
      </PDFViewer>
    </div>
  )
}

export default Template1

