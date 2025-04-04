import { useMemo } from 'react';

// Component hiển thị thông tin phim
export default function MovieInfo({ showtimeData, imageBaseUrl }) {
  // Hiển thị thông tin phim
  const renderMovieInfo = useMemo(() => {
    const movie = showtimeData?.showtime?.movie;
    const room = showtimeData?.showtime?.room;
    const startTime = showtimeData?.showtime?.start_time;
  
    if (!movie || !room || !startTime) return null; // Handle missing data
  
    return (
      <>
        <div className="flex flex-col md:flex-row items-center mb-4">
          <img
            src={`${imageBaseUrl}${movie?.poster}`}
            alt="Banner Phim"
            className="w-full md:w-1/2 h-48 object-cover rounded-lg mr-4"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{movie?.name}</h2>
            <p className="text-gray-600">
              2D Phụ đề{" "}
              {movie?.age_rating > 0 && ` - T${movie?.age_rating}`}
            </p>
          </div>
        </div>
  
        {/* Thông tin rạp và suất chiếu */}
        <div className="mt-4">
          <span className="font-semibold">
            {room?.cinema?.name} - {room?.name}
          </span>
          <p className="text-gray-800">
            Suất:{" "}
            <span className="font-semibold">
              {startTime?.time} - {startTime?.dayOfWeek}, {startTime?.date}
            </span>
          </p>
        </div>
      </>
    );
  }, [showtimeData, imageBaseUrl]);

  return renderMovieInfo;
}