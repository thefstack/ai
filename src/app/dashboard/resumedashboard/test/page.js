"use client"
import styles from "@/css/resume/templates/Template1.module.css"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

// Define styles for PDF
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Times-Roman",
  },
  header: {
    textAlign: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#2c5283",
    borderBottom: "1 solid black",
    paddingBottom: 4,
    marginBottom: 8,
    marginTop: 12,
  },
  job: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  company: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#535151",
  },
  date: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#666",
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  skills: {
    fontSize: 10,
    marginBottom: 3,
  },
  downloadButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#2c5283",
    color: "white",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
})

// PDF Document Component
const ResumePDF = () => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header Section */}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.name}>Debraj Chakraborty</Text>
        <Text style={pdfStyles.title}>Full Stack Developer</Text>
        <Text style={pdfStyles.contactInfo}>
          7699404172 ◇ tech1@ivyproschool.com ◇ 41B Camac Street, Exide, Kolkata, WB, India ◇ Open to On-Site ◇ LinkedIn
        </Text>
      </View>

      {/* Experience Section */}
      <View>
        <Text style={pdfStyles.sectionTitle}>EXPERIENCE</Text>
        <View style={pdfStyles.job}>
          <Text style={pdfStyles.jobTitle}>Full Stack Developer</Text>
          <Text style={pdfStyles.company}>Ivy Knowledge Services Pvt Ltd - KOLKATA</Text>
          <Text style={pdfStyles.date}>Jun '24</Text>
          <Text style={pdfStyles.text}>
            Responsible for designing, developing, and maintaining scalable web applications. Work on both front-end and
            back-end development, build RESTful APIs, and manage databases. Ensure performance, security, and seamless
            user experience across applications.
          </Text>
        </View>
        <View style={pdfStyles.job}>
          <Text style={pdfStyles.jobTitle}>Application Developer</Text>
          <Text style={pdfStyles.company}>Spectra Consultancy Pvt Ltd - KOLKATA</Text>
          <Text style={pdfStyles.date}>Dec '23 — Jun '24</Text>
          <Text style={pdfStyles.text}>
            Responsible for designing, developing, and maintaining mobile applications for iOS and Android. Work with
            frameworks like React Native, Flutter, or native languages (Swift/Kotlin). Ensure app performance, security,
            and seamless user experience.
          </Text>
        </View>
        <View style={pdfStyles.job}>
          <Text style={pdfStyles.jobTitle}>Software Developer</Text>
          <Text style={pdfStyles.company}>Connected Bytes - KOLKATA</Text>
          <Text style={pdfStyles.date}>Dec '20 — Dec '23</Text>
          <Text style={pdfStyles.text}>
            Responsible for designing, developing, and maintaining software applications. Work with programming
            languages like JavaScript, Node.js, or Java to build efficient and scalable solutions. Ensure software
            performance, security, and seamless user experience.
          </Text>
        </View>
      </View>

      {/* Education Section */}
      <View>
        <Text style={pdfStyles.sectionTitle}>EDUCATION</Text>
        <Text style={pdfStyles.text}>B.Tech in Computer Science & Engineering</Text>
        <Text style={pdfStyles.text}>Maulana Abul Kalam Azad University of Technology (MAKAUT)</Text>
        <Text style={pdfStyles.text}>GPA: 8.20 | Jun '16 — Jul '20 | Berhampore</Text>
      </View>

      {/* Certifications Section */}
      <View>
        <Text style={pdfStyles.sectionTitle}>CERTIFICATIONS</Text>
        <Text style={pdfStyles.text}>Full Stack Web Development Certification - Feb '23</Text>
        <Text style={pdfStyles.text}>AWS Certified Developer - Jul '22</Text>
        <Text style={pdfStyles.text}>Google Cloud Associate - Dec '21</Text>
      </View>

      {/* Skills Section */}
      <View>
        <Text style={pdfStyles.sectionTitle}>SKILLS</Text>
        <Text style={pdfStyles.skills}>Frontend: ReactJS, JavaScript, HTML5, CSS, Tailwind CSS, Next.js</Text>
        <Text style={pdfStyles.skills}>Backend: Node.js, PHP, CodeIgniter, Express.js</Text>
        <Text style={pdfStyles.skills}>Database: MySQL, MongoDB, Firebase</Text>
        <Text style={pdfStyles.skills}>API & Integration: REST API, OpenAI API, Payment Gateway Integration</Text>
        <Text style={pdfStyles.skills}>Apps Development: React Native</Text>
        <Text style={pdfStyles.skills}>Cloud & DevOps: AWS, Azure, GitHub, Bitbucket</Text>
      </View>

      {/* Projects Section */}
      <View>
        <Text style={pdfStyles.sectionTitle}>PROJECTS</Text>
        <Text style={pdfStyles.text}>
          AI Chatbot for Learning - Developed an AI-powered tutor bot using Next.js and OpenAI API.
        </Text>
        <Text style={pdfStyles.text}>
          E-commerce Web App - Built a full-stack e-commerce platform using MERN stack.
        </Text>
      </View>

      {/* Interests Section */}
      <View>
        <Text style={pdfStyles.sectionTitle}>INTERESTS</Text>
        <Text style={pdfStyles.text}>
          AI & Machine Learning, Cloud Computing, Open Source Contributions, Tech Blogging.
        </Text>
      </View>

      {/* Conclusion Section */}
      <View>
        <Text style={pdfStyles.sectionTitle}>CONCLUSION</Text>
        <Text style={pdfStyles.text}>
          Passionate about solving real-world problems through technology. Always eager to learn, collaborate, and
          contribute to impactful projects.
        </Text>
      </View>
    </Page>
  </Document>
)

