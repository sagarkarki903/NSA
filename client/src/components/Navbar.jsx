import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setFlashMessage("Logged you out!");
    setTimeout(() => {
      setFlashMessage("");
      window.location.reload();
      navigate("/");
    }, 2000);
  };

  const renderLeftLinks = () => (
    <>
      <NavLink
        onClick={() => setIsOpen(!isOpen)}
        to="/"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium ${
            isActive
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
              
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
      onClick={() => setIsOpen(!isOpen)}
        to="/about"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium ${
            isActive
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`
        }
      >
        About Us
      </NavLink>

      <NavLink
      onClick={() => setIsOpen(!isOpen)}
        to="/events"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium ${
            isActive
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`
        }
      >
        Past Events
      </NavLink>
      <NavLink
      onClick={() => setIsOpen(!isOpen)}
        to="/contact"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md text-sm font-medium ${
            isActive
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`
        }
      >
        Contact Us
      </NavLink>
      {user?.role === "President" && (
        <NavLink
        onClick={() => setIsOpen(!isOpen)}
          to="/users"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Users
        </NavLink>
      )}
    </>
  );

  const renderRightLinks = () => (
    <>
      {user ? (
        <NavLink to="/" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-4">
          <span className="text-black bg-slate-100 rounded-md px-2 py-1">Welcome, {user.first_name}!</span>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Logout
          </button>
        </div>
        </NavLink>
      ) : (
        <NavLink
        onClick={() => setIsOpen(!isOpen)}
          to="/login"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          Login
        </NavLink>
      )}
    </>
  );

  return (
    <>
      {flashMessage && (
        <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
          {flashMessage}
        </div>
      )}
      <nav style={{ backgroundColor: "#800000" }} className="text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left-aligned Links */}
            
            <div className="flex items-center space-x-4">
            <NavLink to="/"><h1 className="text-xl font-bold cursor-pointer">NSA</h1></NavLink>  
              <div className="hidden md:flex space-x-4">{renderLeftLinks()}</div>
            </div>

            {/* Right-aligned Links */}
            <div className="hidden md:flex space-x-4">{renderRightLinks()}</div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu for Mobile */}
        {isOpen && (
  <div
  className={`md:hidden bg-gray-800 text-white absolute top-16 left-0 w-full z-50 transform transition-transform ${
    isOpen ? "translate-y-0" : "-translate-y-full"
  }`}
>

    <div className="flex flex-col space-y-2 px-4 py-3 items-center">
      {renderLeftLinks()}
    </div>
    <div className="border-t border-gray-600 mt-2 pt-2 px-24">
      {renderRightLinks()}
    </div>
  </div>
)}

      </nav>
    </>
  );
};

export default Navbar;
