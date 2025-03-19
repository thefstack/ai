"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Get token from dynamic route
import axios from "axios";
import Loading from "@/components/Loading";
import "@/css/GroupInvitation.css";
import { getAuthToken } from "@/utils/getAuthToken";

export default function GroupInvitation() {
  const { token } = useParams(); // Get token from URL path
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [alreadyInGroup, setAlreadyInGroup] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return; // Ensure token exists

    const acceptInvitation = async () => {
      try {
        const authToken = await getAuthToken();
        if (!authToken) throw new Error("No authentication found");

        const response = await axios.post(
          "/api/usergroup?action=acceptInvitation",
          { token },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 200) {
          setSuccess(response.data.success);
          setAlreadyInGroup(!response.data.success);
        } else {
          setError("Failed to accept the invitation.");
        }
      } catch (error) {
        setError("Failed to accept the invitation.");
      } finally {
        setLoading(false);
      }
    };

    acceptInvitation();
  }, []);

  return (
    <div className="invitation-container">
      {loading ? (
        <Loading text="Accepting Invitation" />
      ) : success ? (
        <div className="success-message">
          <h2>Invitation Accepted</h2>
          <p>You have successfully joined the group.</p>
        </div>
      ) : alreadyInGroup ? (
        <div className="success-message">
          <h2>Already in Group</h2>
          <p>You are already a member of this group.</p>
        </div>
      ) : (
        <div className="error-message">
          <h2>Invitation Failed</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
