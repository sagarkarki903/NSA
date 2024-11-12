import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Events from './components/Events';
import Contact from './components/Contact';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUp from './components/SignUp';

const App = () => {
  const [user, setUser] = useState(null);

  // Function to handle setting the user data after login
  const handleLogin = (userData) => {
    setUser(userData); // Set user data without saving to localStorage
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
