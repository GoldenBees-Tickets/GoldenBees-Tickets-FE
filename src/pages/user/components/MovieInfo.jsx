import { useMemo } from 'react';
import { formatImage } from '@/utils/formatImage';
import { formatDate, formatTime } from '../../../utils/format';

// Component hiển thị thông tin phim
export default function MovieInfo({ showtimeData, imageBaseUrl }) {
  // Hiển thị thông tin phim  
  const renderMovieInfo = useMemo(() => {
    const movie = showtimeData?.Movie;
    const room = showtimeData?.Room;
    const startTime = formatTime(showtimeData?.start_time) + " ngày " + formatDate(showtimeData?.show_date);    
    
    return (
      <>
        <div className="flex flex-col md:flex-row items-center mb-4">
          <img
            src={formatImage(movie?.poster)}
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
            {room?.Cinema?.name} - {room?.name}
          </span>
          <p className="text-gray-800">
            Suất:{" "}
            <span className="font-semibold">
              {startTime}
            </span>
          </p>
        </div>
      </>
    );
  }, [showtimeData, imageBaseUrl]);

  return renderMovieInfo;
}