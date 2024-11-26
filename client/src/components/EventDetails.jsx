import React from 'react';
import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const EventDetails = () => {
  const { category_id, event_name } = useParams(); // Extract category_id and event_name from the URL


  return (
    <div className='bg-gray-100 p-6 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-6 text-gray-700'>
      Event Details for {event_name}

      </h1>
      <div className='bg-white shadow-md rounded-lg max-w-3xl mx-auto'>
        <div className='bg-maroon-700 p-4 rounded-t-lg flex justify-center'>
          <img src={nsaLogo} alt='ULM Logo' className='h-10 rounded-full' />
        </div>

        {/* Fetching Event Details Here */}
        DETAILS DOCS
        
       
      </div>
    </div>
  );
};

export default EventDetails;
