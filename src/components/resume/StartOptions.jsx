import "@/css/resume/start-options.css";
import TemplateSelection from "./TemplateSelection";
import UploadedResume from "./UploadedResume";
import React, { useState } from "react";

export default function StartOptions({ onNext }) {
    const [nextStep, setNextStep] = useState(false);
    const [uploadStep, setUploadStep] = useState(false);

    const fromScratchHandler = () => {
        setNextStep(true);
    };

    const uploadResumeHandler = () => {
        setUploadStep(true);
    };

    if (nextStep) {
        return <TemplateSelection onNext={onNext} />;
    }

    if (uploadStep) {
        return <UploadedResume onNext={onNext} />;
    }

    return (
        <div className="new-resume-container">
            <div className="new-resume-content">
                <div className="info-text">
                    <h1>Do you have a resume?</h1>
                    <p className="">If you do not have a resume, you can start from scratch.</p>
                    <p className="">If you already have an existing resume, upload it.</p>
                </div>

                <div className="options-container">
                    <button className="option-card" onClick={fromScratchHandler}>
                        <div className="option-content">
                            <div className="icon-container">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <span className="option-text">Start From Scratch</span>
                            <div className="icon-container">
                                <svg
                                    className="arrow-icon"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    <button className="option-card" onClick={uploadResumeHandler}>
                        <div className="option-content">
                            <div className="icon-container">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                            </div>
                            <span className="option-text">Upload Resume</span>
                            <div className="icon-container">
                                <svg
                                    className="arrow-icon"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
