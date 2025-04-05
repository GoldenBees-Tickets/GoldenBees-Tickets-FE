import { useGetMoviesQuery } from "../../api/movieApi";
import HomeItemMovie from "@/components/user/Home/HomeItemMovie";
import { useState, useEffect } from "react";
import { formatImage } from "@/utils/formatImage";
export default function Product() {
  const { data: List } = useGetMoviesQuery();
  const [ListMovie, setListMovie] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  useEffect(() => {
    if (List?.movies) {
      setListMovie(List.movies);
      setFilteredMovies(List.movies);
      
      // Extract unique years
      const years = [...new Set(List.movies.map(movie => movie.year))].sort((a, b) => b - a);
      setUniqueYears(years);
      
      // Extract unique genres
      const genres = [];
      List.movies.forEach(movie => {
        movie.MovieGenres?.forEach(mg => {
          if (mg.Genre && !genres.some(g => g.id === mg.Genre.id)) {
            genres.push({ id: mg.Genre.id, name: mg.Genre.name });
          }
        });
      });
      setUniqueGenres(genres);
    }
  }, [List]);

  useEffect(() => {
    filterMovies();
  }, [searchTitle, filterYear, filterGenre, ListMovie]);

  const filterMovies = () => {
    let filtered = [...ListMovie];
    
    // Filter by title
    if (searchTitle) {
      filtered = filtered.filter(movie => 
        movie.name.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    
    // Filter by year
    if (filterYear) {
      filtered = filtered.filter(movie => movie.year === parseInt(filterYear));
    }
    
    // Filter by genre
    if (filterGenre) {
      filtered = filtered.filter(movie => 
        movie.MovieGenres?.some(mg => mg.Genre?.id === parseInt(filterGenre))
      );
    }
    
    setFilteredMovies(filtered);
  };

  const handleReset = () => {
    setSearchTitle("");
    setFilterYear("");
    setFilterGenre("");
  };

  const toggleFilter = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  return (
    <div className="font-[sans-serif] p-4 mx-auto max-w-[1400px]">
      <div className="mb-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Danh sách phim
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tên phim..."
            className="w-full sm:w-48 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-full focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="relative">
          <select
            className="w-full sm:w-40 appearance-none pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-full focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
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
          <svg className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        
        <div className="relative">
          <select
            className="w-full sm:w-40 appearance-none pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-full focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
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
          <svg className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        
        {(searchTitle || filterYear || filterGenre) && (
          <button
            onClick={handleReset}
            className="py-1.5 px-3 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-full flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đặt lại
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span>
            Hiển thị <span className="font-medium text-yellow-600">{filteredMovies.length}</span> phim 
            {filteredMovies.length < ListMovie.length && <span className="text-xs text-orange-500 ml-1">(đã lọc)</span>}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Tổng cộng: {ListMovie.length} phim
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredMovies?.map((movie) => (
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
    </div>
  );
}
