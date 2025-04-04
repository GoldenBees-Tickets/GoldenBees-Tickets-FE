export default function FilterHomeItem() {
  return (
    <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      {/* Bên trái - Banner */}
      <div className="w-full sm:w-1/2">
        <img
          src="http://localhost:5173/product/mv2.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bên phải - Thông tin phim */}
      <div className="w-full sm:w-1/1.5 p-6">
        {/* Tên phim */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Thợ săn thành phố
        </h3>

        {/* Chứa cả nút "Xem chi tiết" và biểu tượng mắt */}
        <div className="flex space-x-4 mb-4">
          {/* Nút "Xem chi tiết" */}
          <div className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
            <span className="mr-2">🔗</span>
            <a href="#" className="text-white hover:text-white font-semibold">
              Xem chi tiết
            </a>
          </div>

          {/* Biểu tượng mắt và số lượt xem */}
          <div className="flex items-center bg-gray-100 py-2 px-4 rounded-lg">
            <span className="mr-2 text-xl">👁️</span>
            <span className="text-sm">12345 lượt xem</span>
          </div>
        </div>

        {/* Giới thiệu chi tiết về phim */}
        <div className="text-gray-600">
          <h4 className="font-semibold text-lg mb-2">Giới thiệu:</h4>
          <p>
            Đây là phần giới thiệu chi tiết về phim. Phim kể về hành trình của
            một nhóm người vượt qua thử thách lớn lao để đạt được mục tiêu. Họ
            đối mặt với những khó khăn khắc nghiệt, nhưng bằng sức mạnh tình bạn
            và lòng kiên trì, họ đã chiến thắng mọi trở ngại.
          </p>
        </div>
      </div>
    </div>
  );
}
