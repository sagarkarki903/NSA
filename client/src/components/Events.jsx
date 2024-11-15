import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Events=()=>{

    const [events, setEvents] = useState([]);


    const fetchAPI = async () => {
        try {
          const response = await axios.get("http://localhost:8080/eventsummary");
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      useEffect(() => {
        fetchAPI();
      }, []);
    

return( 

    <div className='bg-gray-100 p-6 min-h-screen'>
    <h1 className='text-2xl font-bold text-center mb-6 text-gray-700'>
      Events Summary
    </h1>
    <div className='bg-white shadow-md rounded-lg max-w-3xl mx-auto'>
      <div className='bg-maroon-700 p-4 rounded-t-lg flex justify-center'>
        <img src={nsaLogo} alt='ULM Logo' className='h-10 rounded-full' />
      </div>

        {/* Fetching Events here */}
        <div className='p-4'>
        {events.length > 0 ? (
          events.map((event, index) => (
            <Link
                to={`/event/${event.event_username}`}
                key={index}
                className="block"
              >
                    <div
                    key={index}
                    className='flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-200 hover:shadow-md transition duration-200 ease-in-out'
                    >
                    <span className='text-gray-700 font-medium'>
                        {event.event_name}
                    </span>
                  
                    </div>
            </Link>
          ))
        ) : (
          <p className='text-center text-gray-500'>No events available</p>
        )}
      </div>



   
    </div>
  </div>



)
};

export default Events;
