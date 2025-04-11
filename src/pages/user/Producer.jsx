import { useParams, Link } from 'react-router-dom';
import { useGetProducersQuery } from '../../api/producerApi';
import { useGetMoviesQuery } from '../../api/movieApi';
import DetailListMovie from '../../components/User/Detail/DetailListMovie';
import FilterMovie from '../../components/User/Detail/FilterMovie';
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function Producer() {
  const { id } = useParams();
  const { data: producersList, error, isLoading } = useGetProducersQuery();
  const { data: moviesList } = useGetMoviesQuery();

  const producer = producersList?.producers?.find((producer) => producer.id === parseInt(id, 10));
  const movies = moviesList?.movies || [];
  
  // Filter movies produced by this producer
  const producedMovies = movies.filter(movie => 
    movie.producers && movie.producers.some(p => p.id === parseInt(id, 10))
  );

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-500 text-2xl mb-4">Error loading producer details</div>
      <Link to="/" className="text-orange-500 hover:underline">Return to home page</Link>
    </div>
  );

  if (!producer) return (
    <div className="text-center py-12">
      <div className="text-gray-700 text-2xl mb-4">Producer not found</div>
      <Link to="/" className="text-orange-500 hover:underline">Return to home page</Link>
    </div>
  );

  const { name, bio, profile_picture } = producer;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Home link */}
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-gray-700 hover:text-orange-500 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Trang chủ
          </Link>
        </div>
        
        {/* Producer Profile */}
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
                  Nhà sản xuất
                </span>
              </div>
            </div>
            
            <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Giới thiệu</h3>
                <div className="prose max-w-none text-gray-700">
                  {bio ? (
                    <p>{bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">Chưa có thông tin giới thiệu.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Section - if applicable */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Về nhà sản xuất
            <div className="mt-2 h-1 w-20 bg-orange-500 rounded"></div>
          </h2>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="prose max-w-none text-gray-700">
              <p>
                {bio ? 
                  `${name} là nhà sản xuất với nhiều đóng góp cho nền điện ảnh. Với tầm nhìn chiến lược và khả năng kết nối các tài năng, ${name} đã góp phần tạo nên những tác phẩm điện ảnh có giá trị nghệ thuật và thương mại cao.` : 
                  `Chưa có thông tin chi tiết về nhà sản xuất ${name}.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
