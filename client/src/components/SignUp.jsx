// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    classification: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(''); // State to hold the OTP input
  const [isOtpSent, setIsOtpSent] = useState(false); // State to track OTP step
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle input change for form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle input change for OTP
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle form submission to register and send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post('https://nsa-events.onrender.com/userlist', formData);
      setMessage(response.data.message || 'OTP sent to your email!');
      setIsOtpSent(true); // Switch to OTP verification step
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register');
      console.error('There was an error!', error);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post('https://nsa-events.onrender.com/verify-otp', {
        email: formData.email,
        otp: otp,
      });
      setMessage(response.data.message || 'Account verified successfully!');
      navigate('/login'); // Redirect to login page after success
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify OTP');
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      {message && <p className="text-center text-green-500 mb-4">{message}</p>}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {!isOtpSent ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Classification</label>
            <select
              name="classification"
              value={formData.classification}
              onChange={handleChange}
              className="w-full px-2 py-1 mb-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Classification
              </option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;