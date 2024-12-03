import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import nsaLogo from '../assets/nsaLogo.png';
import backgroundImage from '../assets/nsagroup.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });
            
            if (response.status === 200) {
                console.log('Login successful');
                navigate('/'); // Redirect to home or another page after successful login
            }
        } catch (err) {
            setError('Invalid email or password');
            console.error('Login error:', err);
        }
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
            <div className="w-full max-w-sm lg:max-w-md px-4 mx-auto">
                {/* Logo container */}
                <div className="bg-[#852633] p-8 flex justify-center">
                    <img src={nsaLogo} alt="NSA Logo" className="w-12 h-12 rounded-full" />
                </div>

                <div className="p-4 md:p-5" style={{ backgroundColor: '#F7F9FA' }}>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
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

                    {error && <p className="text-center text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633]"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[#852633] focus:ring-1 focus:ring-[#852633]"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-[#852633] focus:ring-[#852633] border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base md:text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Continue
                        </button>

                        <div className="mt-4 text-center">
                            <Link to="/forgot-password" className="text-sm text-[#852633] hover:underline">
                                Forgot Password
                            </Link>
                        </div>
                        <div className="mt-4 text-center">
                            <Link to="/signUp" className="text-sm text-[#852633] hover:underline">
                                Sign Up here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;