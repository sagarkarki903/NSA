import React, { useState, useEffect } from 'react';
import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { category_id, event_name } = useParams(); // Extract category_id and event_name from the URL
  const [eventDetails, setEventDetails] = useState({}); // Store the current event details
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [message, setMessage] = useState(''); // Message for success or errors

  const fetchAPI = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/eventslist/${category_id}`);
      const event = response.data.find(
        (event) =>
          event.category_id === Number(category_id) && event.event_name === event_name
      );
      setEventDetails(event || {});
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [category_id, event_name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/eventslist/${eventDetails.event_id}`, eventDetails);
      setMessage('Event details updated successfully.');
      setIsEditing(false); // Exit edit mode
      setTimeout(() => {
        setMessage(''); // Clear the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error('Error updating event:', error);
      setMessage('Failed to update event details. Please try again.');
      setTimeout(() => {
        setMessage(''); // Clear the message after 3 seconds
      }, 3000);
    }
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Event Details for {eventDetails.event_name}
      </h1>
      <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto">
        <div className="bg-[#852633] p-4 rounded-t-lg flex justify-center">
          <img src={nsaLogo} alt="ULM Logo" className="h-10 rounded-full" />
        </div>
        <div className="p-4">
          {message && <p className="text-center text-green-500 mb-4">{message}</p>}
          {!isEditing ? (
            // Display Mode
            <div>
              {eventDetails.event_image ? (
                <div className="mb-4">
                  <img
                    src={eventDetails.event_image}
                    alt="Event"
                    className="w-full h-80 object-cover rounded border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-gray-500 mb-4">No image available</p>
              )}
              <p>
                <strong>Event Name:</strong> {eventDetails.event_name || 'N/A'}
              </p>
              <p>
                <strong>Event Date:</strong>{' '}
                {eventDetails.event_date
                  ? new Date(eventDetails.event_date).toLocaleDateString()
                  : 'N/A'}
              </p>
              <p>
                <strong>Location:</strong> {eventDetails.location || 'N/A'}
              </p>
              <p>
                <strong>Total Budget:</strong> {eventDetails.budget || 'N/A'}
              </p>
              <p>
                <strong>Links:</strong>
                <span className="block whitespace-pre-wrap text-gray-700 mt-1">
                  {eventDetails.links
                    ? eventDetails.links
                        .split('\n') // Split by new lines for multiple links
                        .map((link, index) => (
                          <a
                            key={index}
                            href={link.trim()} // Ensure link is properly trimmed
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline block"
                          >
                            {link.trim()}
                          </a>
                        ))
                    : 'N/A'}
                </span>
              </p>
              <div className="mb-4">
                <strong>Documentation:</strong>
                <div className="block whitespace-pre-wrap text-gray-700 mt-1 border border-gray-300 p-2 rounded-md">
                  {eventDetails.event_documentation || 'N/A'}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-4"
              >
                Edit
              </button>
            </div>
          ) : (
            // Edit Mode
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Event Image Link</label>
                <input
                  type="text"
                  name="event_image"
                  value={eventDetails.event_image || ''}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste image URL here"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Event Name</label>
                <input
                  type="text"
                  name="event_name"
                  value={eventDetails.event_name || ''}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Event Date</label>
                <input
                  type="date"
                  name="event_date"
                  value={
                    eventDetails.event_date
                      ? new Date(eventDetails.event_date).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={eventDetails.location || ''}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Total Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={eventDetails.budget || ''}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter total budget"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Links</label>
                <textarea
                  name="links"
                  value={eventDetails.links || ''}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter links (separate multiple links by a new line)"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Documentation</label>
                <textarea
                  name="event_documentation"
                  value={eventDetails.event_documentation || ''}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event documentation details"
                  rows="15"
                ></textarea>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ml-4"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