const Template1 = () => {
  return (
    <div className={styles.resumeContainer}>
      {/* Download Button */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
        }}
      >
        <PDFDownloadLink document={<ResumePDF />} fileName="debraj_chakraborty_resume.pdf">
          {({ loading }) => (
            <button
              style={{
                backgroundColor: "#2c5283",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                }}
              >
                ↓
              </span>
              {loading ? "Loading document..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Header Section */}
      <header className={styles.resumeHeader}>
        <h1 className={styles.resumeName}>Debraj Chakraborty</h1>
        <h2 className={styles.resumeTitle}>Full Stack Developer</h2>
        <div className={styles.contactInfo}>
          <a href="tel:7699404172" className={styles.contactLink}>
            7699404172
          </a>{" "}
          ◇
          <a href="mailto:tech1@ivyproschool.com" className={styles.contactLink}>
            tech1@ivyproschool.com
          </a>{" "}
          ◇<span>41B Camac Street, Exide, Kolkata, WB, India</span> ◇<span>Open to On-Site</span> ◇
          <a href="#" className={styles.contactLink}>
            LinkedIn
          </a>
        </div>
      </header>

      {/* Experience Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>EXPERIENCE</h3>
        <div className={styles.job}>
          <h4 className={styles.jobTitle}>Full Stack Developer</h4>
          <p className={styles.company}>Ivy Knowledge Services Pvt Ltd - KOLKATA</p>
          <p className={styles.date}>Jun '24</p>
          <p className={styles.text}>
            Responsible for designing, developing, and maintaining scalable web applications. Work on both front-end and
            back-end development, build RESTful APIs, and manage databases. Ensure performance, security, and seamless
            user experience across applications.
          </p>
        </div>
        <div className={styles.job}>
          <h4 className={styles.jobTitle}>Application Developer</h4>
          <p className={styles.company}>Spectra Consultancy Pvt Ltd - KOLKATA</p>
          <p className={styles.date}>Dec '23 — Jun '24</p>
          <p className={styles.text}>
            Responsible for designing, developing, and maintaining mobile applications for iOS and Android. Work with
            frameworks like React Native, Flutter, or native languages (Swift/Kotlin). Ensure app performance, security,
            and seamless user experience.
          </p>
        </div>

        <div className={styles.job}>
          <h4 className={styles.jobTitle}>Software Developer</h4>
          <p className={styles.company}>Connected Bytes - KOLKATA</p>
          <p className={styles.date}>Dec '20 — Dec '23</p>
          <p className={styles.text}>
            Responsible for designing, developing, and maintaining software applications. Work with programming
            languages like JavaScript, Node.js, or Java to build efficient and scalable solutions. Ensure software
            performance, security, and seamless user experience.
          </p>
        </div>
      </section>

      {/* Education Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>EDUCATION</h3>
        <p className={styles.educationTitle}>
          <strong>B.Tech in Computer Science & Engineering</strong>
        </p>
        <p className={styles.text}>Maulana Abul Kalam Azad University of Technology (MAKAUT)</p>
        <p className={styles.text}>GPA: 8.20 | Jun '16 — Jul '20 | Berhampore</p>
      </section>

      {/* Certifications Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>CERTIFICATIONS</h3>
        <p className={styles.text}>
          <a href="#" className={styles.certificationLink}>
            Full Stack Web Development Certification
          </a>{" "}
          - Feb '23
        </p>
        <p className={styles.text}>
          <a href="#" className={styles.certificationLink}>
            AWS Certified Developer
          </a>{" "}
          - Jul '22
        </p>
        <p className={styles.text}>
          <a href="#" className={styles.certificationLink}>
            Google Cloud Associate
          </a>{" "}
          - Dec '21
        </p>
      </section>

      {/* Skills Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>SKILLS</h3>
        <p className={styles.skills}>
          <strong>Frontend:</strong> ReactJS, JavaScript, HTML5, CSS, Tailwind CSS, Next.js
        </p>
        <p className={styles.skills}>
          <strong>Backend:</strong> Node.js, PHP, CodeIgniter, Express.js
        </p>
        <p className={styles.skills}>
          <strong>Database:</strong> MySQL, MongoDB, Firebase
        </p>
        <p className={styles.skills}>
          <strong>API & Integration:</strong> REST API, OpenAI API, Payment Gateway Integration
        </p>
        <p className={styles.skills}>
          <strong>Apps Development:</strong> React Native
        </p>
        <p className={styles.skills}>
          <strong>Cloud & DevOps:</strong> AWS, Azure, GitHub, Bitbucket
        </p>
      </section>

      {/* Projects Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>PROJECTS</h3>
        <p className={styles.text}>
          <strong>AI Chatbot for Learning</strong> - Developed an AI-powered tutor bot using Next.js and OpenAI API.
        </p>
        <p className={styles.text}>
          <strong>E-commerce Web App</strong> - Built a full-stack e-commerce platform using MERN stack.
        </p>
      </section>

      {/* Interests Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>INTERESTS</h3>
        <p className={styles.text}>AI & Machine Learning, Cloud Computing, Open Source Contributions, Tech Blogging.</p>
      </section>

      {/* Conclusion Section */}
      <section className={styles.resumeSection}>
        <h3 className={styles.sectionTitle}>CONCLUSION</h3>
        <p className={styles.text}>
          Passionate about solving real-world problems through technology. Always eager to learn, collaborate, and
          contribute to impactful projects.
        </p>
      </section>
    </div>
  )
}

export default Template1

