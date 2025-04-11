import { useParams, Link } from 'react-router-dom';
import { useGetDirectorsQuery } from "../../api/directorApi";
import { useGetMoviesQuery } from '../../api/movieApi';
import DetailListMovie from "../../components/User/Detail/DetailListMovie";
import FilterMovie from "../../components/User/Detail/FilterMovie";
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function Director() {
  const { id } = useParams(); 
  const { data: directorsList, error, isLoading } = useGetDirectorsQuery(); 
  const { data: moviesList } = useGetMoviesQuery();

  const director = directorsList?.directors?.find((director) => director.id === parseInt(id, 10));
  const movies = moviesList?.movies || [];
  
  // Filter movies directed by this director
  const directedMovies = movies.filter(movie => 
    movie.directors && movie.directors.some(d => d.id === parseInt(id, 10))
  );

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-500 text-2xl mb-4">Error loading director details</div>
      <Link to="/" className="text-orange-500 hover:underline">Return to home page</Link>
    </div>
  );

  if (!director) return (
    <div className="text-center py-12">
      <div className="text-gray-700 text-2xl mb-4">Director not found</div>
      <Link to="/" className="text-orange-500 hover:underline">Return to home page</Link>
    </div>
  );

  const { name, bio, profile_picture } = director;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        
        {/* Director Profile */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="md:flex">
            <div className="md:w-1/3 lg:w-1/4 p-6 flex flex-col items-center">
              <div className="w-48 h-48 md:w-full md:h-72 lg:h-96 rounded-xl overflow-hidden shadow-lg mb-4">
                <img
                  src={`${API_BASE_URL}/${profile_picture}`}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  Đạo diễn
                </span>
              </div>
            </div>
            
            <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiểu sử</h3>
                <div className="prose max-w-none text-gray-700">
                  {bio ? (
                    <p>{bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có thông tin tiểu sử.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
