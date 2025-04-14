import { useGetMoviesQuery } from "@/api/movieApi";
import HomeItemMovie from "@/components/user/Home/HomeItemMovie";
import { useState, useMemo } from "react";
import { formatImage } from "@/utils/formatImage";
import { filterMoviesByStatus, filterMoviesBySearchCriteria } from "@/utils/movieFilters";

export default function Product() {
  const [activeTab, setActiveTab] = useState("nowShowing"); // "nowShowing" or "comingSoon"
  const { data: List, isLoading, error } = useGetMoviesQuery();    
  const [searchTitle, setSearchTitle] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  
  // Get filtered movies by status - only recalculates when List changes
  const { nowShowingMovies, comingSoonMovies } = useMemo(() => {
    const ListMovie = List?.movies || [];
    return filterMoviesByStatus(ListMovie);
  }, [List]);
  
  // Choose which list to use based on active tab - only recalculates when tab or movie lists change
  const moviesForCurrentTab = useMemo(() => {
    return activeTab === "nowShowing" ? nowShowingMovies : comingSoonMovies;
  }, [activeTab, nowShowingMovies, comingSoonMovies]);

  // Extract unique years and genres - only recalculates when moviesForCurrentTab changes
  const { uniqueYears, uniqueGenres } = useMemo(() => {
    if (!moviesForCurrentTab.length) {
      return { uniqueYears: [], uniqueGenres: [] };
    }
    
    // Extract unique years
    const years = [...new Set(moviesForCurrentTab.map(movie => movie.year))]
      .filter(Boolean)
      .sort((a, b) => b - a);
    
    // Extract unique genres
    const genres = [];
    moviesForCurrentTab.forEach(movie => {
      if (movie.MovieGenres) {
        movie.MovieGenres.forEach(mg => {
          if (mg.Genre && !genres.some(g => g.id === mg.Genre.id)) {
            genres.push({ id: mg.Genre.id, name: mg.Genre.name });
          }
        });
      }
    });
    
    return { uniqueYears: years, uniqueGenres: genres };
  }, [moviesForCurrentTab]);
  
  // Apply additional filtering - recalculates when any filter or source data changes
  const filteredMovies = useMemo(() => {
    return filterMoviesBySearchCriteria(moviesForCurrentTab, {
      searchTitle,
      filterYear,
      filterGenre
    });
  }, [moviesForCurrentTab, searchTitle, filterYear, filterGenre]);
  
  // Reset bộ lọc
  const handleReset = () => {
    setSearchTitle("");
    setFilterYear("");
    setFilterGenre("");
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải danh sách phim</h3>
            <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Tải lại
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="font-[sans-serif] p-4 mx-auto">
            {/* Tab Navigation */}
            <div className="flex items-center justify-center border-b border-gray-200 mb-6">
              <div className="flex items-center mr-12">
                <div className="w-1 h-8 bg-yellow-500 mr-3"></div>
                <h2 className="text-xl font-bold text-yellow-500 uppercase">
                  Danh sách phim
                </h2>
              </div>
              
              <div className="flex">
                <button
                  onClick={() => setActiveTab("nowShowing")}
                  className={`py-2 px-4 font-medium text-lg ${
                    activeTab === "nowShowing" 
                      ? "text-yellow-500 border-b-2 border-yellow-500" 
                      : "text-gray-400"
                  }`}
                >
                  Đang chiếu
                </button>
                <button
                  onClick={() => setActiveTab("comingSoon")}
                  className={`py-2 px-4 font-medium text-lg ${
                    activeTab === "comingSoon" 
                      ? "text-yellow-500 border-b-2 border-yellow-500" 
                      : "text-gray-400"
                  }`}
                >
                  Sắp chiếu
                </button>
              </div>
            </div>
            
            {/* Bộ lọc phim */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap gap-4 mb-4">
                {/* Tìm kiếm theo tên */}
                <div className="flex-grow md:flex-grow-0 md:w-60">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm phim..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Lọc theo năm */}
                <div className="w-40">
                  <select
                    className="w-full py-2 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none bg-white"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  >
                    <option value="">Năm phát hành</option>
                    {uniqueYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                {/* Lọc theo thể loại */}
                <div className="w-40">
                  <select
                    className="w-full py-2 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none bg-white"
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                  >
                    <option value="">Thể loại</option>
                    {uniqueGenres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Nút đặt lại */}
                {(searchTitle || filterYear || filterGenre) && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Đặt lại
                  </button>
                )}
              </div>
              
              {/* Thông tin hiển thị */}
              <div className="text-sm text-gray-500">
                Hiển thị <span className="font-semibold text-yellow-500">{filteredMovies.length}</span> trên <span className="font-semibold">{activeTab === "nowShowing" ? nowShowingMovies.length : comingSoonMovies.length}</span> phim
                {(searchTitle || filterYear || filterGenre) && <span className="text-yellow-500 ml-1">(đã lọc)</span>}
              </div>
            </div>
            
            {/* Danh sách phim */}
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
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy phim</h3>
                <p className="text-gray-500 mb-4">Không có phim nào phù hợp với bộ lọc bạn đã chọn.</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
