import userIcon from "@/assets/user.png";
import {
  Users,
  FileText,
  RefreshCw,
  UserPlus,
  ArrowLeft,
  Trash2,
  Eye,
  FilePlus2,
} from "lucide-react";
import "@/css/Usergroups.css"; // Import the CSS file
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getAuthToken } from "@/utils/getAuthToken";
import { formattedDateWithYear } from "@/utils/FormatDate";
import { useAuth } from "@/context/AuthContext";
import Error from "@/components/Error";
import { formatFileSize } from "@/utils/formatFileSize";
import GroupFileShare from "./GroupFileShare";

export default function UserGroups() {
  const { userData, fetchUserData } = useUser(); // Access userRole from AuthContext
  const [activeTab, setActiveTab] = useState("groups"); // State to track the active tab
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [users, setUsers] = useState([]); // Store users
  const [groups, setGroups] = useState([]); // Store groups
  const [isLoading, setIsLoading] = useState(false); // Loading state for button
  const [isFetchingGroups, setIsFetchingGroups] = useState(true); // Loading state for fetching groups
  const [email, setEmail] = useState(""); // State for email input
  const [name, setName] = useState(""); // State for name input
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false); // State to manage group modal visibility
  const [groupName, setGroupName] = useState(""); // State for group name input
  const [groupDescription, setGroupDescription] = useState(""); // State for group description input
  const [selectedGroupId, setSelectedGroupId] = useState(null); // State for selected group ID
  const [error, setError] = useState(""); // State for error message
  const { handleSetError } = useAuth();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State to manage view modal visibility
  const [groupMembers, setGroupMembers] = useState([]); // State to store group members
  const [isFileShareModalOpen, setIsFileShareModalOpen] = useState(false);
const [filesList, setFilesList] = useState([]); // Store available files
const [selectedFileIds, setSelectedFileIds] = useState([]); // Store selected file IDs

