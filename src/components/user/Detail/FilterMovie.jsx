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
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Query lấy suất chiếu với tham số lọc
  const { data: ListShowtimes, isLoading, error, refetch } = useGetShowtimesByMovieIdQuery(
    {
      movie_id,
      branch_id: selectedBranch || undefined,
      cinema_id: selectedCinema || undefined,
      current_time: true
    }, 
    {
      skip: !movie_id,
      pollingInterval: 5 * 60 * 1000,
      refetchOnMountOrArgChange: true
    }
  );

  // Làm mới dữ liệu xuất chiếu mỗi khi thời gian thay đổi
  useEffect(() => {
    const getTimeToNextMinute = () => {
      const now = new Date();
      const nextMinute = new Date(now);
      nextMinute.setMinutes(now.getMinutes() + 1, 0, 0);
      return nextMinute.getTime() - now.getTime();
    };

    const refreshTimer = setTimeout(() => {
      console.log("Đang làm mới dữ liệu xuất chiếu...");
      refetch();
      setRefreshKey(prev => prev + 1);
    }, getTimeToNextMinute());

    return () => clearTimeout(refreshTimer);
  }, [refetch, refreshKey]);
  
  const { data: List } = useGetBranchesQuery();
  const { data: List2 } = useGetCinemasQuery();
  
  // Đặt ngày mặc định khi có dữ liệu
  useEffect(() => {
    if (ListShowtimes && Array.isArray(ListShowtimes) && ListShowtimes.length > 0) {
      setSelectDate(ListShowtimes[0]?.show_date);
    }
  }, [ListShowtimes]);

  // Lọc rạp chiếu theo khu vực
  const filteredCinemas = useMemo(() => {
    if (!selectedBranch) return List2?.cinemas || [];
    return List2?.cinemas?.filter(
      (item) => item.branch_id === parseInt(selectedBranch)
    ) || [];
  }, [selectedBranch, List2?.cinemas]);

  // Reset selected cinema khi thay đổi khu vực
  useEffect(() => {
    setSelectedCinema("");
  }, [selectedBranch]);

  // Lấy danh sách ngày duy nhất từ ListShowtimes và sắp xếp theo ngày
  const uniqueDates = useMemo(() => {
    if (!ListShowtimes || !Array.isArray(ListShowtimes)) return [];
    
    const dates = [...new Set(ListShowtimes.map(showtime => showtime.show_date))];
    
    return dates.sort((a, b) => new Date(a) - new Date(b));
  }, [ListShowtimes]);

  const renderDates = useMemo(
    () => {
      if (!uniqueDates || uniqueDates.length === 0) {
        return null;
      }
      
      return uniqueDates.map((date, index) => {
        const isSelected = selectDate === date;
        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'short' });
        const formattedDate = dateObj.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });

        return (
          <SplideSlide key={index}>
            <button
              onClick={() => setSelectDate(date)}
              className={`w-full flex flex-col items-center px-4 py-3 rounded-xl border transition duration-300
                ${
                  isSelected
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg transform scale-105"
                    : "bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-200 hover:shadow"
                }
              `}
            >
              <span
                className={`font-medium text-sm ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {dayName}
              </span>
              <span
                className={`text-sm ${
                  isSelected ? "text-white/90" : "text-gray-500"
                }`}
              >
                {formattedDate}
              </span>
            </button>
          </SplideSlide>
        );
      });
    },
    [uniqueDates, selectDate]
  );

  const renderShowtimes = useMemo(() => {
    if (!ListShowtimes || !Array.isArray(ListShowtimes) || !selectDate) {
      return null;
    }
    
    // Lọc suất chiếu theo ngày đã chọn
    const showtimesForDate = ListShowtimes.filter(showtime => showtime.show_date === selectDate);
    
    // Nhóm suất chiếu theo rạp
    const showtimesByCinema = showtimesForDate.reduce((acc, showtime) => {
      // Kiểm tra Room và Cinema có tồn tại không
      if (!showtime.Room || !showtime.Room.Cinema) {
        console.warn('Showtime missing Room or Cinema data:', showtime);
        return acc;
      }
      
      const cinemaId = showtime.Room.cinema_id;
      const cinemaName = showtime.Room.Cinema.name;
      
      if (!cinemaId || !cinemaName) {
        console.warn('Showtime missing cinema_id or name:', showtime);
        return acc;
      }
      
      // Nếu đã chọn rạp cụ thể, bỏ qua các rạp khác
      if (selectedCinema && cinemaId !== parseInt(selectedCinema)) {
        return acc;
      }
      
      if (!acc[cinemaId]) {
        acc[cinemaId] = {
          cinema_id: cinemaId,
          cinema_name: cinemaName,
          showtimes: []
        };
      }
      acc[cinemaId].showtimes.push(showtime);
      return acc;
    }, {});

    const cinemas = Object.values(showtimesByCinema);
    
    if (cinemas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border border-gray-200">
          <svg className="w-20 h-20 text-gray-300 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy suất chiếu</h3>
          <p className="text-sm text-gray-500 max-w-md">Không có suất chiếu nào phù hợp với bộ lọc của bạn. Vui lòng thử lại với các tiêu chí khác.</p>
        </div>
      );
    }

    return cinemas.map((cinema) => {
      // Không cần lọc lại ở frontend vì đã được lọc ở backend
      let availableShowtimes = cinema.showtimes;

      if (!availableShowtimes || availableShowtimes.length === 0) return null;

      return (
        <div
          key={cinema.cinema_id}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-5 hover:shadow-lg transition duration-300 group"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4 group-hover:bg-orange-200 transition duration-300">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{cinema.cinema_name}</h3>
              <p className="text-gray-500 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                2D Phụ Đề
              </p>
            </div>
          </div>
          
          <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {availableShowtimes.map((showtime) => (
              <Link 
                key={showtime.id} 
                to={`/booking/${showtime.id}?room_id=${showtime.room_id}`}
                className="block"
              >
                <div className="text-center px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 hover:shadow group">
                  <span className="font-medium group-hover:scale-105 inline-block transition-transform">
                    {showtime.start_time ? showtime.start_time.split(':').slice(0, 2).join(':') : 'N/A'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }).filter(Boolean);
  }, [ListShowtimes, selectDate, selectedCinema]);

  const handleReset = () => {
    setSelectedBranch("");
    setSelectedCinema("");
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Lịch Chiếu Phim
      </h2>

      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-full md:w-[60%]">
            <div className="mb-2 flex items-center">
              <svg className="w-5 h-5 mr-1.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Chọn ngày xem phim</span>
            </div>
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
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
            )}
          </div>

          <div className="w-full md:w-[40%]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Khu vực</span>
                </div>
                <select
                  id="branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="">Toàn quốc</option>
                  {List?.branches?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Rạp chiếu</span>
                </div>
                <select
                  id="theater"
                  value={selectedCinema}
                  onChange={(e) => setSelectedCinema(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none cursor-pointer"
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

        {(selectedBranch || selectedCinema) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="text-xs flex items-center px-3 py-1.5 text-white bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-5 px-1">
          <span className="text-sm text-gray-600 font-medium">Các suất chiếu có sẵn</span>
          <div className="flex items-center gap-5">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Còn chỗ</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Sắp đầy</span>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border border-gray-200">
            <svg className="w-20 h-20 text-red-300 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Lỗi khi tải dữ liệu</h3>
            <p className="text-sm text-gray-500 max-w-md">Có lỗi xảy ra khi tải lịch chiếu phim. Vui lòng thử lại sau.</p>
          </div>
        ) : !ListShowtimes || !Array.isArray(ListShowtimes) || ListShowtimes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border border-gray-200">
            <svg className="w-20 h-20 text-gray-300 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Không có dữ liệu suất chiếu</h3>
            <p className="text-sm text-gray-500 max-w-md">Hiện không có suất chiếu nào cho phim này. Vui lòng kiểm tra lại sau.</p>
          </div>
        ) : renderShowtimes || (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border border-gray-200">
            <svg className="w-20 h-20 text-gray-300 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Không có suất chiếu</h3>
            <p className="text-sm text-gray-500 max-w-md">Không có suất chiếu nào cho phim này vào ngày đã chọn. Vui lòng chọn ngày khác hoặc kiểm tra lại sau.</p>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-arrow {
          background: white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          opacity: 0.9;
          transition: all 0.2s;
        }
        .custom-arrow:hover {
          opacity: 1;
          background: white;
          transform: scale(1.1);
          box-shadow: 0 3px 12px rgba(0,0,0,0.15);
        }
        .custom-arrow svg {
          fill: #f97316;
        }
        
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
    </div>
  );
}
