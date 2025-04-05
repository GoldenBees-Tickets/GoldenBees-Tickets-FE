import { useGetMoviesQuery } from "../../../api/movieApi";
import HomeItemMovie from "./HomeItemMovie";
import { useState } from "react";


export default function HomeItem() {
  const [activeTab, setActiveTab] = useState("nowShowing"); // "nowShowing" or "comingSoon"
  const { data: List } = useGetMoviesQuery();
  let ListMovie = List?.movies;
  

  const nowShowingMovies = ListMovie || [];
  const comingSoonMovies = ListMovie || [];
  
  // Display movies based on active tab
  const moviesToDisplay = activeTab === "nowShowing" ? nowShowingMovies : comingSoonMovies;
  
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
            imageSrc={movie.poster}
            id={movie.id}
            genres={movie.MovieGenres?.map(mg => ({ id: mg.Genre?.id, name: mg.Genre?.name }))}
          />
        ))}
      </div>
    </div>
  );
}
