import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Events=()=>{

    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      event_name: '',
      event_username: '',
    });
    const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
    


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
    
      //handling form submission
      const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error messages

        try {
          await axios.post('http://localhost:8080/eventsummary', formData);
          alert('Event added successfully');
          setFormData({ event_name: '', event_username: '' }); // Clear the form
          setShowForm(false); // Hide the form
          fetchAPI(); // Refresh the events list
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrorMessage('Event with this username already exists'); // Set the duplicate entry error
              } else {
                console.error('Error adding event:', error);
                alert('An error occurred while adding the event');
              }
        }
      };
    
      //handling input change
      const handleInputChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

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
            <br />


            {/* Add Events */}
         <button  className='bg-blue-500 text-white py-1 px-3 mr-2 rounded hover:bg-blue-600'
         onClick={() => setShowForm(!showForm) }>
                {showForm ? 'Cancel' : 'Add Event'}
            </button>

            {/* Show Form */}
            {showForm && (
            <form onSubmit={handleFormSubmit} className='mt-4'>
              <div className='mb-3'>
                <label htmlFor='event_name' className='block text-gray-700'>
                  Event Name
                </label>
                <input
                  type='text'
                  id='event_name'
                  name='event_name'
                  value={formData.event_name}
                  onChange={handleInputChange}
                  required
                  className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='event_username' className='block text-gray-700'>
                  Event Username
                </label>
                <input
                  type='text'
                  id='event_username'
                  name='event_username'
                  value={formData.event_username}
                  onChange={handleInputChange}
                  required
                  className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <button
                type='submit'
                className='bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600'
              >
                Submit
              </button>
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p> // Error message appears here
                )}
            </form>
          )}
            
      </div>
       
            

   
    </div>
  </div>



)
};

export default Events;
