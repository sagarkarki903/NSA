import React from 'react';
import Navbar from './Navbar'; // Assuming Navbar is in the same folder
import InitialFetch from './InitialFetch';

const Home = () => {
  return (
    <div>
      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Home.</h1>
        <InitialFetch />
      </div>
    </div>
  );
};

export default Home;