const openModal = async (groupId) => {
  setSelectedGroupId(groupId);
  setIsModalOpen(true);

  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No authentication found");

    const response = await axios.get(
      `/api/usergroup?action=getGroupMembers&groupId=${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) throw new Error("Failed to fetch group members");

    setGroupMembers(response.data.members); // Store fetched members
  } catch (error) {
    console.error(error);
    setError(error.response?.data?.message || "Error fetching group members");
  }
};


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroupId(null);
  };

  const openGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  const openViewModal = async (groupId) => {
    setIsViewModalOpen(true);
    try {
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const response = await axios.get(
        `/api/usergroup?action=getGroupMembers&groupId=${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch group members");
      }
      // console.log(response.data);

      setGroupMembers(response.data.members);
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setGroupMembers([]);
  };

  const handleAddUser = async () => {
    setIsLoading(true); // Start loading

    const currentDateTime = new Date().toLocaleString(); // Get current date-time in format "2024-12-05 17:28 PM"

    try {
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const response = await axios.post(
        "/api/usergroup?action=inviteUser",
        {
          groupId: selectedGroupId,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        if (!response.data.success) {
          setError(response.data.message);
        }

        setUsers([...users, { email, name, invitedAt: currentDateTime }]);
        setEmail("");
        setName("");
        closeModal(); // Close the modal after adding the user
      }
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleCreateGroup = async () => {
    setIsLoading(true); // Start loading
    const currentDateTime = new Date().toLocaleString(); // Get current date-time in format "2024-12-05 17:28 PM"
    if (!groupName || !groupDescription) {
      setError("please add group name and description");
      setTimeout(() => setError(""), 5000); // Remove error after 5 seconds
      return;
    }
    const token = await getAuthToken(); // Retrieve the token using the utility function

    if (!token) {
      throw new Error("No authentication found");
    }

    try {
      const response = await axios.post(
        "/api/usergroup?action=createGroup",
        {
          name: groupName,
          description: groupDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        setError(response.data.message);
        setTimeout(() => setError(""), 5000); // Remove error after 5 seconds
        return;
      }

      setGroups([
        {
          name: groupName,
          description: groupDescription,
          createdAt: currentDateTime,
        },
        ...groups,
      ]);
      setGroupName("");
      setGroupDescription("");
      closeGroupModal(); // Close the modal after creating the group
    } catch (error) {
      console.error(error.response.data.message);
      setError(error.response.data.message);
      setTimeout(() => setError(""), 5000); // Remove error after 5 seconds
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  //file sharing
// Open File Share Modal
const openFileShareModal = async (groupId) => {
    setSelectedGroupId(groupId);
    setIsFileShareModalOpen(true);
};

  // end of file sharing

  const fetchGroups = async () => {
    try {
      const token = await getAuthToken(); // Retrieve the token using the utility function

      if (!token) {
        throw new Error("No authentication found");
      }

      const response = await axios.get("/api/usergroup?action=getGroup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch groups");
      }
      console.log(response);

      setGroups(response.data.group);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingGroups(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchGroups();
  }, []);

  return (
    <div className="usergroups-container">
      {error && <Error message={error} />}
      <main className="content">
        <p style={{ fontSize: 13, color: "gray", marginTop: -15 }}>
          Manage your user groups
        </p>
        <div
          style={{
            width: "100%",
            marginTop: 10,
            borderBottom: "0.5px solid #ddd",
          }}
        ></div>
        {/* Tabs */}
        <div className="tabs">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              className={`tab ${activeTab === "groups" ? "active" : ""}`}
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 10,
            }}
          >
            {(userData.role === "admin" || userData.role === "instructor") &&
              activeTab === "groups" && (
                <button
                  style={{ textAlign: "end" }}
                  className="add-user-btn"
                  onClick={openGroupModal}
                >
                  <UserPlus size={16} />
                  New Group
                </button>
              )}
          </div>
        </div>
        {isFetchingGroups ? (
          <div className="loader"></div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                {userData.role !== "student" && (
                  <>
                    <th>Created at</th>
                    <th>Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {groups.length === 0 ? (
                <tr>
                  <td
                    colSpan={userData.role === "student" ? 1 : 3}
                    className="empty-row"
                  >
                    There are no user groups yet.
                  </td>
                </tr>
              ) : (
                groups.map((group, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "normal" }}>{group.name}</td>
                    {userData.role !== "student" && (
                      <>
                        <td style={{ fontWeight: "normal" }}>
                          {formattedDateWithYear(group.createdAt)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="add-user-btn"
                              onClick={() => openModal(group._id)}
                            >
                              <UserPlus size={16} />
                            </button>
                            <button
                              className="add-user-btn"
                              onClick={() => openViewModal(group._id)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="add-user-btn"
                              onClick={() => openFileShareModal(group._id)}
                            >
                              <FilePlus2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {/* Add User Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h4>Add User to Group</h4>
                <button onClick={closeModal} className="close-modal">
                  &times;
                </button>
              </div>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", overflow:"hidden" }}>
                {/* Invite User Section (Fixed) */}
                <div style={{ marginBottom: "15px" }}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user email"
                  />
                  <button className="add-btn" onClick={handleAddUser} disabled={isLoading}>
                    {isLoading ? "Sending Invitation..." : "Invite"}
                  </button>
                </div>
                
                {/* Scrollable User List */}
                <div style={{ height:"100%", overflowY: "auto", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
                  <h5>Already Joined Users</h5>
                  {groupMembers.length === 0 ? (
                    <p>No members in this group.</p>
                  ) : (
                    <table className="user-table">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Joined At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupMembers.map((member, index) => (
                          <tr key={index}>
                            <td>{member.email}</td>
                            <td>{formattedDateWithYear(member.joinedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal */}
        {isGroupModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h4>Create new group</h4>
                <button onClick={closeGroupModal} className="close-modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <label>Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
                <label>Group Description</label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="add-btn"
                  onClick={handleCreateGroup}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Group"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* View Group Members Modal */}
        {isViewModalOpen && (
          <div className="view-modal-overlay">
            <div className="view-modal">
              <div className="modal-header">
                <h4>Group Members</h4>
                <button onClick={closeViewModal} className="close-modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {groupMembers.length === 0 ? (
                  <p>No members in this group.</p>
                ) : (
                  <table className="user-table">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Joined At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupMembers.map((member, index) => (
                          <tr key={index}>
                            <td>{member.email}</td>
                            <td>{formattedDateWithYear(member.joinedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Add File Share Modal */}
        {isFileShareModalOpen && <GroupFileShare onClose={()=>setIsFileShareModalOpen(false)} groupId={selectedGroupId} groupData={groups}/>}
      </main>
    </div>
  );
}
