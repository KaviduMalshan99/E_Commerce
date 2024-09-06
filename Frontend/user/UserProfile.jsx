import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.scss";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_API;

function UserProfile() {
  const navigate = useNavigate();
  const { logout, user: sessionUser } = useAuthStore((state) => ({
    logout: state.logout,
    user: state.user,
  }));

  const UserId = sessionUser?.UserId;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminImageURL, setAdminImageURL] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!UserId) {
      console.error("UserId is undefined");
      setError("UserId is not available");
      return;
    }
    console.log("Fetching user with ID:", UserId);
    fetchUser(UserId);
  }, [UserId]);

  useEffect(() => {
    if (user) {
      const name = `${user.firstName} ${user.lastName}`;
      setAdminImageURL(generateInitialsImage(name));
    }
  }, [user]);

  const generateInitialsImage = (
    name,
    backgroundColor = "#00000",
    textColor = "#fb5909",
    size = 500
  ) => {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, size, size);

    context.fillStyle = textColor;
    context.font = `${size * 0.4}px Poppins`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(initials, size / 2, size / 2);

    const dataURL = canvas.toDataURL();

    return dataURL;
  };

  const fetchUser = async (UserId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/customer/${UserId}`
      );
      setUser(response.data.customer);
      setError(null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    const userToUpdate = {
      firstName: user.firstName,
      lastName: user.lastName,
      contact: user.contact,
      email: user.email,
      profileUrl: user.profileUrl,
      oldPassword: user.oldPassword,
      newPassword: user.newPassword,
    };
    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3001/api/updatecustomer/${UserId}`,
        userToUpdate
      );
      setIsEditing(false);
      setError(null);
      alert(res.data.message);
      setUser((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = async () => {
    if (isDeleting) {
      setIsLoading(true);
      try {
        await axios.delete(
          `http://localhost:3001/api/deletecustomer/${UserId}`
        );
        setIsLoading(false);
        alert("User deleted successfully");
        logout();
        navigate("/login");
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
        setIsLoading(false);
      }
    } else {
      setIsDeleting(true);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || isLoading) {
    return (
      <div className="loading-message">
        <p>Loading your profile, please wait...</p>
        {!UserId && (
          <p>
            Please <Link to="/login">Log in</Link> or{" "}
            <Link to="/register">Register</Link> to manage your profile.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="userpropaths">PROFILE PAGE</div>

      <div className="usermains" style={{ background: "#000" }}>
        <div className="imgnbtnsecup">
          <div className="upimgsec">
            {user.profileUrl ? (
              <img
                src={adminImageURL}
                alt="Admin"
                className="uuprofile-images"
              />
            ) : (
              <div>No profile image available</div>
            )}
          </div>
          {isEditing ? (
            <button className="editupbtns" onClick={handleUpdate}>
              Update
            </button>
          ) : (
            <button onClick={handleEdit} className="editupbtns">
              Change
            </button>
          )}
        </div>
        <div className="upfirst">
          <div className="uprow">
            <div className="uplblsec">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="uplblsec">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="uprow">
            <div className="uplblsec">
              <label>Contact No:</label>
              <input
                type="text"
                name="contact"
                value={user.contact || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="uplblsec">
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={user.email || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div className="uprow">
            <div className="uplblsec">
              <label>Old Password:</label>
              <input
                type="password"
                name="oldPassword"
                value={user.oldPassword || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="uplblsec">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={user.newPassword || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
        <div className="upsecond">
          {isDeleting ? (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete your account?</p>
              <button className="confirm-delete" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-delete" onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="logouttbtnup" onClick={handleDelete}>
              Delete Account
            </button>
          )}
          <button className="logoutbtnup" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
