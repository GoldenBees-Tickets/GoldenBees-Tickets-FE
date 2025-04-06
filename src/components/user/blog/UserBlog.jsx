'use client';

import { useState } from 'react';
import { useGetPostsQuery } from '../../../api/postApi';
import { Link } from 'react-router-dom';

export default function UserBlog() {
  const { data: postsData, isLoading, error } = useGetPostsQuery();
  
  // Lấy tất cả bài viết ngoại trừ 3 bài mới nhất (đã hiển thị ở UserBlogNew)
  const otherPosts = postsData?.posts?.slice(3) || [];
  
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

  return (
    <div className="bg-white font-[sans-serif] my-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative after:absolute after:w-4/6 after:h-1 after:left-0 after:right-0 after:-bottom-4 after:mx-auto after:bg-pink-400 after:rounded-full">Các Bài Viết Khác</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-8">
            Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-lg:max-w-3xl max-md:max-w-md mx-auto">
            {otherPosts.length > 0 ? (
              otherPosts.map((post) => (
                <Link to={`/posts/${post.id || post._id}`} key={post.id || post._id} className="block">
                  <div className="bg-white cursor-pointer rounded overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative top-0 hover:-top-2 transition-all duration-300">
                    <img 
                      src={post.image || './blog/prd4.jpg'} 
                      alt={post.title} 
                      className="w-full h-60 object-cover" 
                    />
                    <div className="p-6">
                      <span className="text-sm block text-gray-400 mb-2">
                        {formatDate(post.createdAt)} | BY {post.author || 'ADMIN'}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                      <hr className="my-4" />
                      <p className="text-gray-400 text-sm">{getContentSummary(post)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-10">
                Không có bài viết khác để hiển thị.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
