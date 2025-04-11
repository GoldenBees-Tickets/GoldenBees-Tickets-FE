'use client';

import { useState, useEffect } from 'react';
import { useGetPostsQuery } from '../../../api/postApi';
import { Link } from 'react-router-dom';

export default function UserBlogNew() {
  const { data: postsData, isLoading, error } = useGetPostsQuery();
  
  // Lấy 3 bài viết mới nhất từ API
  const recentPosts = postsData?.posts?.slice(0, 3) || [];
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '31 DEC 2024';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };
  
  // Lấy tóm tắt nội dung (không có HTML)
  const getContentSummary = (post) => {
    if (post.summary) return post.summary;
    if (!post.content) return "";
    
    // Loại bỏ tất cả các thẻ HTML
    const plainText = post.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
    // Lấy 150 ký tự đầu
    return plainText.substring(0, 150).trim() + '...';
  };

  // Trích xuất URL của ảnh đầu tiên từ nội dung HTML
  const extractFirstImageFromContent = (content) => {
    if (!content) return null;
    
    // Tìm URL ảnh đầu tiên trong thẻ img 
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    
    // Trả về URL ảnh nếu tìm thấy
    return match ? match[1] : null;
  };

  // Lấy URL ảnh từ các nguồn khác nhau
  const getPostImage = (post) => {
    // Ưu tiên sử dụng thumbnail nếu có
    if (post.thumbnail) return post.thumbnail;
    
    // Thử lấy ảnh từ trường image
    if (post.image) return post.image;
    
    // Trích xuất ảnh từ nội dung
    const contentImage = extractFirstImageFromContent(post.content);
    if (contentImage) return contentImage;
    
    // Sử dụng ảnh mặc định nếu không có ảnh nào
    return ;
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen py-6 px-4 font-[sans-serif]">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex justify-start mb-6">
          <div className="inline-flex rounded-full shadow-lg bg-white/90 backdrop-blur-md p-0.5 border border-amber-100">
            <Link to="/" className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 text-gray-700 hover:text-amber-700 hover:bg-amber-50">
              Trang Chủ
            </Link>
            <div className="px-4 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/30 transform transition-all duration-300 hover:scale-105">
              Blog Điện Ảnh
            </div>
          </div>
        </div>
        <div className="text-center mb-8 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-amber-100 rounded-full filter blur-3xl opacity-30 z-0"></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-yellow-600 inline-block relative pb-3 z-10">
            Các Bài Viết Mới
            <span className="absolute left-1/2 bottom-0 w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 transform -translate-x-1/2 rounded-full shadow-sm"></span>
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm">Khám phá những bài viết mới nhất về điện ảnh, review phim và tin tức giải trí</p>
        </div>

       
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-amber-200 border-t-amber-600"></div>
              <div className="mt-3 text-amber-600 font-medium text-center text-sm">Đang tải bài viết...</div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-6 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl max-w-2xl mx-auto border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold mb-1.5 text-red-600">Đã xảy ra lỗi</h3>
            <p className="text-gray-600 text-sm">Không thể tải bài viết. Vui lòng thử lại sau.</p>
            <button className="mt-4 px-5 py-2 bg-red-50 text-red-600 rounded-full font-medium hover:bg-red-100 transition-colors duration-300 text-sm">
              Thử lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link to={`/posts/${post.id || post._id}`} key={post.id || post._id} className="block group">
                  <div className="h-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-amber-100">
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img 
                        src={getPostImage(post)}
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <span className="bg-white/90 backdrop-blur-sm text-amber-800 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <span className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                            {(post.author || 'A')[0].toUpperCase()}
                          </div>
                          <span className="text-gray-600 text-xs font-medium">
                            {post.author || 'ADMIN'}
                          </span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">{getContentSummary(post)}</p>
                      <div className="mt-3 pt-3 border-t border-amber-100 flex justify-between items-center">
                        <div className="flex space-x-1.5">
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Phim</span>
                          <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">Blog</span>
                        </div>
                        <span className="text-xs font-medium text-amber-600 flex items-center group">
                          Xem thêm
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 px-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-2xl mx-auto border border-amber-100">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5m14 6a2 2 0 01-2 2H5a2 2 0 01-2-2V8l7 5 7-5v5a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Chưa có bài viết</h3>
                <p className="text-gray-600 mb-6">Hiện chưa có bài viết nào trong hệ thống.</p>
                <Link to="/" className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
                  Quay về trang chủ
                </Link>
              </div>
            )}
          </div>
        )}

      
      </div>
    </div>
  );
}

