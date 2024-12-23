import React, { useState, useEffect } from "react";
import axios from "axios";
import nsaLogo from "../assets/nsaLogo.png";
import { useNavigate } from "react-router-dom";

const InitialFetch = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "Member",
    classification: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch users from the backend
  const fetchAPI = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get("https://nsa-events.onrender.com/userlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Access denied. Only the President can view this page.");
        navigate("/"); // Redirect to home or login page
      } else if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login"); // Redirect to login
      } else {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Error fetching data");
      }
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  // Handle delete user
  const handleDelete = async (userId) => {
    const confirmedUserDel = window.confirm(`Are you sure you want to delete the user"?`);
    if(confirmedUserDel){
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      await axios.delete(`https://nsa-events.onrender.com/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId)); // Remove from state
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || "Error deleting user");
    }
  }
  };

  // Start editing a user
  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      classification: user.classification || "",
      role: user.role || "Member",
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save update
  const handleSave = async (userId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      await axios.put(`https://nsa-events.onrender.com/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, ...formData } : user
        )
      );
      setEditingUser(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Error updating user");
    }
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        User List
      </h1>
      <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto">
        <div className="bg-maroon-700 p-4 rounded-t-lg flex justify-center">
          <img src={nsaLogo} alt="NSA Logo" className="h-10 rounded-full" />
        </div>

        <div className="p-4">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {users.length === 0 && (
            <p className="text-center text-gray-500">No users found.</p>
          )}

          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li
                key={user.id}
                className="py-4 flex justify-between items-center"
              >
                {editingUser === user.id ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                      placeholder="Last Name"
                    />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                      placeholder="Username"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                      placeholder="Email"
                    />

                    {/* Role dropdown */}
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                    >
                      <option value="Member">Member</option>
                      <option value="Board Member">Board Member</option>
                      <option value="President">President</option>
                      <option value="Vice President">Vice President</option>
                    </select>
                    <select
                      name="classification"
                      value={formData.classification}
                      onChange={handleChange}
                      className="w-full px-2 py-1 mb-2 border rounded"
                    >
                      <option value="" disabled>
                        Select Classification
                      </option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Other">Other</option>
                    </select>

                    <button
                      onClick={() => handleSave(user.id)}
                      className="bg-green-500 text-white py-1 px-3 mr-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-gray-500">Username: {user.username}</p>
                    <p className="text-gray-500">Email: {user.email}</p>
                    <p className="text-gray-500">Role: {user.role}</p>
                    <p className="text-gray-500">Classification: {user.classification}</p>
                  </div>
                )}
                <div>
                  {editingUser !== user.id && (
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 text-white py-1 px-3 mr-2 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                  )}
                  {user.role !== "President" && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InitialFetch;