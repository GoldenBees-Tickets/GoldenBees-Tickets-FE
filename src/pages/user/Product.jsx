import { useGetMoviesQuery } from "../../api/movieApi";
import HomeItemMovie from "@/components/user/Home/HomeItemMovie";
import { useState, useEffect, useMemo } from "react";
import { formatImage } from "@/utils/formatImage";

export default function Product() {
  const { data: List } = useGetMoviesQuery();
  const [activeTab, setActiveTab] = useState("now_showing"); // Default to "now_showing" instead of "all"
  const [searchTitle, setSearchTitle] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Use useMemo to process movies data only when List changes
  const { movies, uniqueYears, uniqueGenres } = useMemo(() => {
    if (!List?.movies) {
      return { movies: [], uniqueYears: [], uniqueGenres: [] };
    }

    // Lấy tất cả phim thay vì lọc theo status
    const activeMovies = List.movies;

    // Extract unique years
    const years = [...new Set(activeMovies.map(movie => movie.year))]
      .filter(Boolean)
      .sort((a, b) => b - a);
    
    // Extract unique genres
    const genres = [];
    activeMovies.forEach(movie => {
      movie.MovieGenres?.forEach(mg => {
        if (mg.Genre && !genres.some(g => g.id === mg.Genre.id)) {
          genres.push({ id: mg.Genre.id, name: mg.Genre.name });
        }
      });
    });

    return {
      movies: activeMovies,
      uniqueYears: years,
      uniqueGenres: genres,
    };
  }, [List]);

  // Use useMemo to filter movies only when dependencies change
  const filteredMovies = useMemo(() => {
    if (!movies.length) return [];
    
    return movies.filter(movie => {
      // Bỏ qua việc lọc theo status
      // if (activeTab !== "all" && movie.status !== activeTab) {
      //   return false;
      // }
      
      // Filter by title
      if (searchTitle && !movie.name.toLowerCase().includes(searchTitle.toLowerCase())) {
        return false;
      }
      
      // Filter by year
      if (filterYear && movie.year !== parseInt(filterYear)) {
        return false;
      }
      
      // Filter by genre
      if (filterGenre && !movie.MovieGenres?.some(mg => 
        mg.Genre?.id === parseInt(filterGenre)
      )) {
        return false;
      }
      
      return true;
    });
  }, [movies, searchTitle, filterYear, filterGenre]); // Loại bỏ activeTab khỏi dependencies

  const handleReset = () => {
    // setActiveTab("now_showing"); // Không cần thiết lập activeTab nữa
    setSearchTitle("");
    setFilterYear("");
    setFilterGenre("");
  };

  const toggleFilter = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  // Không cần getStatusCountText vì chúng ta không lọc theo status nữa
  // const getStatusCountText = useMemo(() => {
  //   if (!movies.length) return {};
    
  //   const nowShowing = movies.filter(m => m.status === "now_showing").length;
  //   const openingSoon = movies.filter(m => m.status === "opening_soon").length;
  //   const comingSoon = movies.filter(m => m.status === "coming_soon").length;
    
  //   return {
  //     now_showing: `Đang chiếu (${nowShowing})`,
  //     opening_soon: `Sắp chiếu (${openingSoon})`,
  //     coming_soon: `Sắp ra mắt (${comingSoon})`,
  //     all: `Tất cả (${movies.length})`
  //   };
  // }, [movies]);

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-12">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter section */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-6">
          <div className="flex flex-row items-center gap-3 flex-wrap">
            <div className="grow md:grow-0 md:w-60">
              <div className="relative">
                <input
                  id="searchTitle"
                  type="text"
                  placeholder="Tên phim..."
                  className="w-full pl-8 pr-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="w-36 md:w-40">
              <div className="relative">
                <select
                  id="filterYear"
                  className="w-full pl-8 pr-6 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="">Năm phát hành</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            <div className="w-36 md:w-40">
              <div className="relative">
                <select
                  id="filterGenre"
                  className="w-full pl-8 pr-6 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                >
                  <option value="">Thể loại</option>
                  {uniqueGenres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <svg className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            {(searchTitle || filterYear || filterGenre) && (
              <button
                onClick={handleReset}
                className="py-2 px-3 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Đặt lại
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-between mt-2 text-xs text-gray-500">
            <span>
              Hiển thị <span className="font-medium text-orange-500">{filteredMovies.length}</span> trên {movies.length} phim
              {(searchTitle || filterYear || filterGenre) && <span className="ml-1 text-orange-500">(đã lọc)</span>}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span>
            Hiển thị <span className="font-medium text-yellow-600">{filteredMovies.length}</span> phim 
            {filteredMovies.length < movies.length && <span className="text-xs text-orange-500 ml-1">(đã lọc)</span>}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Tổng cộng: {movies.length} phim
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <HomeItemMovie
              key={movie.id}
              title={movie.name}
              year={movie.year}
              imageSrc={formatImage(movie.poster)}
              id={movie.id}
              genres={movie.MovieGenres?.map(mg => ({ id: mg.Genre?.id, name: mg.Genre?.name }))}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy phim</h3>
          <p className="text-gray-500">Không có phim nào phù hợp với bộ lọc bạn đã chọn.</p>
          <button
            onClick={handleReset}
            className="mt-4 py-2 px-4 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
