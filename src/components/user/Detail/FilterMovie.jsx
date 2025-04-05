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
              className={`w-full flex flex-col items-center px-4 py-3 rounded-xl border transition duration-200
                ${
                  isSelected
                    ? "bg-orange-500 text-white border-orange-500 shadow-md"
                    : "bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-200"
                }
              `}
            >
              <span
                className={`font-medium text-sm ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {date.day}
              </span>
              <span
                className={`text-sm ${
                  isSelected ? "text-white" : "text-gray-500"
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
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-4 hover:shadow-md transition duration-200"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{cinema.cinema_name}</h3>
            <p className="text-gray-500 text-xs flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              2D Phụ Đề
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {cinema?.showtimes?.map((time) => (
            <Link 
              key={time.id} 
              to={`/booking/${time.id}?room_id=${time.room_id}`}
              className="block"
            >
              <div className="text-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition">
                <span className="font-medium">{time.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    ));
  }, [ListShowtimes, selectDate]);  

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Lịch Chiếu Phim
      </h2>

      <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-full md:w-[60%]">
            <div className="mb-1 flex items-center">
              <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium text-gray-700">Chọn ngày xem phim</span>
            </div>
            <Splide
              options={{
                perPage: 4,
                gap: "0.75rem",
                pagination: false,
                arrows: true,
                drag: true,
                speed: 800,
                easing: "ease",
                classes: {
                  arrow: 'splide__arrow custom-arrow',
                  prev: 'splide__arrow--prev custom-prev-arrow',
                  next: 'splide__arrow--next custom-next-arrow',
                }
              }}
            >
              {renderDates}
            </Splide>
          </div>

          <div className="w-full md:w-[40%]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Khu vực</span>
                </div>
                <select
                  id="branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none"
                >
                  <option value="">Toàn quốc</option>
                  {branch?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Rạp chiếu</span>
                </div>
                <select
                  id="theater"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none"
                >
                  <option value="">Tất cả rạp</option>
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
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Các suất chiếu có sẵn</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs text-gray-500">Còn chỗ</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
              <span className="text-xs text-gray-500">Sắp đầy</span>
            </div>
          </div>
        </div>
        
        {renderShowtimes || (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-200">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Không có suất chiếu</h3>
            <p className="text-sm text-gray-500">Không có suất chiếu nào cho phim này vào ngày đã chọn</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .custom-arrow {
          background: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          opacity: 0.8;
        }
        .custom-arrow:hover {
          opacity: 1;
          background: white;
        }
        .custom-arrow svg {
          fill: #f97316;
        }
      `}</style>
    </div>
  );
}
