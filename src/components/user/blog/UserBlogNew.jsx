'use client';

import { useState, useEffect } from 'react';
import { useGetPostsQuery } from '../../../api/postApi';
import { Link } from 'react-router-dom';

export default function UserBlogNew() {
  const { data: postsData, isLoading, error } = useGetPostsQuery();
  
  // Lấy tất cả bài viết từ API
  const posts = postsData?.posts || [];
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '31/12/2024';
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };
  
  // Lấy tóm tắt nội dung (không có thẻ HTML)
  const getContentSummary = (post) => {
    if (post.summary) return post.summary;
    if (!post.content) return "";
    
    // Loại bỏ tất cả các thẻ HTML
    const plainText = post.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
    // Lấy 150 ký tự đầu
    return plainText.substring(0, 150).trim() + '...';
  };

  // Trích xuất URL của ảnh đầu tiên từ nội dung HTML
  const extractImageFromContent = (content) => {
    if (!content) return null;
    
    // Tìm URL ảnh đầu tiên trong thẻ img 
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    
    // Trả về URL ảnh nếu tìm thấy
    return match ? match[1] : null;
  };

  // Lấy URL ảnh từ bài viết
  const getPostImage = (post) => {
    // Kiểm tra ID của bài viết để đảm bảo mỗi bài có hình riêng
    const postId = post.id || post._id;
    
    // Ưu tiên sử dụng thumbnail nếu có
    if (post.thumbnail) return post.thumbnail;
    
    // Thử lấy ảnh từ trường image
    if (post.image) return post.image;
    
    // Trích xuất ảnh từ nội dung bài viết
    const contentImage = extractImageFromContent(post.content);
    if (contentImage) return contentImage;
    
    // Nếu không có ảnh trong bài viết, sử dụng ảnh mặc định dựa trên ID bài viết
    // để mỗi bài có ảnh khác nhau
    const defaultImages = [
      "https://img.freepik.com/free-photo/cinema-elements-yellow-background-with-copy-space_23-2148457900.jpg",
      "https://img.freepik.com/premium-photo/movie-accessories-yellow-background-3d-rendering_72104-3591.jpg",
      "https://img.freepik.com/free-photo/movie-composition-yellow-background_23-2148435329.jpg",
      "https://img.freepik.com/free-photo/arrangement-cinema-elements-yellow-background-with-copy-space_23-2148435331.jpg",
      "https://img.freepik.com/free-photo/movie-background-collage_23-2149876028.jpg"
    ];
    
    // Sử dụng postId để chọn ảnh mặc định, đảm bảo mỗi bài viết có ảnh khác nhau
    const index = postId.toString().charCodeAt(postId.toString().length - 1) % defaultImages.length;
    return defaultImages[index];
  };

  return (
    <div className="bg-gray-50">
      {/* Banner Section */}
      <div className="relative">
        <div className="h-64 md:h-80 w-full overflow-hidden">
          <img 
            src="https://img.freepik.com/free-photo/cinematic-background-with-popcorn-bucket-film-strip-clapperboard-yellow-background_23-2148457848.jpg" 
            alt="Blog Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 text-shadow-lg">Blog Điện Ảnh</h1>
          <p className="text-white text-sm md:text-base max-w-xl mx-auto font-medium drop-shadow-lg">
            Khám phá những bài viết mới nhất về điện ảnh, review phim và tin tức giải trí
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500 border-r-2"></div>
          </div>
        ) : error ? (
          <div className="text-center text-amber-600 p-4 bg-white rounded shadow-sm">
            <p>Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center">
                <div className="w-10 h-1 bg-amber-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800 ml-3">Bài Viết Mới Nhất</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Link to={`/posts/${post.id || post._id}`} key={post.id || post._id}>
                    <div className="bg-white rounded-lg overflow-hidden h-full border border-gray-100 shadow-sm hover:shadow-md">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={getPostImage(post)}
                          alt={post.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-5">
                        <div className="mb-3">
                          <span className="text-gray-500 text-xs font-medium">
                            {formatDate(post.createdAt)} • {post.author || 'Admin'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{getContentSummary(post)}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">Blog</span>
                          <span className="text-sm text-amber-600 font-medium">Xem thêm</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center p-10 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Chưa có bài viết</h3>
                  <p className="text-gray-600 mb-6">Hiện chưa có bài viết nào trong hệ thống.</p>
                  <Link to="/" className="inline-block px-5 py-2.5 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600">
                    Quay về trang chủ
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

