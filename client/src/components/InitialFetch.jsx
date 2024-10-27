import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios";


const InitialFetch = () => {
    //connecting backend to frontend by fetching from backend server.js
    const fetchAPI = async ()=> {
        const response = await axios.get("http://localhost:8080/");
        console.log(response.data);
      };

    //calling the fetchAPI in every render
    useEffect(() => {
        fetchAPI();
         });

  return (
    <>
       <div className='bg-gray-400	background-color: rgb(156 163 175);'>
        This is the initial backend api fetch page. Also, cheking tailwind styling. 
       </div>
    </>
  )
}

export default InitialFetch