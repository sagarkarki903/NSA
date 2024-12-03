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
import AllEvents from './components/AllEvents';
import EventDetails from './components/EventDetails';
import Rough from './components/Rough';


const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/event/:category_id" element={<AllEvents />} />
            <Route path="/event/:category_id/:event_name" element={<EventDetails />} />
            <Route path="/rough" element={<Rough />} />
          

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
