import { useParams, Link } from 'react-router-dom';
import { useGetDirectorByIdQuery } from "../../api/directorApi";
import { formatImage } from '@/utils/formatImage';
import { FaVideo, FaUserTie, FaInfo } from 'react-icons/fa';

export default function Director() {
  const { id } = useParams(); 
  const { data: directorData, error, isLoading } = useGetDirectorByIdQuery(id);
  
  // Giải nén dữ liệu đạo diễn từ API
  const director = directorData?.director;

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-500 text-2xl mb-4">Không thể tải thông tin đạo diễn</div>
      <Link to="/" className="text-orange-500 hover:underline">Quay lại trang chủ</Link>
    </div>
  );

  if (!director) return (
    <div className="text-center py-12">
      <div className="text-gray-700 text-2xl mb-4">Không tìm thấy đạo diễn</div>
      <Link to="/" className="text-orange-500 hover:underline">Quay lại trang chủ</Link>
    </div>
  );

  const { name, dob, bio, gender, profile_picture } = director;

  // Format date for better display
  const formattedDob = dob ? new Date(dob).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Không có thông tin';

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-orange-600">Trang chủ</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
              <Link to="/movies" className="ml-2 text-gray-500 hover:text-orange-600">Phim</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
              <span className="ml-2 text-gray-700 font-medium">{name}</span>
            </li>
          </ol>
        </nav>
        
        {/* Director Profile */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="md:flex">
            <div className="md:w-1/3 lg:w-1/4 p-6 flex flex-col items-center">
              <div className="w-48 h-48 md:w-full md:h-72 lg:h-96 rounded-xl overflow-hidden shadow-lg mb-4">
                <img
                  src={formatImage(profile_picture)}
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
                  <FaUserTie className="mr-1" /> Đạo diễn
                </span>
              </div>
            </div>
            
            <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
              
              {dob && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Ngày sinh</h3>
                      <p className="mt-1 text-lg text-gray-900">{formattedDob}</p>
                    </div>
                  </div>
                  
                  {gender && (
                    <div className="flex items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Giới tính</h3>
                        <p className="mt-1 text-lg text-gray-900">{gender === 'Female' ? 'Nữ' : 'Nam'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaInfo className="text-orange-500 mr-2" /> Tiểu sử
                </h3>
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
