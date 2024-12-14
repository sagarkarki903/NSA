import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState(""); // State for flash message
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }

    // Show flash message
    setFlashMessage("Logged you out!");
    setTimeout(() => {
      setFlashMessage(""); // Clear the message after 1 second
      window.location.reload(); // Reload the page after message disappears
      navigate("/");
    }, 2000);
  };

  const renderLinks = () => (
    <>
      <Link to="/" className="hover:text-gray-300">Home</Link>
      <Link to="/about" className="hover:text-gray-300">About Us</Link>
      <Link to="/events" className="hover:text-gray-300">Events</Link>
      <Link to="/contact" className="hover:text-gray-300">Contact Us</Link>

      {/* Conditionally render the Users link for President role */}
      {user?.role === "President" && (
        <Link to="/users" className="hover:text-gray-300">Users</Link>
      )}

      {user ? (
        <>
          <span className="hover:text-gray-300">
            Welcome, {user.first_name}!
          </span>
          <button
            onClick={handleLogout}
            className="hover:text-gray-300"
          >
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="hover:text-gray-300">Login</Link>
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
      <nav style={{ backgroundColor: '#800000' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">ULM</h1>
            </div>
            <div className="hidden md:flex space-x-4">{renderLinks()}</div>
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{renderLinks()}</div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;