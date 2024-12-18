import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Default styles
import axios from "axios";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the server
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/eventslist");
      // Convert fetched events to react-big-calendar compatible format
      const formattedEvents = response.data.map((event) => ({
        id: event.event_id,
        title: event.event_name,
        start: new Date(event.event_date), // Ensure date is ISO 8601 formatted
        end: new Date(event.event_date),
        description: event.event_documentation || "No description available",
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Custom event popup
  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}\nDetails: ${event.description}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Event Calendar</h1>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
          defaultDate={new Date()}
        />
      </div>
    </div>
  );
};

export default Calendar;
