import React, { useState, useEffect } from "react";
import Navbar from "./Navbar"; // Assuming Navbar is in the same folder
import { NavLink, useNavigate } from "react-router-dom";
import backgroundImage from "../images/bghome1.jpg";

const Home = () => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser)); // Parse and set the user data
      }
    } catch (error) {
      console.error("Error retrieving user data from localStorage:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 bg-cover bg-center bg-fixed" 
        style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
    >
     {/* Pass onLogout to Navbar */}
      <div className="container mx-auto px-4 py-10">
        {user ? (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto border border-gray-200">
            <h1 className="text-3xl font-bold text-center mb-4">
              Welcome, {user.first_name}!
            </h1>
            <div className="text-center">
              <p className="text-lg mb-2">
                <span className="font-semibold">Role:</span> {user.role}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <div className="text-center mt-6">
                <NavLink
                  to="/calendar"
                  className="inline-block px-6 py-3 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300"
                  style={{ backgroundColor: "#800000" }}
                >
                  Upcoming Events
                </NavLink>
            </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-10 max-w-xl mx-auto border border-gray-300">
  <h1 className="text-3xl font-extrabold text-center mb-4">
    How are you doing today?
  </h1>
  <p className="text-center text-lg mb-4">
    Welcome to the page! We are glad you're here.
  </p>
  <p className="text-center text-2xl font-medium">नमस्ते!</p>
  <div className="text-center mt-6">
    <NavLink
      to="/calendar"
      className="inline-block px-6 py-3 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300"
      style={{ backgroundColor: "#800000" }}
    >
      Upcoming Events
    </NavLink>
  </div>
</div>

        )}
      </div>
    </div>
  );
};

export default Home;