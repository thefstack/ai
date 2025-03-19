"use client";

import { Share, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ActionMenu({ isShare,isDelete, onShare= () => console.log("Share clicked"), onDelete= () => console.log("Delete clicked") }) {
  
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShare=()=>{
    onShare();
    setIsOpen(false);
  }

  const handleDelete=()=>{
    onDelete();
    setIsOpen(false);
  }

  return (
    <div className="dropdown-container" ref={menuRef}>
      <button onClick={toggleDropdown} className="dropdown-trigger" aria-label="Open menu">
        <svg
          width="15"
          height="3"
          viewBox="0 0 15 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="dots-icon"
        >
          <path
            d="M3.625 1.5C3.625 1.95833 3.49479 2.35417 3.23438 2.6875C2.97917 3.02083 2.65625 3.1875 2.26562 3.1875C1.87500 3.1875 1.54687 3.02083 1.28125 2.6875C1.02083 2.35417 0.890625 1.95833 0.890625 1.5C0.890625 1.04167 1.02083 0.645833 1.28125 0.3125C1.54687 -0.0208333 1.87500 -0.1875 2.26562 -0.1875C2.65625 -0.1875 2.97917 -0.0208333 3.23438 0.3125C3.49479 0.645833 3.625 1.04167 3.625 1.5ZM9.0625 1.5C9.0625 1.95833 8.93229 2.35417 8.67188 2.6875C8.41667 3.02083 8.09375 3.1875 7.70312 3.1875C7.31250 3.1875 6.98437 3.02083 6.71875 2.6875C6.45833 2.35417 6.32812 1.95833 6.32812 1.5C6.32812 1.04167 6.45833 0.645833 6.71875 0.3125C6.98437 -0.0208333 7.31250 -0.1875 7.70312 -0.1875C8.09375 -0.1875 8.41667 -0.0208333 8.67188 0.3125C8.93229 0.645833 9.0625 1.04167 9.0625 1.5ZM14.5 1.5C14.5 1.95833 14.3698 2.35417 14.1094 2.6875C13.8542 3.02083 13.5312 3.1875 13.1406 3.1875C12.7500 3.1875 12.4219 3.02083 12.1562 2.6875C11.8958 2.35417 11.7656 1.95833 11.7656 1.5C11.7656 1.04167 11.8958 0.645833 12.1562 0.3125C12.4219 -0.0208333 12.7500 -0.1875 13.1406 -0.1875C13.5312 -0.1875 13.8542 -0.0208333 14.1094 0.3125C14.3698 0.645833 14.5 1.04167 14.5 1.5Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {isShare=="1"  && <button onClick={handleShare} className="dropdown-item">
            <Share className="icon" />
            Share
          </button>}
          {isDelete=="1" && <button onClick={handleDelete} className="dropdown-item delete">
            <Trash2 className="icon" />
            Delete
          </button>}
        </div>
      )}
    </div>
  );
}

