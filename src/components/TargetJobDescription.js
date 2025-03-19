import React, { useState } from "react";
import styles from "@/css/TargetJobDescription.module.css";
import { ArrowLeft } from "lucide-react"; // Importing Lucide React Icon
import Resume from "@/components/ResumeSection.js" // Importing Resume Component";
import ResumeSelection from "@/components/ResumeSection.js";

const TargetJobDescriptions = () => {
    const [previouStep, setPreviouspreviouStep] = useState(false);
    const [conntinueStep, setContinueStep] = useState(false);
    const previousBtnHandler = () => {
        console.log("Previous button clicked");
        setPreviouspreviouStep(true);
    };
    const nextBtnHandler = () => {
        console.log("Next button clicked");
        setContinueStep(true);
    }

    return (
        previouStep ? <Resume /> :
            <>
                {conntinueStep == false ?
                    <div className={styles.container}>

                        <h2 className={styles.heading}>Target Job Description</h2>
                        <p className={styles.description}>
                            Enter the job description you're aiming for or targeting in your job
                            search. This helps tailor your job search and alerts to match your
                            career goals.
                        </p>

                        <label className={styles.inputLabel}>Target Job Description</label>
                        <input
                            type="text"
                            placeholder="Enter your target job description"
                            className={styles.inputField}
                        />

                        <div className={styles.buttonContainer}>
                            <button className={styles.previousBtn} onClick={previousBtnHandler} >
                                <ArrowLeft size={18} className={styles.icon} /> Previous
                            </button>
                            <button className={styles.continueBtn} onClick={nextBtnHandler}>Continue</button>
                        </div>
                    </div> : null

                }



                {conntinueStep ?
                    <ResumeSelection /> : null}

            </>


    );
};

export default TargetJobDescriptions;
