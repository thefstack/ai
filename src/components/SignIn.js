"use client";
import React, { useEffect, useState } from "react";
import "@/css/signin.css";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";
import Image from 'next/image';
import { signIn as googleauth } from "next-auth/react";
import Error from './Error.js';
import googlei from '@/assets/googlei.png';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const googleFunc = () => {
    googleauth("google", { callbackUrl: "/dashboard/chat" });
  };

  const { signIn, loading, showPopup, error } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(formData);
  };


  return (
    <div>
      {/* Signin content */}
      <div className="flex-container">
        <div className="signin-container">
          <div className="signin-logo-container">
            <Image src={logo} alt="TutorOcean Logo" className="logo" priority />
            <h1 className="logo-text" style={{ marginLeft: -12 }}>Ivy AI Tutor</h1>
          </div>
          <h2 className="heading">Log in to your account</h2>

          {/* Social login buttons */}
          <div className="social-login-container">
            <button className="social-button google" onClick={() => googleFunc()}>
              <Image src={googlei} style={{ height: 20, width: 20 }} alt="google" />
              <span>Google</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30, width: '95%', marginLeft: 10 }}>
            <div style={{ width: '45%', height: 1, backgroundColor: '#7f7f7f' }}></div>
            <p style={{ margin: '0 10px', whiteSpace: 'nowrap' }} className="or-text">or continue with</p>
            <div style={{ width: '45%', height: 1, backgroundColor: '#7f7f7f' }}></div>
          </div>

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
                style={{ marginBottom: 20 }}
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <label className="labelstyle" htmlFor="password">Password</label>
                <a href="/forget-password" className="forgot-password-link">
                  Forgot password?
                </a>
              </div>

              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                style={{ marginTop: 1 }}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Log in"}
            </button>
          </form>
          <p className="signup-text">
            By proceeding, you are agreeing to our{" "}
            <a href="/termsconditions" className="terms-link">Terms of Service</a> and
            <a href="/privacypolicy" className="privacy-link"> Privacy Policy</a>.
          </p>
          <p className="signup-texts">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="terms-link">Sign up</a>
          </p>

          {/* Footer section */}

        </div>

        <footer className="footer">
            <p style={{marginTop:20,fontSize:13,color: '#555555'}}>Version 1.0</p>
          </footer>
      </div>

    </div>
  );
};

export default SignIn;
