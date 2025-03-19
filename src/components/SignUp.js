"use client"
import { useState, useEffect } from "react"
import "@/css/signup.css"
import { useAuth } from "@/context/AuthContext"
import logo from "@/assets/logo.png"
import Image from "next/image"
import { signIn as googleauth } from "next-auth/react"
import Error from "./Error.js"
import axios from "axios"

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [countdown, setCountdown] = useState(180) // 3 minutes countdown
  const [canResend, setCanResend] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signUp, error, loading, handleSetError } = useAuth()

  useEffect(() => {
    let timer
    if (currentStep === 1 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [currentStep, countdown])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.post("/api/auth/verify-email", { email: formData.email })
      setCurrentStep(1)
      setCountdown(180)
      setCanResend(false)
    } catch (error) {
      handleSetError(error.response.data.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await axios.post("/api/auth/verify-otp", { email: formData.email, otp: formData.otp })
      if (res.data.success) {
        setCurrentStep(2)
      } else {
        handleSetError(res.data.message)
      }
    } catch (error) {
      handleSetError(error.response.data.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await signUp(formData)
    setIsSubmitting(false)
  }

  const handleResendOtp = async () => {
    setIsSubmitting(true)
    try {
      await axios.post("/api/auth/verify-email", { email: formData.email })
      setCountdown(180)
      setCanResend(false)
    } catch (error) {
      handleSetError(error.response.data.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeEmail = () => {
    setCurrentStep(0)
    setFormData({ ...formData, otp: "" })
  }

  const googleFunc = () => {
    googleauth("google", { callbackUrl: "/dashboard/chat" })
  }

  return (
    <div className="flex-container">
      {error ? <Error message={error} /> : null}
      <div className="signin-container">
        <div className="signin-logo-container">
          <Image src={logo || "/placeholder.svg"} alt="TutorOcean Logo" className="logo" priority />
          <h1 className="logo-text" style={{ marginLeft: -12 }}>
            Ivy AI Tutor
          </h1>
        </div>
        <h2 className="heading">Sign up as a student</h2>

        <div className="form-container" data-step={currentStep}>
          <div
            className={`form-group ${currentStep === 1 ? "slide-left" : ""} ${currentStep === 2 ? "slide-left-twice" : ""}`}
          >
            <form className="form-section" onSubmit={handleEmailSubmit}>
              <div className="input-group">
                <label className="labelstyle" htmlFor="email">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
              </div>
              <button type="submit" className="verify-button" disabled={loading || isSubmitting}>
                {loading || isSubmitting ? <div className="spinner"></div> : "Verify Email"}
              </button>
            </form>

            <form className="form-section" onSubmit={handleOtpSubmit}>
              <div className="input-group">
                <label className="labelstyle" htmlFor="otp">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="input-field"
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
              </div>
              <button type="submit" className="verify-button" disabled={loading || isSubmitting}>
                {loading || isSubmitting ? <div className="spinner"></div> : "Verify OTP"}
              </button>
              <div className="resend-container">
                {canResend ? (
                  <button type="button" className="resend-button" onClick={handleResendOtp} disabled={isSubmitting}>
                    Resend OTP
                  </button>
                ) : (
                  <p className="countdown-text">
                    Resend OTP in {Math.floor(countdown / 60)}:
                    {countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}
                  </p>
                )}
                <button type="button" className="change-email-button" onClick={handleChangeEmail} disabled={isSubmitting}>
                  Change Email
                </button>
              </div>
            </form>

            <form className="form-section" onSubmit={handleSubmit}>
              <div className="input-group">
                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                  <label className="labelstyle" htmlFor="firstName">
                    First Name
                  </label>
                  <label style={{ marginLeft: 150 }} className="labelstyle" htmlFor="lastName">
                    Last name
                  </label>
                </div>
                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="input-field"
                    style={{ marginTop: 10, width: "50%", marginLeft: 10 }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="input-field"
                    style={{ marginTop: 10, width: "50%", marginRight: 10, marginLeft: 10 }}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="labelstyle" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
              </div>
              <div className="input-group">
                <label className="labelstyle" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
              </div>
              <div className="input-group">
                <div style={{ width: "100%" }}>
                  <label style={{ marginTop: 20 }} className="labelstyle" htmlFor="phoneNumber">
                    Phone number (optional)
                  </label>
                </div>
                <div style={{ textAlign: "left", width: "100%", marginLeft: 8, marginTop: 8 }}>
                  <label className="textstyle">We may use your phone number to provide important notifications.</label>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    type="number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field"
                    style={{ marginTop: 10 }}
                  />
                </div>
              </div>
              <button type="submit" className="submit-button" disabled={loading || isSubmitting}>
                {loading || isSubmitting ? <div className="spinner"></div> : "Sign Up"}
              </button>
            </form>
          </div>
        </div>

        <p className="signup-text">
          By proceeding, you are agreeing to our{" "}
          <a href="/termsconditions" className="terms-link">
            Terms of Service
          </a>{" "}
          and
          <a href="/privacypolicy" className="privacy-link">
            {" "}
            Privacy Policy
          </a>
          .
        </p>
        <p className="signup-texts">
          Already have an account?{" "}
          <a href="/signin" className="terms-link">
            Log in
          </a>
        </p>
      </div>
      <footer className="footer">
        <p style={{ marginTop: 20, fontSize: 13, color: "#555555" }}>Version 1.0</p>
      </footer>
    </div>
  )
}

export default SignUp

