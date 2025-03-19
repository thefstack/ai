"use client";
import style from "@/css/Dashboard.module.css";
import { Flag, AlertCircle } from "lucide-react";
import { useState } from "react";

const ChatPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(""); // State for form submission status
  const [fileError, setFileError] = useState(""); // State for file validation error

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          screenshot: reader.result, // Set the Base64 string
        }));
        setFileError(""); // Clear any previous error
      };
      reader.readAsDataURL(file); // Convert file to Base64
    } else {
      setFileError("Only image files are allowed.");
      setFormData((prevData) => ({
        ...prevData,
        screenshot: "", // Clear previous image data
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/reportIssue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // alert(result.message); // Show success message
        setSubmitStatus(result.message); // Show success message
        toggleDialog(); // Close the dialog
        setTimeout(() => {
          setSubmitStatus(""); // Clear the message after 3 seconds
        }, 3000);
        setFormData("")
      } else {
        alert(result.error); // Show error message
        setTimeout(() => {
          setSubmitStatus(""); // Clear the message after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setSubmitStatus(""); // Clear the message after 3 seconds
      }, 3000);
    }
  };
  const [formData, setFormData] = useState({
    issue: "",
    category: "bug",
    screenshot: "",
    name: "",
  });

  return (
    <div className={style.container}>
      <h1>Welcome to the Doubt Section!</h1>

      <h3>Here&apos;s how to get started:</h3>

      <div className={style.info}>
        <p>
          - If you have questions about Python, Java, Machine Learning, or any
          other topic, click <strong>&quot;New Chat&quot;</strong> to start.
        </p>
        <p>
          - Revisit recent chats to continue previous discussions and pick up
          where you left off.
        </p>
        <p>
          - Explore the <strong>Quiz</strong> and <strong>Lesson Plan</strong>{" "}
          sections for testing your knowledge and creating personalized study
          plans!
        </p>
        <p>
          <strong>
            - Don&apos;t hesitate to ask questions or request further
            assistance; we&apos;re here to help you succeed!
          </strong>
        </p>
      </div>

      <div className={style.floatingIcon} onClick={toggleDialog}>
        <Flag color="red" size={20} title="Need Help?" />
        <span className={style.reportText}>Report an issue</span>
      </div>

      {/* Animated Dialog */}
      {isDialogOpen && (
        <div className={style.dialogContainer}>
          <button className={style.closeButton} onClick={toggleDialog}>
            ✖
          </button>
          {/* <h3 className={style.reporttxt}>Report an Issue</h3> */}
          <label htmlFor="reportIssue">
            <AlertCircle size={16} color="#007bff" style={{ marginRight: '8px' }} />
            Report an issue
          </label>
          <form className={style.dialogForm} onSubmit={handleSubmit}>
            <label style={{ marginTop: 20 }} htmlFor="issue">Issue (Short Answer)*</label>
            <textarea
              id="issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              placeholder="Describe the issue or suggestion."
              required
            ></textarea>

            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="bug">Bug</option>
              <option value="improvement">Improvement</option>
              <option value="new-feature">New Feature</option>
            </select>


            <label htmlFor="screenshot">Upload a Screenshot (Optional)</label>
            <input
              type="file"
              id="screenshot"
              name="screenshot"
              accept="image/*"
              onChange={handleFileChange}
            />
            {fileError && <p className={style.errorMessage}>{fileError}</p>} {/* Display file error */}

            <label htmlFor="name">Name (Optional)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Let us know your name if you'd like us to follow up"
            />
            <button style={{ marginTop: 30 }} type="submit">Submit</button>
          </form>
        </div>
      )}
      {submitStatus && (
        <div className={style.submitStatusMessage}>
          <p className={style.gtext}>{submitStatus}</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
