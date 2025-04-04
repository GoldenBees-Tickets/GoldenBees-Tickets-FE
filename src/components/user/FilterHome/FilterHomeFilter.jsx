export default function FilterHomeFilter() {
    return (
      <div className="max-w-screen-lg mx-1 mt-10 px-4">
      
  
        <div className="flex flex-wrap justify-between gap-4">
          {/* Thể loại */}
          <div className="w-full sm:w-1/2 md:w-1/5">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base" htmlFor="category">
              Thể loại
            </label>
            <select
              id="category"
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <option value="action">Hành động</option>
              <option value="comedy">Hài hước</option>
              <option value="drama">Tâm lý</option>
              <option value="horror">Kinh dị</option>
              <option value="romance">Lãng mạn</option>
            </select>
          </div>
  
          {/* Quốc gia */}
          <div className="w-full sm:w-1/2 md:w-1/5">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base" htmlFor="country">
              Quốc gia
            </label>
            <select
              id="country"
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <option value="usa">Mỹ</option>
              <option value="uk">Anh</option>
              <option value="india">Ấn Độ</option>
              <option value="japan">Nhật Bản</option>
              <option value="france">Pháp</option>
            </select>
          </div>
  
          {/* Năm */}
          <div className="w-full sm:w-1/2 md:w-1/5">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base" htmlFor="year">
              Năm
            </label>
            <select
              id="year"
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
  
          {/* Đang chiếu */}
          <div className="w-full sm:w-1/2 md:w-1/5">
            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base" htmlFor="nowShowing">
              Đang chiếu
            </label>
            <select
              id="nowShowing"
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              <option value="yes">Có</option>
              <option value="no">Không</option>
            </select>
          </div>
  
          {/* Xem nhiều nhất */}
        
        </div>
      </div>
    );
  }
  