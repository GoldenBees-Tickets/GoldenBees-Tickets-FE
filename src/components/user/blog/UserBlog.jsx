'use client';

import { useState } from 'react';


export default function Example() {
  const [agreed, setAgreed] = useState(false);

  return (
  <div className="bg-white font-sans">
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-lg-full">Các Bài Viết Khác</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-lg:max-w-3xl max-md:max-w-md mx-auto">
          <div className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img src="./blog/prd4.jpg" alt="Blog Post 1" className="w-full h-96 object-cover" />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-pink-200 opacity-90">
              <span className="text-sm block text-gray-800 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Despicable Me 4: Chúng Ta Biết Được Bao Nhiêu Về Minions?</h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-800 text-sm">13 sự thật về Minions để người yêu những trái chuối vàng “ôn bài” trước giờ ra rạp!</p>
              </div>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img src="./blog/prd5.jpg" alt="Blog Post 2" className="w-full h-96 object-cover" />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-pink-200 opacity-90">
              <span className="text-sm block text-gray-800 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Venom 3: Venom Sẽ Chết?</h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-800 text-sm">Venom và Eddie Brock lâm nguy ở The Last Dance!</p>
              </div>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img src="./blog/prd6.jpg" alt="Blog Post 3" className="w-full h-96 object-cover" />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-pink-200 opacity-90">
              <span className="text-sm block text-gray-800 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Bóc Tách Trailer Deadpool & Wolverine: Phản Diện Là Em Gái Giáo Sư X?</h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-800 text-sm">Nhân vật cực kì quan trọng – phần còn lại của tựa đề Deadpool 3: Wolverine đã xuất hiện!</p>
              </div>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img src="./blog/prd7.jpg" alt="Blog Post 3" className="w-full h-96 object-cover" />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-pink-200 opacity-90">
              <span className="text-sm block text-gray-800 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Joker 2: Harley Quinn Thay Đổi Hoàn Toàn So Với Comic?</h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-800 text-sm">Lady Gaga áp dụng lối method acting vốn gắn liền với tên tuổi Joaquin Phoenix để thể hiện Harley Quinn!</p>
              </div>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img src="./blog/prd8.jpg" alt="Blog Post 3" className="w-full h-96 object-cover" />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-pink-200 opacity-90">
              <span className="text-sm block text-gray-800 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Top 10 Phim Kinh Dị Hay Nhất 2024</h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-800 text-sm">Những tác phẩm kinh dị được mong chờ nhất năm 2024 đã  sẵn sàng gieo rắc “kinh hoàng” đến phòng vé toàn cầu.</p>
              </div>
            </div>
          </div>
          <div className="bg-white cursor-pointer rounded-lg overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative group">
            <img src="./blog/prd9.jpg" alt="Blog Post 3" className="w-full h-96 object-cover" />
            <div className="p-6 absolute bottom-0 left-0 right-0 bg-pink-200 opacity-90">
              <span className="text-sm block text-gray-800 mb-2">31 DEC 2024 | BY DAN TOFAN</span>
              <h3 className="text-xl font-bold text-gray-800">Thám Tử Lừng Danh Conan – Ngôi Sao Năm Cánh Triệu Đô: KID X Conan</h3>
              <div className="h-0 overflow-hidden group-hover:h-16 group-hover:mt-4 transition-all duration-300">
                <p className="text-gray-800 text-sm">Phần phim mới xuất hiện của một trong những gương mặt đông fan nhất bộ truyện: Kaitou KID</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
