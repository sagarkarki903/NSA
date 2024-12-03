import React from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { useState } from 'react';

const Rough = () => {
    const [rating, setRating] = useState(3);
  return (
    <>
        <h1>Rough</h1>
        <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-5">Rate our service</h1>
      <Rating
        value={rating}
        onChange={setRating}
        style={{ maxWidth: 250 }}
      />
      <p className="mt-3">Your rating: {rating}</p>
    </div>

    </>
  )
}

export default Rough