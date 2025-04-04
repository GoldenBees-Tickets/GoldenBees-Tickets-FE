import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const bookTicket = () => {
    axios.post(`http://localhost:5000/api/movies/${id}/book`)
      .then(res => alert("Đặt vé thành công!"))
      .catch(err => alert("Hết vé!"));
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <p>Suất chiếu: {movie.showtimes.join(', ')}</p>
      <p>Vé còn lại: {movie.ticketsAvailable}</p>
      <button onClick={bookTicket}>Đặt vé</button>
    </div>
  );
};

export default MovieDetail;
