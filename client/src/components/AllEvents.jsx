import React, { useState, useEffect } from 'react';
import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const AllEvents = () => {
  
  const { category_id } = useParams(); // Get category_id from the URL
  const [allEvents, setAllEvents] = useState([]); // Proper casing
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [newEventName, setNewEventName] = useState(''); // State for new event name
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState(''); // State to store category name



  const fetchAPI = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/eventslist/${category_id}`);
      setFilteredEvents(response.data); // Directly set filtered events
      const categoryResponse = await axios.get(`http://localhost:8080/eventscategory/${category_id}`);
      setCategoryName(categoryResponse.data.category);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/eventslist', {
        category_id: category_id, // Extracted from URL
        event_name: newEventName,
      });
      alert('Event added successfully');
      setMessage(response.data.message); // Show success message
      setNewEventName(''); // Clear input field
      setShowForm(false); // Hide the form
      fetchAPI(); // Refresh event list
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Handle duplicate entry
        setMessage(
          `The event "${newEventName}" already exists in this category. Please choose a different name.`
        );
      } else {
        console.error('Error adding event:', error);
        setMessage('Failed to add event. Please try again.');
      }
    }
  };
  
  useEffect(() => {
    fetchAPI();
  });

  useEffect(() => {
    if (allEvents.length > 0) {
      const matchingEvents = allEvents.filter(
        (event) => event.category_id === Number(category_id) // Ensure proper type comparison
      );
      setFilteredEvents(matchingEvents);
    }
  }, [allEvents, category_id]); // Correct dependency array



  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:8080/eventslist/${eventId}`);
        alert('Event deleted successfully');
        fetchAPI(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };



  return (
    <div className='bg-gray-100 p-6 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-6 text-gray-700'>
        All {categoryName} Events
      </h1>
      <div className='bg-white shadow-md rounded-lg max-w-3xl mx-auto'>
        <div className='bg-maroon-700 p-4 rounded-t-lg flex justify-center'>
          <img src={nsaLogo} alt='ULM Logo' className='h-10 rounded-full' />
        </div>

        {/* Fetching All Events from events_list Here */}
        <div className='p-4'>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div
                key={index}
                className='flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-200 hover:shadow-md transition duration-200 ease-in-out'
              >
                <Link to={`/event/${category_id}/${event.event_name}`}>
                  <span className='text-gray-700 font-medium'>{event.event_name}</span>
                </Link>
                <button
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      
                            onClick={(e) => {
                              handleDelete(event.event_id);
                            }}
                          >
                          Delete
                        </button>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-500'>
              No events available for category {categoryName}.
              {filteredEvents.category}
            </p>
          )}

          <br />

          {/* Add Event Form */}
          <button
            className='bg-blue-500 text-white py-1 px-3 mr-2 rounded hover:bg-blue-600'
            onClick={() => {setShowForm(!showForm);
              setMessage(''); 
            }}
          >
            {showForm ? 'Cancel' : 'Add Event'}
          </button>

          {showForm && (
            <>
              <form onSubmit={handleAddEvent} className="mt-6">
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="Enter event name"
                  className="border rounded p-2 w-full mb-4"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Submit
                </button>
              </form>
              {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllEvents;
