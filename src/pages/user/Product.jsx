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

  return (
    <div className="font-[sans-serif] p-4 mx-auto max-w-[1400px]">
      <h2
        className="text-xl sm:text-3xl font-extrabold text-gray-800 mb-6 sm:mb-8 text-center 
                  transition-transform transform hover:scale-110 duration-300"
      >
        Phim
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên phim</label>
            <input
              type="text"
              placeholder="Tìm theo tên phim"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">Tất cả các năm</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">Tất cả thể loại</option>
              {uniqueGenres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-600">
        Hiển thị {filteredMovies.length} phim {filteredMovies.length < ListMovie.length ? "(có áp dụng bộ lọc)" : ""}
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
