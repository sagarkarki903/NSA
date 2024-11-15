import React from 'react';
import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { event_username } = useParams(); // Get username from the URL
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get('http://localhost:8080/eventslist');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  useEffect(() => {
    // Filter events based on the username from the URL
    if (events.length > 0) {
      const matchingEvents = events.filter(
        (event) => event.event_username === event_username
      );
      setFilteredEvents(matchingEvents);
    }
  }, [events, event_username]);

  return (
    <div className='bg-gray-100 p-6 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-6 text-gray-700'>
        Event Details for {event_username}
      </h1>
      <div className='bg-white shadow-md rounded-lg max-w-3xl mx-auto'>
        <div className='bg-maroon-700 p-4 rounded-t-lg flex justify-center'>
          <img src={nsaLogo} alt='ULM Logo' className='h-10 rounded-full' />
        </div>

        {/* Fetching Event Details Here */}
        <div className='p-4'>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div
                key={index}
                className='flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-200 hover:shadow-md transition duration-200 ease-in-out'
              >
                <span className='text-gray-700 font-medium'>
                  {event.event_name}
                </span>
                <span className='text-gray-500'>{event.year}</span>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-500'>
              No events available for {event_username}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
