import { useParams } from "react-router-dom";
import { useGetShowtimesByMovieIdQuery } from "../../../api/showtimeApi";
import { useMemo } from "react";

export default function ListShowtime() {
  const { id } = useParams();
  const movie_id = id;
  const { data: ListShowtimes } = useGetShowtimesByMovieIdQuery(movie_id, {
    skip: !movie_id,
  });
  
  const renderShowtimes = useMemo(
    () =>
      ListShowtimes?.data?.map((cinema, index) => (
        <div key={cinema.cinema_id} className="bg-gray-50 p-4 border-t-2 border-t-gray-500 mt-4">
          <h3 className="font-semibold text-lg">{cinema.cinema_name}</h3>
          <p className="text-gray-500 text-sm mb-2">2D Phụ Đề</p>
          <div className="flex gap-3 flex-wrap">
            {cinema?.showtimes?.map((time) => (
            <button
            key={time.id}
            className="px-4 py-2 border rounded-md hover:bg-gray-200 transition"
          >
            {time.time}
          </button>
            ))}
          </div>
        </div>
      )),
    [ListShowtimes]
  );

  return (
    <div className="w-full space-y-6">
      {/* Rạp 1 */}
      {renderShowtimes}
    </div>
  );
}
