"use client";
import React, { useState } from 'react'
import "@/css/signup.css"
import { useAuth } from '@/context/AuthContext';
import logo from "@/assets/logo.png";
import Image from 'next/image';
import Error from "./Error"

const ForgetPassword = () => {

  const [formData, setFormData] = useState({
    email: '',
  });

  const { forgetPassword,  loadingForget, showPopup } = useAuth();
  const [message,setMessage]=useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(await forgetPassword(formData));
  };



  return (
      <div className="flex-container">
      {message && <Error message={message}/>}
      <div className="signin-container">
        <div className="signin-logo-container">
          <Image src={logo} alt="TutorOcean Logo" className="logo"  priority/>
          <h1 className="logo-text" style={{ marginLeft: -12 }}>Ivy AI Tutor</h1>
        </div>
        <h2 className="heading">Forget Password</h2>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="labelstyle" htmlFor="email">Email address</label>
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



          <button type="submit" className="submit-button" disabled={loadingForget}>
            {loadingForget ? <div className="spinner"></div> : "Send Reset Link"}
          </button>
        </form>

        <p className="signup-texts">
          Remember Password ?{" "}
          <a href="/signin" className="terms-link">Log in</a>
        </p>



      </div>
    </div>
  )
}

export default ForgetPassword
