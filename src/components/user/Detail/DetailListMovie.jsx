export default function DetailListMovie() {
  return (
    <div className="space-y-5">
      <div className="group cursor-pointer overflow-hidden rounded-lg">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <img 
            src="https://img.youtube.com/vi/lHuGo6u_upY/maxresdefault.jpg" 
            alt="Movie thumbnail"
            className="w-full h-auto rounded-lg transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">Nhà Bà Nữ - Trailer Chính Thức</h3>
      </div>

      <div className="group cursor-pointer overflow-hidden rounded-lg">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <img 
            src="https://img.youtube.com/vi/8hTji6rJ1BQ/maxresdefault.jpg" 
            alt="Movie thumbnail"
            className="w-full h-auto rounded-lg transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">Mai - Official Trailer</h3>
      </div>

      <div className="group cursor-pointer overflow-hidden rounded-lg">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <img 
            src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
            alt="Movie thumbnail"
            className="w-full h-auto rounded-lg transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">Phim Mới - Trailer HOT</h3>
      </div>
    </div>
  );
}
  