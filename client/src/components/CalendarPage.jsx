import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import axios from 'axios';

// Localization setup
const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false); // To track delete mode
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
  });

  // Fetch events from the server
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/up-events');
      if (response.status === 200) {
        const fetchedEvents = response.data.map(event => ({
          ...event,
          start: new Date(event.start), 
          end: new Date(event.end),
        }));
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events from the server.');
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setFormData({
      title: '',
      description: '',
      start: new Date(slotInfo.start).toISOString().slice(0, 16),
      end: new Date(slotInfo.end).toISOString().slice(0, 16),
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      calendar_events: formData.title,
      description: formData.description,
      start_date: formData.start,
      end_date: formData.end,
    };

    try {
      const response = await axios.post('http://localhost:8080/up-events', newEvent);
      if (response.status === 200) {
        fetchEvents();
        setShowForm(false);
        setFormData({ title: '', description: '', start: '', end: '' });
        alert('Event added successfully!');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event');
    }
  };

  const handleSelectEvent = (event) => {
    if (deleteMode) {
      setSelectedEvent(event); // Select the event to delete
    } else {
      setSelectedEvent({
        title: event.calendar_events || event.title, // Handle backend or local event title
        description: event.description,             // Event description
        start: event.start,
        end: event.end,
      });
      setShowEventDetails(true);
    }
  };
  
  
  const handleDeleteEvent = async () => {
    if (!selectedEvent) {
      alert('Please select an event to delete.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${selectedEvent.title}"?`);
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8080/up-events/${selectedEvent.calendar_id}`);
        alert('Event deleted successfully!');
        fetchEvents();
        setSelectedEvent(null);
        setDeleteMode(false);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete the event.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700 mt-6">
        Upcoming Events
      </h1>
      <div className="h-[580px] mt-6 mx-4 sm:mx-10 md:mx-20 lg:mx-40 xl:mx-60">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: '100%' }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                deleteMode && selectedEvent?.calendar_id === event.calendar_id ? 'red' : '#3174ad',
              color: 'white',
            },
          })}
        />
      </div>

      {/* Delete Mode Buttons */}
      <div className="text-center mt-4">
        {!deleteMode ? (
          <button
            onClick={() => setDeleteMode(true)}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
          >
            Delete Event
          </button>
        ) : (
          <>
            <button
              onClick={handleDeleteEvent}
              className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mr-2"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setDeleteMode(false)}
              className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Event</h2>
            <form onSubmit={handleFormSubmit}>
              <label className="block mb-2 text-gray-700">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
                required
              />
              <label className="block mb-2 text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
                required
              />
              <label className="block mb-2 text-gray-700">Start Date and Time</label>
              <input
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
                required
              />
              <label className="block mb-2 text-gray-700">End Date and Time</label>
              <input
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
                required
              />
              <div className="flex justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
{showEventDetails && selectedEvent && (
  <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      <h2 className="text-xl font-bold mb-4">Event Details</h2>
      <p>
        <strong>Title:</strong> {selectedEvent.title}
      </p>
      <p>
        <strong>Description:</strong> {selectedEvent.description}
      </p>
      <p>
        <strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}
      </p>
      <p>
        <strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}
      </p>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setShowEventDetails(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default CalendarPage;
