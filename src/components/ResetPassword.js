"use client";
import React, { useEffect, useState } from 'react'
import "@/css/signup.css"
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import logo from "@/assets/logo.png";
import Image from 'next/image';
import Error from './Error';

const ResetPassword = () => {

  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [message,setMessage]=useState(null);

  const { resetPassword, loadingForget, showPopup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(await resetPassword({ ...formData, token }));
  };

  useEffect(() => {
    setToken(searchParams.get('token'));
  }, [])


  return (
    <div className="flex-container">
      {message && <Error message={message}/>}
      <div className="signin-container">
        <div className="signin-logo-container">
          <Image src={logo} alt="TutorOcean Logo" className="logo" priority/>
          <h1 className="logo-text" style={{ marginLeft: -12 }}>Ivy AI Tutor</h1>
        </div>
        <h2 className="heading">New Password</h2>

        <form className="signin-form" onSubmit={handleSubmit}>


          <div className="input-group">
            <label className="labelstyle" htmlFor="email">Password</label>
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
            <label className="labelstyle" htmlFor="email">Confirm Password</label>
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


          <button type="submit" className="submit-button" disabled={loadingForget}>
            {loadingForget ? <div className="spinner"></div> : "Reset Password"}
          </button>
        </form>

        <p className="signup-texts">
          Remember Password? {" "}
          <a href="/signin" className="terms-link">Log in</a>
        </p>



      </div>
    </div>
  )
}

export default ResetPassword
