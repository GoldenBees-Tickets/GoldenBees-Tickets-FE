import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useGetPostsQuery } from '@/api/postApi';
import { Link } from 'react-router-dom';

// Styles để đảm bảo hiển thị nội dung
const forceVisibleStyles = {
    display: 'block !important',
    visibility: 'visible !important',
    opacity: '1 !important',
    height: 'auto !important',
    overflow: 'visible !important'
};

export default function HomeBlog() {
    const { data: postsData, isLoading, error, refetch } = useGetPostsQuery({}, {
        refetchOnMountOrArgChange: true,
    });
    
    // Hàm trích xuất URL ảnh đầu tiên từ nội dung HTML
    const extractFirstImageUrl = (htmlContent) => {
        if (!htmlContent) return null;
        
        const imgRegex = /<img.*?src="(.*?)".*?>/i;
        const match = htmlContent.match(imgRegex);
        
        return match ? match[1] : null;
    };
    
    // Sử dụng useMemo để tránh re-render không cần thiết
    const posts = useMemo(() => {
        if (!postsData || !postsData.posts) return [];
        
        // Thêm trường firstImageUrl cho mỗi bài viết
        return postsData.posts.map(post => ({
            ...post,
            firstImageUrl: extractFirstImageUrl(post.content)
        }));
    }, [postsData]);
    
    // Tách bài viết nổi bật (featured) và các bài viết phụ (sidebar)
    const featuredPost = useMemo(() => posts[0] || null, [posts]);
    const sidebarPosts = useMemo(() => posts.slice(1) || [], [posts]);
    
    const headerRef = useRef(null);
    const featuredRef = useRef(null);
    const sidebarRef = useRef(null);
    const buttonRef = useRef(null);
    
    const headerInView = useInView(headerRef, { once: true, amount: 0.1 });

    // Rendering component ngay cả khi đang loading hoặc có lỗi
    return (
        <div 
            className="blog-container container mx-auto px-4 py-8 bg-white rounded-xl my-8 relative"
            style={{
                ...forceVisibleStyles,
                position: 'relative',
                minHeight: '300px',
            }}
        >
            
            {/* Header with tabs - luôn hiển thị */}
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
                            Bài viết mới nhất
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Nội dung */}
            {isLoading && (
                <div className="py-6 flex justify-center items-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-yellow-600 font-medium">Đang tải bài viết...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="py-6 flex justify-center items-center">
                    <div className="bg-red-50 px-6 py-4 rounded-lg border border-red-200 text-center">
                        <p className="text-red-600 font-medium mb-3">Có lỗi xảy ra khi tải dữ liệu</p>
                        <button 
                            onClick={() => refetch()} 
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {!isLoading && !error && posts.length === 0 && (
                <div className="py-6 flex justify-center items-center">
                    <div className="bg-yellow-50 px-6 py-4 rounded-lg border border-yellow-200 text-center max-w-md">
                        <p className="text-yellow-600 font-medium mb-2">Chưa có bài viết nào</p>
                        <p className="text-gray-500 text-sm">Các bài viết mới nhất sẽ xuất hiện tại đây.</p>
                    </div>
                </div>
            )}

            {/* Nội dung bài viết - Forced display khi có dữ liệu */}
            {!isLoading && !error && posts.length > 0 && (
                <div className="blog-content" style={forceVisibleStyles}>
                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={forceVisibleStyles}>
                        {/* Featured post (larger) */}
                        {featuredPost && (
                            <motion.div 
                                ref={featuredRef}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="lg:col-span-2"
                                style={forceVisibleStyles}
                            >
                                <div className="group cursor-pointer" style={forceVisibleStyles}>
                                    <div className="relative rounded-lg overflow-hidden" style={forceVisibleStyles}>
                                        <Link to={`/blog/${featuredPost.id}`}>
                                            <img 
                                                src={featuredPost.firstImageUrl || featuredPost.thumbnail || "https://www.galaxycine.vn/media/2025/4/17/1135-1_1744861010442.jpg"} 
                                                alt={featuredPost.title} 
                                                className="w-full h-[320px] object-cover"
                                                style={{display: 'block', visibility: 'visible'}}
                                            />
                                        </Link>
                                    </div>
                                    <Link to={`/blog/${featuredPost.id}`}>
                                        <h3 className="mt-4 text-xl font-bold text-gray-800 hover:text-yellow-600">
                                            {featuredPost.title}
                                        </h3>
                                    </Link>
                                    <p className="mt-2 text-gray-600 line-clamp-2">
                                        <span className="text-sm">{featuredPost.author} • {new Date(featuredPost.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Sidebar posts (smaller) */}
                        <motion.div 
                            ref={sidebarRef}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="lg:col-span-1 space-y-6"
                            style={forceVisibleStyles}
                        >
                            {/* Render sidebar posts dynamically */}
                            {sidebarPosts.map((post, index) => (
                                <motion.div 
                                    key={post.id || index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                                    className="flex space-x-4 cursor-pointer"
                                    style={forceVisibleStyles}
                                >
                                    <div className="flex-shrink-0" style={forceVisibleStyles}>
                                        <Link to={`/blog/${post.id}`}>
                                            <img 
                                                src={post.firstImageUrl || post.thumbnail || "https://www.galaxycine.vn/media/2025/3/15/750_1741976301316.jpg"} 
                                                alt={post.title} 
                                                className="w-[170px] h-[100px] object-cover rounded-lg"
                                                style={{display: 'block', visibility: 'visible'}}
                                            />
                                        </Link>
                                    </div>
                                    <div className="flex-1" style={forceVisibleStyles}>
                                        <Link to={`/blog/${post.id}`}>
                                            <h3 className="font-bold text-gray-800 hover:text-yellow-600 text-sm leading-tight">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <p className="mt-1 text-gray-500 text-xs">
                                            {post.author} • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Hiển thị thông báo nếu không có đủ bài viết phụ */}
                            {sidebarPosts.length === 0 && (
                                <div className="text-gray-500 text-center py-4">
                                    Không có bài viết nào
                                </div>
                            )}
                        </motion.div>
                    </div>
                    
                    {/* View more button */}
                    <Link to="/blog">
                        <motion.div 
                            ref={buttonRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="text-center mt-8"
                            style={forceVisibleStyles}
                        >
                            <button className="px-6 py-2 border border-yellow-500 text-yellow-600 font-medium rounded-lg hover:bg-yellow-50 transition-colors duration-300">
                                Xem thêm <span className="ml-1">›</span>
                            </button>
                        </motion.div>
                    </Link>
                </div>
            )}
        </div>
    );
}
