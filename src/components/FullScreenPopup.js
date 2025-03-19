import { useState } from "react";
import { ArrowLeft, Users, FileText, UserPlus, UserCheck } from "lucide-react";
import styles from "@/css/FullScreenPopup.module.css";
import SubscriptionPopup from "./SubscriptionPopup";
import UserGroups from "./UserGroups"; // Import the UserGroups component
import FilePopup from "./FilePopup";

export default function FullScreenPopup({ activeSection, onClose }) {
  const [section, setSection] = useState(activeSection);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <div>
              <button
                className={section === "subscription" ? styles.active : ""}
                onClick={() => setSection("subscription")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Subscription</span>
              </button>
              <button
                className={section === "files" ? styles.active : ""}
                onClick={() => setSection("files")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                </svg>
                <span>Files</span>
              </button>
              <button
                className={section === "usergroups" ? styles.active : ""}
                onClick={() => setSection("usergroups")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>User groups</span>
              </button>
              {/* <button
                className={section === "invite" ? styles.active : ""}
                onClick={() => setSection("invite")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Invite friends</span>
              </button> */}
            </div>
            <button className={styles.goBack} onClick={onClose}>
              <ArrowLeft size={20} /> <span>Go back</span>
            </button>
          </div>
          <div className={styles.content}>
            {section === "subscription" && (
              <SubscriptionPopup onClose={onClose} />
            )}
            {section === "files" && <FilePopup/>}
            {section === "usergroups" && <UserGroups />}
            {/* Render UserGroups component */}
            {section === "invite" && <div>Feature comming soon</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
