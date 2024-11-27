
// .......................EVENTS Categories.................................................

import nsaLogo from '../assets/nsaLogo.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Events=()=>{

    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      category: '',
    });
    const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
    const [editingCategoryId, setEditingCategoryId] = useState(null); // ID of the category being edited
    const [updatedCategoryName, setUpdatedCategoryName] = useState(''); // Updated category name

    


    const fetchAPI = async () => {
        try {
          const response = await axios.get("http://localhost:8080/eventscategory");
          setEvents(response.data);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };

      useEffect(() => {
        fetchAPI();
      });
    
      //handling form submission
      const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error messages

        try {
          await axios.post('http://localhost:8080/eventscategory', formData);
          alert('Event added successfully');
          setFormData({ category: '' }); // Clear the form
          setShowForm(false); // Hide the form
          fetchAPI(); // Refresh the events list
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setErrorMessage('This category already exists'); // Set the duplicate entry error
              } else {
                console.error('Error adding category:', error);
                alert('An error occurred while adding the category');
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

      //handling delete
      const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
          try {
            await axios.delete(`http://localhost:8080/eventscategory/${categoryId}`);
            alert('Category deleted successfully');
            fetchAPI(); // Refresh the list after deletion
          } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
          }
        }
      };

      const handleEditCategory = (categoryId, currentName) => {
        setEditingCategoryId(categoryId); // Set the editing mode
        setUpdatedCategoryName(currentName); // Prefill the current name in the input
      };
    
      const handleUpdateCategory = async () => {
        try {
          await axios.put(`http://localhost:8080/eventscategory/${editingCategoryId}`, {
            category: updatedCategoryName,
          });
          alert('Category updated successfully');
          setEditingCategoryId(null); // Exit editing mode
          setUpdatedCategoryName(''); // Clear input
          fetchAPI();
        } catch (error) {
          console.error('Error updating category:', error);
          alert('Failed to update category');
        }
      };
    
      

return( 

  <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Events Categories</h1>
      <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto">
        <div className="bg-maroon-700 p-4 rounded-t-lg flex justify-center">
          <img src={nsaLogo} alt="ULM Logo" className="h-10 rounded-full" />
        </div>

        <div className="p-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.category_id}
                className="flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-200 hover:shadow-md transition duration-200 ease-in-out"
              >
                {editingCategoryId === event.category_id ? (
                  <>
                    <input
                      type="text"
                      value={updatedCategoryName}
                      onChange={(e) => setUpdatedCategoryName(e.target.value)}
                      className="border rounded p-2 mr-2 w-1/2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdateCategory}
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategoryId(null);
                          setUpdatedCategoryName('');
                        }}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to={`/event/${event.category_id}`} className="block w-1/2">
                      <span className="text-gray-700 font-medium">{event.category}</span>
                    </Link>
                    <div className="flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                        onClick={() => handleEditCategory(event.category_id, event.category)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                        onClick={() => handleDelete(event.category_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No events available</p>
          )}
          <br />

          <button
            className="bg-blue-500 text-white py-1 px-3 mr-2 rounded hover:bg-blue-600"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Category'}
          </button>

          {showForm && (
            <form onSubmit={handleFormSubmit} className="mt-4">
              <div className="mb-3">
                <label htmlFor="category" className="block text-gray-700">
                  Event Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
              >
                Submit
              </button>
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>



)
};

export default Events;
