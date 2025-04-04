import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function HomeBlog() {
  const headerRef = useRef(null);
  const featuredRef = useRef(null);
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);
  
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.3 });
  const sidebarInView = useInView(sidebarRef, { once: true, amount: 0.3 });
  const buttonInView = useInView(buttonRef, { once: true, amount: 0.5 });

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      {/* Header with tabs */}
      <motion.div 
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="border-b border-yellow-200 mb-6"
      >
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-yellow-800 mr-6">GÓC ĐIỆN ẢNH</h2>
          <div className="flex">
            <button
              className="px-4 py-2 border-b-2 border-yellow-500 text-yellow-600 font-medium"
            >
              Bình luận phim
            </button>
            <button
              className="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-yellow-700 font-medium"
            >
              Blog điện ảnh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured post (larger) */}
        <motion.div 
          ref={featuredRef}
          initial={{ opacity: 0, x: -50 }}
          animate={featuredInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="group cursor-pointer">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src="./blog/blog1.jpg" 
                alt="Ấm Dương Lộ" 
                className="w-full h-[320px] object-cover"
              />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-800 hover:text-yellow-600">
              [Review] Ấm Dương Lộ: Tôn Vinh Tài Xế Xe Cứu Thương Thông Qua Truyện Thuyết Đô Thị
            </h3>
            <div className="mt-3 flex items-center space-x-4">
              <button className="flex items-center bg-yellow-500 text-white text-xs rounded px-3 py-1">
                <span>Thích</span>
              </button>
              <div className="flex items-center text-gray-500 text-sm">
                <span>55</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar posts (smaller) */}
        <motion.div 
          ref={sidebarRef}
          initial={{ opacity: 0, x: 50 }}
          animate={sidebarInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Blog post 1 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={sidebarInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex space-x-4 cursor-pointer"
          >
            <div className="flex-shrink-0">
              <img 
                src="https://www.galaxycine.vn/media/2025/3/15/750_1741976301316.jpg" 
                alt="Snow White" 
                className="w-[170px] h-[100px] object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 hover:text-yellow-600 text-sm leading-tight">
                [Review] Snow White: Disney Viết Lại Cổ Tích Theo Cách Hợp Lí Hơn?
              </h3>
              <div className="mt-2 flex items-center space-x-4">
                <button className="flex items-center bg-yellow-500 text-white text-xs rounded px-3 py-1">
                  <span>Thích</span>
                </button>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>243</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Blog post 2 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={sidebarInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex space-x-4 cursor-pointer"
          >
            <div className="flex-shrink-0">
              <img 
                src="https://www.galaxycine.vn/media/2025/3/22/snow-white-disney-viet-lai-co-tich-theo-cach-hop-li-hon-5_1742614070970.jpg" 
                alt="Mickey 17" 
                className="w-[170px] h-[100px] object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 hover:text-yellow-600 text-sm leading-tight">
                [Review] Mickey 17: Chấm Biếm Trò Hề Của Tư Bản?
              </h3>
              <div className="mt-2 flex items-center space-x-4">
                <button className="flex items-center bg-yellow-500 text-white text-xs rounded px-3 py-1">
                  <span>Thích</span>
                </button>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>309</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Blog post 3 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={sidebarInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex space-x-4 cursor-pointer"
          >
            <div className="flex-shrink-0">
              <img 
                src="https://www.galaxycine.vn/media/2025/3/12/hitman-2-rv-750_1741767566781.jpg" 
                alt="Hitman 2" 
                className="w-[170px] h-[100px] object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 hover:text-yellow-600 text-sm leading-tight">
                [Review] Hitman 2: Sát Thủ Sang Kwon Sang Woo Tấu Hài Cùng Lee Yi Kyung
              </h3>
              <div className="mt-2 flex items-center space-x-4">
                <button className="flex items-center bg-yellow-500 text-white text-xs rounded px-3 py-1">
                  <span>Thích</span>
                </button>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>181</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* View more button */}
      <motion.div 
        ref={buttonRef}
        initial={{ opacity: 0, y: 20 }}
        animate={buttonInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center mt-8"
      >
        <button className="px-6 py-2 border border-yellow-500 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50 transition-colors duration-300">
          Xem thêm <span className="ml-1">›</span>
        </button>
      </motion.div>
    </div>
  );
}
