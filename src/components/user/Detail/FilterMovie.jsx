import { useState, useMemo, useEffect } from "react";
import { useGetBranchesQuery } from "../../../api/branchApi";
import { useGetCinemasQuery } from "../../../api/cinemaApi";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useParams } from "react-router-dom";
import { useGetShowtimesByMovieIdQuery } from "../../../api/showtimeApi";
import { Link } from "react-router-dom";

export default function FilterMovie() {
  const { id } = useParams();
  const movie_id = id;

  const [selectDate, setSelectDate] = useState("");

  const { data: ListShowtimes } = useGetShowtimesByMovieIdQuery(movie_id, {
    skip: !movie_id,
  });
  

  useEffect(() => {
    if (ListShowtimes?.data) {
      setSelectDate(ListShowtimes?.data[0]?.date);
    }
  }, [ListShowtimes?.data]);

  const { data: List } = useGetBranchesQuery();
  const branch = List?.branches;

  const { data: List2 } = useGetCinemasQuery();
  const allCinemas = List2?.cinemas;

  const [selectedBranch, setSelectedBranch] = useState("");

  const filteredCinemas = useMemo(() => {
    if (!selectedBranch) return allCinemas || [];
    return (
      allCinemas?.filter(
        (item) => item.branch_id === parseInt(selectedBranch)
      ) || []
    );
  }, [selectedBranch, allCinemas]);

  const renderDates = useMemo(
    () =>
      ListShowtimes?.data?.map((date, index) => {
        const isSelected = selectDate === date.date;

        return (
          <SplideSlide key={index}>
            <button
              onClick={() => setSelectDate(date.date)}
              className={`w-full flex flex-col items-center px-4 py-2 rounded-lg border border-gray-300 transition
                ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-blue-500 hover:text-white"
                }
              `}
            >
              <span
                className={`font-medium ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {date.day}
              </span>
              <span
                className={`text-sm ${
                  isSelected ? "text-white" : "text-gray-600"
                }`}
              >
                {date.date}
              </span>
            </button>
          </SplideSlide>
        );
      }),
    [ListShowtimes, selectDate]
  );

  const renderShowtimes = useMemo(() => {
    // Tìm ngày tương ứng với selectDate
    const selectedDay = ListShowtimes?.data?.find(day => day.date === selectDate);
  
    // Nếu không có ngày nào khớp, trả về null
    if (!selectedDay) return null;
  
    return selectedDay.cinemas.map((cinema) => (
      <div
        key={cinema.cinema_id}
        className="bg-gray-50 p-4 border-t-2 border-t-gray-500 mt-4"
      >
        <h3 className="font-semibold text-lg">{cinema.cinema_name}</h3>
        <p className="text-gray-500 text-sm mb-2">2D Phụ Đề</p>
        <div className="flex gap-3 flex-wrap">
          {cinema?.showtimes?.map((time) => (
            <button
              key={time.id}
              className="px-4 py-2 border rounded-md hover:bg-gray-200 transition"
            >
              <Link to={`/booking/${time.id}?room_id=${time.room_id}`}>
              {time.time}
              </Link>
            </button>
          ))}
        </div>
      </div>
    ));
  }, [ListShowtimes, selectDate]);  

  return (
    <>
      <div className="flex items-center flex-col md:flex-row w-full p-6 bg-white rounded-lg shadow space-y-6 md:space-y-0 md:space-x-6">
        <div className="w-full md:w-[60%]">
          <Splide
            options={{
              perPage: 4,
              gap: "1rem",
              pagination: false,
              arrows: true,
              drag: true,
              speed: 1200,
              easing: "ease",
            }}
          >
            {renderDates}
          </Splide>
        </div>

        <div className="w-full md:w-[40%]">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full">
              <select
                id="branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Toàn quốc</option>
                {branch?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <select
                id="theater"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option disabled value="">
                  Tất cả rạp
                </option>
                {filteredCinemas?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Rạp 1 */}
        {renderShowtimes}
      </div>
    </>
  );
}
