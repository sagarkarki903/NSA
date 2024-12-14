import React, { useState, useEffect } from "react";
import Navbar from "./Navbar"; // Assuming Navbar is in the same folder

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
    <div className="min-h-screen bg-gray-50 text-gray-800">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;