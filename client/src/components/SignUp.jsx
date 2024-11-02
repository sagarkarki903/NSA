import React from 'react';
import { useNavigate } from 'react-router-dom';
import nsaLogo from '../assets/nsaLogo.png';
import backgroundImage from '../assets/nsagroup.jpg';
import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        classification: ''
      });
    
      const [error, setError] = useState(''); // State for error message
      const navigate = useNavigate(); // Initialize useNavigate
      
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); //reset the error before submission

        try {
            const response = await axios.post('http://localhost:8080/dblistAdd', formData);
            console.log('Account Created Successfully: ', response.data);
            navigate('/login');
        }catch(error){
            // If the server returns a 400 error, display the error message
            if (error.response && error.response.status === 400) {
                setError(error.response.data.error); // Set the error message from the server
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }

        
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

  return (
    
    <div
    className="min-h-screen bg-slate-500 flex items-center justify-center bg-cover bg-center bg-fixed px-4"
   style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }}
>
    <div className="w-full max-w-sm lg:max-w-md px-4 mx-auto mt-20 mb-20">
        {/* Logo container */}
        <div className="bg-[#852633] p-8 flex justify-center">
            <img src={nsaLogo} alt="NSA Logo" className="w-12 h-12 rounded-full" />
        </div>

        <div className="p-4 md:p-5" style={{ backgroundColor: '#F7F9FA' }}>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
                {/* SVG icon */}
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                </svg>
                Connecting to NSAEvents
            </h2>

            {error && (
                        <div className="mb-4 text-red-500 text-sm font-semibold">
                            {error}
                        </div>
                    )}

                {/* FORM  */}
                
                <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Name 
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    placeholder="Enter your First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633]"
                                />
                    </div>

                    <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Last Name 
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    placeholder="Enter your Last Name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633]"
                                />
                    </div>

                    <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name = "email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange= {handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633]"
                                />
                    </div>

                    <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name = "username"
                                    type="username"
                                    placeholder="Create a Username"
                                    value={formData.username}
                                    onChange= {handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633]"
                                />
                    </div>

                    <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name = "password"
                                type="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633]"
                            />
                        </div>


                    <div>
                        <label htmlFor="classification" 
                        className="block text-sm font-medium text-gray-700"> 
                        Classification
                        </label>
                        <select 
                        name="classification" 
                        id="classification"
                        value={formData.classification}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633] ${!formData.classification ? 'text-gray-500' : 'text-black'}`}
                        >
                            <option value="" disabled >Select your classification</option>
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="Graduate">Graduate</option>

                        </select>
                    </div>


                    <button
                         type="submit"
                         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base md:text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Create an Account
                    </button>

                </form>



            
                </div>
            </div>
        </div>
  )
}

export default SignUp