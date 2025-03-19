"use client";
import { useState, memo, useCallback } from "react";
import { usePersonalInfo } from "@/context/resume/personal-info-context";
import GuidanceModal from "./modals/GuidanceModal";
import { guidanceData } from "@/utils/guidance-data";
import apiClient from "@/lib/apiClient";
import { useParams } from "next/navigation";
import { useAnalysis } from "@/context/resume/analysis-context";
import Error from "../Error";
import "@/css/resume/shared-form.css";

const FormInput = memo(
  ({
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    error,
  }) => {
    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={error ? "input-error" : ""}
        />
        {error && <div className="field-error-message">{error}</div>}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

const SocialInput = memo(
  ({ label, id, name, value, onChange, onBlur, placeholder, error }) => {
    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <div className="input-with-icon">
          <input
            type="url"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={error ? "input-error" : ""}
          />
        </div>
        {error && <div className="field-error-message">{error}</div>}
      </div>
    );
  }
);
SocialInput.displayName = "SocialInput";

function PersonalInfo() {
  const { personalInfo, updatePersonalInfo } = usePersonalInfo();
  const [showGuidance, setShowGuidance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { id: resumeId } = useParams();
  const { saveAnalysis } = useAnalysis();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [globalError, setGlobalError] = useState("");

  // Validate form fields
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return value.trim() === ""
          ? "This field is required"
          : /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)
          ? "Should not contain numbers or special characters"
          : "";
      case "lastName":
        return /[0-9!@#$%^&*(),.?":{}|<>]/.test(value)
          ? "Should not contain numbers or special characters"
          : "";
      case "email":
        return value.trim() === ""
          ? "Email is required"
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email format"
          : "";
      case "phone":
        return value.trim() !== "" &&
          !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)
          ? "Invalid phone number format"
          : "";
      case "linkedin":
      case "github":
        return value.trim() !== "" &&
          !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?$/.test(
            value
          )
          ? "Invalid URL format"
          : "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    console.log(personalInfo);

    // Required fields
    if (!personalInfo.firstName?.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(personalInfo.firstName)) {
      newErrors.firstName = "Should not contain numbers or special characters";
      isValid = false;
    }

    if (!personalInfo.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(personalInfo.lastName)) {
      newErrors.lastName = "Should not contain numbers or special characters";
      isValid = false;
    }

    if (!personalInfo.email?.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Optional fields with format validation
    if (
      personalInfo.phone &&
      !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
        personalInfo.phone
      )
    ) {
      newErrors.phone = "Invalid phone number format";
      isValid = false;
    }

    if (
      personalInfo.linkedin &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?$/.test(
        personalInfo.linkedin
      )
    ) {
      newErrors.linkedin = "Invalid URL format";
      isValid = false;
    }

    if (
      personalInfo.github &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?$/.test(
        personalInfo.github
      )
    ) {
      newErrors.github = "Invalid URL format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      updatePersonalInfo(name, value);

      // Mark field as touched
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate field on change
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [updatePersonalInfo]
  );

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const handleSave = async () => {
    // Validate all fields before saving
    if (!validateForm()) {
      // Mark all fields as touched to show all errors
      const allTouched = Object.keys(personalInfo).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Show global error message
      setGlobalError("Please fix the errors before saving");
      return;
    }

    try {
      setIsSaving(true);

      if (!resumeId) {
        setGlobalError("Resume ID not found in URL");
        throw new Error("Resume ID not found in URL");
      }

      const formattedPersonalInfo = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        headline: personalInfo.headline,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: {
          address: personalInfo.address,
          city: personalInfo.city,
          state: personalInfo.state,
          country: personalInfo.country,
          pin: personalInfo.pin,
        },
        socialLinks: {
          linkedin: personalInfo.linkedin,
          github: personalInfo.github,
        },
      };

      const response = await apiClient.patch(`/api/resume/personal-info`, {
        personalInfo: formattedPersonalInfo,
        resumeId,
      });

      if (!response.data.success) {
        const errorMessage =
          response.data.message || "Failed to save personal information";
        setGlobalError(errorMessage);
        throw new Error(errorMessage);
      }
      saveAnalysis(resumeId);
    } catch (error) {
      console.error("❌ Save error:", error);
      if (!globalError) {
        setGlobalError(
          "Failed to save personal information. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="resume-form">
      <Error message={globalError} />

      <div className="main-header">
        <div className="header-content">
          <h1>Personal Details</h1>
          {/* <p className="header-description">
            Fill in your personal information to get started
          </p> */}
        </div>
        <button
          className="view-guidance-button-personal"
          onClick={() => setShowGuidance(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View Guidance
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          <FormInput
            label="First Name *"
            id="firstName"
            name="firstName"
            value={personalInfo.firstName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your first name"
            error={touched.firstName ? errors.firstName : ""}
          />
          <FormInput
            label="Last Name *"
            id="lastName"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your last name"
            error={touched.lastName ? errors.lastName : ""}
          />
        </div>

        <FormInput
          label="Professional Headline"
          id="headline"
          name="headline"
          value={personalInfo.headline}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="e.g., Senior Software Engineer"
          error={touched.headline ? errors.headline : ""}
        />

        <div className="form-grid">
          <FormInput
            label="Email *"
            id="email"
            name="email"
            type="email"
            value={personalInfo.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            error={touched.email ? errors.email : ""}
          />
          <FormInput
            label="Phone"
            id="phone"
            name="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your phone number"
            error={touched.phone ? errors.phone : ""}
          />
        </div>

        <FormInput
          label="Address"
          id="address"
          name="address"
          value={personalInfo.address}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Enter your street address"
          error={touched.address ? errors.address : ""}
        />

        <div className="form-grid">
          <FormInput
            label="City"
            id="city"
            name="city"
            value={personalInfo.city}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your city"
            error={touched.city ? errors.city : ""}
          />
          <FormInput
            label="State"
            id="state"
            name="state"
            value={personalInfo.state}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your state"
            error={touched.state ? errors.state : ""}
          />
        </div>

        <div className="form-grid">
          <FormInput
            label="Country"
            id="country"
            name="country"
            value={personalInfo.country}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your country"
            error={touched.country ? errors.country : ""}
          />
          <FormInput
            label="PIN/ZIP Code"
            id="pin"
            name="pin"
            value={personalInfo.pin}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your PIN/ZIP code"
            error={touched.pin ? errors.pin : ""}
          />
        </div>

        <div className="form-grid">
          <SocialInput
            label="LinkedIn Profile"
            id="linkedin"
            name="linkedin"
            value={personalInfo.linkedin}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="LinkedIn profile URL"
            error={touched.linkedin ? errors.linkedin : ""}
          />
          <SocialInput
            label="GitHub Profile"
            id="github"
            name="github"
            value={personalInfo.github}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="GitHub profile URL"
            error={touched.github ? errors.github : ""}
          />
        </div>
      </form>

      <button
        className="section-save-button"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Personal Info"}
      </button>

      {showGuidance && (
        <GuidanceModal
          title="Personal Details"
          onClose={() => setShowGuidance(false)}
          guidanceData={guidanceData.personalInfo}
        />
      )}
    </div>
  );
}

export default memo(PersonalInfo);
