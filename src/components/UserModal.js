import { useState } from 'react';
import "@/css/Usermodal.css";
import FullScreenPopup from './FullScreenPopup'; // Import the FullScreenPopup component

export default function UserModal({ onLogout, onClose }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('subscription');

    const openPopup = (section) => {
        setActiveSection(section);
        setIsPopupOpen(true);
        onClose();
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="userModalMenu">
            <div onClick={() => openPopup('subscription')} style={{ flexDirection: "row" }} className="userMenu-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Subscription</span>
            </div>

            <div onClick={() => openPopup('files')} style={{ flexDirection: "row" }} className="userMenu-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                </svg>
                <span>Files</span>
            </div>

            <div onClick={() => openPopup('usergroups')} style={{ flexDirection: "row" }} className="userMenu-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>User groups</span>
            </div>

            {/* <div onClick={() => openPopup('invite')} style={{ flexDirection: "row" }} className="userMenu-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Invite friends</span>
            </div> */}

            <div className="divider"></div>

            <div className="userMenu-item" onClick={onLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log out</span>
            </div>

            {isPopupOpen && <FullScreenPopup activeSection={activeSection} onClose={closePopup} />}
        </div>
    );
}

