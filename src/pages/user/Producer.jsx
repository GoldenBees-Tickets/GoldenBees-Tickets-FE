import { useParams, Link } from 'react-router-dom';
import { useGetProducerByIdQuery } from '../../api/producerApi';
import { formatImage } from '@/utils/formatImage';
import { FaBuilding, FaInfo } from 'react-icons/fa';

export default function Producer() {
  const { id } = useParams();
  const { data: producerData, error, isLoading } = useGetProducerByIdQuery(id);
  
  // Giải nén dữ liệu nhà sản xuất từ API
  const producer = producerData?.producer;

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-500 text-2xl mb-4">Không thể tải thông tin nhà sản xuất</div>
      <Link to="/" className="text-orange-500 hover:underline">Quay lại trang chủ</Link>
    </div>
  );

  if (!producer) return (
    <div className="text-center py-12">
      <div className="text-gray-700 text-2xl mb-4">Không tìm thấy nhà sản xuất</div>
      <Link to="/" className="text-orange-500 hover:underline">Quay lại trang chủ</Link>
    </div>
  );

  const { name, bio, profile_picture } = producer;

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
        
        {/* Producer Profile */}
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
                  <FaBuilding className="mr-1" /> Nhà sản xuất
                </span>
              </div>
            </div>

            <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaInfo className="text-orange-500 mr-2" /> Giới thiệu
                </h3>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaBuilding className="text-orange-500 mr-2" /> Về nhà sản xuất
            <div className="ml-3 h-1 w-20 bg-orange-500 rounded"></div>
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
