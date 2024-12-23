import React, { useState, useEffect } from 'react';
import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';


const EventDetails = () => {
  const { category_id, event_name } = useParams(); // Extract category_id and event_name from the URL
  const [eventDetails, setEventDetails] = useState({}); // Store the current event details
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [message, setMessage] = useState(''); // Message for success or errors
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState('');
  const [ratingstar, setRatingStar] = useState(null);
  const[fetchedReview, setFetchedReview] = useState([]);
  
  const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user's details

  const fetchAPI = async () => {
    try {
      const response = await axios.get(`https://nsa-events.onrender.com/eventslist/${category_id}`);
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
    // Check if all required fields are filled
    const { event_name, event_date, location, budget, event_documentation } = eventDetails;
  
    if (
      
      !event_name ||
      !event_date ||
      !location ||
      !budget ||
      !event_documentation
    ) {
      alert("Please fill out all fields before saving.");
      return;
    }
  
    console.log("Event details being sent:", eventDetails);

      // Normalize date format to YYYY-MM-DD
  const normalizedDetails = {
    ...eventDetails,
    event_date: event_date ? new Date(event_date).toISOString().split('T')[0] : null,
  };
  
    try {
      await axios.put(`https://nsa-events.onrender.com/eventslist/${eventDetails.event_id}`, normalizedDetails);
      setMessage("Event details updated successfully.");
      setIsEditing(false); // Exit edit mode
      setTimeout(() => {
        setMessage(""); // Clear the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("Failed to update event details. Please try again.");
      setTimeout(() => {
        setMessage(""); // Clear the message after 3 seconds
      }, 3000);
    }
  };

  //The following is for review section
  const handleReviewChange = (e) => {
      setReview(e.target.value);
  };

  const handleAddReview = () => {
    setShowForm(true);

  }

  const handleCancelReview = ()=> {
    setReview('');
    setShowForm(false);
  }

 // Add a Review
 const handlePostReview = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user's details

  if (!token) {
    alert("You must be logged in to post a review.");
    return;
  }

  if (!ratingstar || !review) {
    alert("Please provide a rating and a review.");
    return;
  }

  try {
    const reviewData = {
      event_id: eventDetails.event_id,
      review,
      rating: ratingstar,
      event_name: eventDetails.event_name,
      user_name : `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
    };

    // // Optimistic update
    // setFetchedReview((prev) => [...prev, reviewData]);

    await axios.post("https://nsa-events.onrender.com/add-review", reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Review added successfully!");
    setShowForm(false);
    setReview("");
    setRatingStar(null);
    DisplayReviews();
  } catch (error) {
    console.error("Error adding review:", error);

    // Rollback optimistic update
    setFetchedReview((prev) =>
      prev.filter((item) => item !== reviewData)
    );

    alert("Failed to add review. Please try again.");
  }
};

  //This is for fetching reviews data
  const DisplayReviews = async ()=> {
        try {
          const response = await axios.get('https://nsa-events.onrender.com/fetch-reviews');
          setFetchedReview(response.data.filter((review) => review.event_id === eventDetails.event_id)); // Store fetched data in state
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        
      };

      useEffect(() => {
        if (eventDetails.event_id) {
          DisplayReviews();
        }
      }, [eventDetails.event_id]);
      

    
      const filteredReviews = fetchedReview.filter(
        (review) =>
          review.event_id &&
          eventDetails.event_id &&
          review.event_id === eventDetails.event_id
      );



const handleDeleteReview = async (review_id) => {
  if (window.confirm("Are you sure you want to delete this review?")) {
    try {
      await axios.delete(`https://nsa-events.onrender.com/delete-review/${review_id}`);
      alert("Review deleted successfully");
       DisplayReviews();
   
      
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  }
};

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Event Details for {eventDetails.event_name}
      </h1>
      <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto">
        <div className="bg-[#800000] p-4 rounded-t-lg flex justify-center">
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
                <strong>Total Budget: </strong>${eventDetails.budget || 'N/A'}
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
              {user?.role === "President" && (
    <button
      onClick={() => setIsEditing(true)}
      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mt-4"
    >
      Edit
    </button>
  )}
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
                  required
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

     

    <div
      className="review-section w-full border-t border-gray-300 bg-gray-100 shadow-md p-4 mt-6
             lg:w-full lg:border-t lg:mt-4"
    >
      <h2 className="text-lg font-bold text-gray-700">Reviews</h2>
      <div className="space-y-4 mt-4">
   
    {filteredReviews.length === 0 ? (
      <p>No reviews yet.</p>
    ): (
      
      filteredReviews.map((review, index) => (
       <div key={index} className="bg-white p-4 rounded-md shadow">
      <p className="font-semibold text-gray-800">
      {review.user_name || "Anonymous"}
        </p>
      <Rating value={review.rating} readOnly style={{ maxWidth: 100 }} />
      <p className="text-gray-600 mt-2">{review.review}</p>
      
     {/* Only show the Delete button if the user is the President */}
     {user?.role === 'President' && (
              <button
              onClick={() => handleDeleteReview(review.review_id)}
              className="bg-red-500 text-white px-2 py-1 rounded-md mt-2 hover:bg-red-600"
            >
              Delete
            </button>
            )}        
               
    </div>
      ))
    )}

    {/* /add review form */}
    {showForm && (
      <div className="bg-white p-4 rounded-md shadow">
      <p className="font-semibold text-gray-800">Anonymous</p>
      <Rating
        value={ratingstar}
        onChange={setRatingStar}
        style={{ maxWidth: 150 }}
      />
      <p className="text-gray-600 mt-2">
        <textarea
          value={review}
          onChange={handleReviewChange}
          className="border border-gray-400 w-96 h-24 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Type your review"
          />  
      </p>
      <div className="mt-4 space-x-4">
            <button
              onClick={handlePostReview}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Post
            </button>
            <button
              onClick={handleCancelReview}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Cancel
            </button>
        
        </div>
    </div>

    )}

        {/* Review Add Cancel Button Logic */}
        
        {user && (
        <div className="mt-4 space-x-4">
            <button
              onClick={handleAddReview}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Add Review
            </button>
            
        
        </div>
)}
        

      {/* //////////////////// */}
      </div> 
    </div>
    </div>
  );
};

export default EventDetails;
