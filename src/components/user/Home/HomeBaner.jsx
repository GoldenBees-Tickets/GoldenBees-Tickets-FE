import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function HomeBanner() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const contentInView = useInView(contentRef, { once: true, amount: 0.3 });
  const imageInView = useInView(imageRef, { once: true, amount: 0.3 });

  return (
    <section className="relative bg-white overflow-hidden py-12">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-gray-50 to-white"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-yellow-100"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute top-40 left-10 w-20 h-20 rounded-full bg-blue-50"
          animate={{ 
            x: [0, 10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-gray-50"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
      </motion.div>

      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 md:py-16">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Content Section with Animation */}
          <motion.div 
            ref={contentRef}
            className="max-w-[720px] text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              className="inline-block px-4 py-1 mb-6 text-sm font-medium tracking-wider text-yellow-600 uppercase border border-yellow-200 rounded-full bg-yellow-50"
              initial={{ opacity: 0, y: -20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Khám phá ngay
            </motion.span>
            <motion.h1 
              className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl"
              initial={{ opacity: 0 }}
              animate={contentInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Phim điện ảnh <motion.span 
                className="text-yellow-500"
                animate={{ 
                  textShadow: ["0px 0px 0px rgba(245, 158, 11, 0)", "0px 0px 8px rgba(245, 158, 11, 0.3)", "0px 0px 0px rgba(245, 158, 11, 0)"],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >mới nhất</motion.span>
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg text-gray-600 md:text-xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={contentInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Hãy đắm mình vào trải nghiệm điện ảnh khó quên với những bộ phim bom tấn mới nhất. Đặt vé ngay!
            </motion.p>
            <motion.div 
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.a
                href="#"
                className="inline-block rounded-full bg-yellow-500 px-8 py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-200 transform hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Đặt ngay
              </motion.a>
              <motion.a
                href="#"
                className="group flex items-center gap-3 rounded-full border border-gray-200 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-yellow-200 hover:bg-yellow-50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 group-hover:bg-yellow-100"
                  whileHover={{ rotate: 5 }}
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.752 11.168l-4.196-2.64A1 1 0 009 9.415v5.17a1 1 0 001.556.847l4.196-2.639a1 1 0 000-1.695z"
                    />
                  </svg>
                </motion.span>
                <span className="group-hover:text-yellow-600">Xem Lịch chiếu</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Image Section with Animation */}
          <motion.div 
            ref={imageRef}
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={imageInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-yellow-100 to-blue-50 blur-lg opacity-70"
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
            ></motion.div>
            <motion.div 
              className="relative mx-auto h-full max-w-[600px] overflow-hidden rounded-3xl shadow-xl border border-gray-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img
                src="https://www.galaxycine.vn/media/2024/6/24/despicable-me-4-chung-ta-biet-duoc-bao-nhieu-ve-minions-3_1719218662477.jpg"
                alt="Movie Screening"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white/90 to-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={imageInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <motion.span 
                    className="inline-block px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full"
                    animate={{ 
                      scale: [1, 1.08, 1],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    HOT
                  </motion.span>
                  <span className="text-gray-800 text-sm font-medium">Đang chiếu</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-2">Despicable Me 4</h3>
              </motion.div>
            </motion.div>
            
            {/* Decorative elements with animation */}
            <motion.div 
              className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-yellow-200"
              animate={{ 
                y: [0, 5, 0],
                x: [0, 3, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-4 right-20 w-8 h-8 rounded-full bg-blue-100"
              animate={{ 
                y: [0, -5, 0],
                x: [0, -3, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            ></motion.div>
            
            {/* Rating stars with animation */}
            <motion.div 
              className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-1 shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={imageInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0, repeat: Infinity, repeatDelay: 3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.2, repeat: Infinity, repeatDelay: 3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.4, repeat: Infinity, repeatDelay: 3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.6, repeat: Infinity, repeatDelay: 3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-300">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-800 ml-1">4.0</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
