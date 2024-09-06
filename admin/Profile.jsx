import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuthStore } from "../src/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Header from "../Frontend/Header/Header";
import Footer from "../Frontend/Footer/Footer";
import "./Profile.scss";

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

  useEffect(() => {
    if (!UserId) {
      console.error("UserId is undefined");
      setError("UserId is not available");
      return;
    }
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
    backgroundColor = "#07223D",
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
    context.font = `${size * 0.4}px poppins`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(initials, size / 2, size / 2);

    return canvas.toDataURL();
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
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3001/api/deletecustomer/${UserId}`);
      setIsLoading(false);
      alert("User deleted successfully");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
      setIsLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="userpropath">Admin - Profile</div>

      <div className="usermains" style={{ padding: "50px", marginTop: "40px" }}>
        <div className="upfirstt">
          <div className="uplblsecc">
            <label className="uplbls">First Name:</label>
            <label className="uplbls">Last Name:</label>
            <label className="uplbls">Contact No:</label>
            <label className="uplbls">Email:</label>
            <label className="uplbls">Role:</label>
            {/* <label className="uplbls">Profile Image:</label> */}
            <label className="uplbls">Old Password:</label>
            <label className="uplbls">New Password:</label>
          </div>
          <div className="upintextsecc">
            <input
              type="text"
              name="firstName"
              value={user.firstName || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="lastName"
              value={user.lastName || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="contact"
              value={user.contact || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="email"
              value={user.email || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="text"
              name="role"
              value={user.role || ""}
              readOnly={!isEditing}
              className="upfinp"
            />

            <input
              type="password"
              name="oldPassword"
              value={user.oldPassword || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
            <input
              type="password"
              name="newPassword"
              value={user.newPassword || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="upfinp"
            />
          </div>
          <div className="imgnbtnseccup">
            <div className="upimgsecc">
              {user.profileUrl ? (
                <img
                  src={adminImageURL}
                  alt={`${user.firstName}'s profile`}
                  className="uuprofile-image"
                />
              ) : (
                <div>No profile image available</div>
              )}
            </div>
            {isEditing ? (
              <button className="editupbtn" onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button onClick={handleEdit} className="editupbtn">
                Change
              </button>
            )}
          </div>
        </div>
        <div className="upseccond" style={{ marginTop: "20px" }}>
          <button className="logoutbtnup" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
        <div className="logout">
          <button className="logoutbtnup" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {user.email === "wwadmin@gmail.com" && (
          <div className="upseccond" style={{ marginTop: "20px" }}>
            <Link to="/admin/addadmin" className="hhui2">
              <button className="logoutbtnup">Add Admins</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
