import { Link } from "react-router-dom";

export default function HomeItemMovie({ title, year, imageSrc, id, genres = [] }) {
  // Get the primary genre or default text
  const primaryGenre = genres && genres.length > 0 ? genres[0].name : "";
  
  return (
    <Link to={`/detail/${id}`} className="block transform transition duration-300 hover:-translate-y-2">
      <div className="relative h-full bg-gradient-to-br from-black/60 to-gray-800/60 rounded-xl overflow-hidden">

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
          <img
            src={imageSrc}
            alt={title}
            className="aspect-[3/4] w-full object-cover"
          />
          
          {/* Rating badge */}
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-yellow-400 text-xs font-bold text-gray-900 px-2 py-1 rounded-md">
              8.5
            </div>
          </div>
          
          {/* Genre badge */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
            {genres && genres.length > 0 ? (
              genres.map((genre, index) => (
                <div 
                  key={index}
                  className="bg-purple-600 text-xs font-bold text-white px-2 py-1 rounded-md"
                >
                  {genre.name}
                </div>
              ))
            ) : (
              <div className="bg-purple-600 text-xs font-bold text-white px-2 py-1 rounded-md">
                Chưa phân loại
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white">
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">{year}</span>
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">HD</span>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between items-center mt-3">
            <button 
              className="text-xs bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full transition"
              title="Add to wishlist"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Wishlist
              </span>
            </button>
            <button 
              className="text-xs bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full transition"
              title="Watch trailer"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Trailer
              </span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}