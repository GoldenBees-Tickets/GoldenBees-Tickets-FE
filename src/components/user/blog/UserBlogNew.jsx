'use client';

import { useState } from 'react';


export default function Example() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div><ul className="bg-white rounded-full py-2 px-4 -space-x-4 w-max flex items-center mx-auto font-[sans-serif] mt-4">
    <li className="bg-white text-purple-600 rounded-full z-40 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.3)] px-8 py-3 text-sm font-bold cursor-pointer">
      Trang Chủ
    </li>
    <li className="bg-purple-600 text-white rounded-r-full z-10 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.3)] px-8 py-3 text-sm font-bold cursor-pointer">
      Blog Điện Ảnh
    </li>
  </ul>
  <div className="bg-white font-[sans-serif] my-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">Các Bài Viết Mới</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-lg:max-w-3xl max-md:max-w-md mx-auto">
          <div className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300">
            <img src="./blog/prd1.jpg" alt="Blog Post 1" className="w-full h-60 object-cover" />
            <div className="p-6">
              <span className="text-sm block text-gray-400 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Chuyện Gì Đã Xảy Ra Trong Linh Miêu: Quỷ Nhập Tràng?</h3>
              <hr className="my-4" />
              <p className="text-gray-400 text-sm">Linh Miêu: Quỷ Nhập Tràng được đào sâu vào nhiều tầng lớp và mức độ rùng rợn cũng sẽ tăng nhiều, để từ đó có thể làm rõ hơn về vấn đề trọng nam khinh nữ thời xưa.</p>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300">
            <img src="./blog/prd2.jpg" alt="Blog Post 2" className="w-full h-60 object-cover" />
            <div className="p-6">
              <span className="text-sm block text-gray-400 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Mufasa: The Lion King Tiết Lộ Hành Trình Mufasa Trở Thành Vua Sư Tử Vĩ Đại</h3>
              <hr className="my-4" />
              <p className="text-gray-400 text-sm">Mặc cho việc gây nhiều tranh cãi khi kém cạnh hơn so với bản gốc năm 1994, bản remake vẫn thu về tới hơn 1,6 tỉ USD và được coi là một bước tiến đáng kinh ngạc trong đồ họa 3D với một đề cử Kỹ xảo xuất sắc nhất tại Oscar thứ 92.</p>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300">
            <img src="./blog/prd3.jpg" alt="Blog Post 3" className="w-full h-60 object-cover" />
            <div className="p-6">
              <span className="text-sm block text-gray-400 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Đếm 500 Cameo Từ Deadpool & Wolverine</h3>
              <hr className="my-4" />
              <p className="text-gray-400 text-sm">Là canh bạc lớn Marvel Studios đối phó cơn thoái trào dòng phim siêu anh hùng, Deadpool & Wolverine tung ra hàng loạt chiêu bài lôi kéo khán giả.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
