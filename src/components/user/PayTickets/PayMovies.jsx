export default function PayMovies() {
  return (
    <div className="container mx-auto bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-500">
      <div className="flex flex-col md:flex-row items-center mb-4">
        <img 
          src="https://cdn.galaxycine.vn/media/2024/12/19/kvh-500_1734592971665.jpg" 
          alt="Banner Phim" 
          className="w-full md:w-1/2 h-48 object-cover rounded-lg mr-4" 
        />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">404 - Chạy Ngay Đi</h2>
          <p className="text-gray-600">2D Lồng Tiếng - T16</p>
          <p className="text-gray-600">Giờ chiếu: 10:00 - Thứ Năm, 03/01/2025</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-800">Rạp: <span className="font-semibold">Galaxy Nguyễn Du - RAP 2</span></p>
        <p className="text-gray-800">Ghế: <span className="font-semibold">M17</span></p>
        <p className="text-gray-800">Giá: <span className="font-semibold">85.000 đ</span></p>
      </div>
      <div className="mt-6">
        <p className="text-xl font-bold">Tổng cộng: <span className="text-red-600">85.000 đ</span></p>
      </div>
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <button className="w-full md:w-1/2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Quay lại</button>
        <button className="w-full md:w-1/2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Tiếp tục</button>
      </div>
    </div>
  );
}