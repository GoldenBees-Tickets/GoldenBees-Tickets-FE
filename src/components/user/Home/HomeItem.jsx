import { useGetAllMoviesByUserQuery } from "@/api/movieApi";
import HomeItemMovie from "./HomeItemMovie";
import { useState, useMemo } from "react";
import { formatImage } from "@/utils/formatImage";
import { filterMoviesByStatus } from "@/utils/movieFilters";

export default function HomeItem() {
  const [activeTab, setActiveTab] = useState("nowShowing"); // "nowShowing" or "comingSoon"
  const { data: List } = useGetAllMoviesByUserQuery();
  
  // Process movies only when List changes
  const { nowShowingMovies, comingSoonMovies } = useMemo(() => {
    const ListMovie = List?.data || [];
    return filterMoviesByStatus(ListMovie);
  }, [List]);
  
  // Select which movies to display based on active tab
  const moviesToDisplay = useMemo(() => {
    return activeTab === "nowShowing" ? nowShowingMovies : comingSoonMovies;
  }, [activeTab, nowShowingMovies, comingSoonMovies]);
  
  const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  return (
    <div className="font-[sans-serif] p-4 mx-auto max-w-[1400px]">
      {/* Combined title and tab navigation */}
      <div className="flex items-center justify-center border-b border-gray-200 mb-6">
        {/* Title with vertical line */}
        <div className="flex items-center mr-12">
          <div className="w-1 h-8 bg-yellow-500 mr-3"></div>
          <h2 className="text-xl font-bold text-yellow-500 uppercase">
            Phim
          </h2>
        </div>
        
        {/* Tab Navigation */}
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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {moviesToDisplay?.map((movie) => (
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
