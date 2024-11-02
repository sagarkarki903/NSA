import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios";
import nsaLogo from '../assets/nsaLogo.png';




const InitialFetch = () => {
  const [users, setUsers]= useState([]);
    //connecting backend to frontend by fetching from backend server.js
    const fetchAPI = async ()=> {
        try{const response = await axios.get("http://localhost:8080/dblist");
        setUsers(response.data);
    }
    catch(error){
      console.error("error fetching data", error);
    }
      };

    //calling the fetchAPI in every render
    useEffect(() => {
        fetchAPI();
         }, []);

         return (
          <div className='bg-gray-100 p-6 min-h-screen'>
            <h1 className='text-2xl font-bold text-center mb-6 text-gray-700'>
              User List
            </h1>
            <div className='bg-white shadow-md rounded-lg max-w-3xl mx-auto'>
              {/* Card Header with Maroon Background */}
              <div className='bg-maroon-700 p-4 rounded-t-lg flex justify-center'>
              
                <img src={nsaLogo} alt='ULM Logo' className='h-10 rounded-full' />
              </div>
              
              <div className='p-4'>
                <ul className='divide-y divide-gray-200'>
                  {users.map((user, index) => (
                    <li key={index} className='py-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-lg font-semibold text-gray-800'>
                            {user.first_name} {user.last_name}
                          </p>
                          <p className='text-gray-500'>Username: {user.username}</p>
                          <p className='text-gray-500'>Email: {user.email}</p>
                          <p className='text-gray-500'>classification: {user.classification}</p>
                          <p className='text-gray-500'>role: {user.role}</p>
                        
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              
            </div>
          </div>
        );
}

export default InitialFetch