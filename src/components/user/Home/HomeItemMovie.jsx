import { Link } from "react-router-dom";

export default function HomeItemMovie({ title, year, imageSrc, id, genres = [], rating }) {
  
  return (
    <Link to={`/detail/${id}`} className="block h-full">
      <div className="relative h-full bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
          
          <img
            src={imageSrc}
            alt={title}
            className="aspect-[3/4] w-full object-cover"
            loading="lazy"
          />
          
          {/* Rating badge - smaller on mobile */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
            <div className="bg-yellow-400 text-[10px] sm:text-xs font-bold text-gray-900 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              {rating}
            </div>
          </div>
          
          {/* Genre badge - adaptive for mobile */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 flex flex-wrap gap-1 sm:gap-2 max-w-[70%]">
            {genres && genres.length > 0 ? (
              // Limit to 2 genres on small screens
              genres.slice(0, window.innerWidth < 640 ? 1 : 2).map((genre, index) => (
                <div 
                  key={index}
                  className="bg-orange-500 text-[10px] sm:text-xs font-medium sm:font-bold text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded truncate max-w-full"
                >
                  {genre.name}
                </div>
              ))
            ) : (
              <div className="bg-orange-500 text-[10px] sm:text-xs font-medium sm:font-bold text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                Phim
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white">
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{year}</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">HD</span>
          </div>
        </div>
      </div>
    </Link>
  );
}