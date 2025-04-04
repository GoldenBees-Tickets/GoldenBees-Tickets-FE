import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetPostsQuery } from "@/api/postApi";

export default function PostsList() {
  const { data: postsData, isLoading, isError } = useGetPostsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter posts by search term
  const filteredPosts = postsData?.posts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 p-4">
        Đã xảy ra lỗi khi tải dữ liệu bài viết
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tin Tức & Bài Viết</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cập nhật tin tức mới nhất về phim ảnh, sự kiện và ưu đãi đặc biệt tại rạp chiếu phim của chúng tôi.
          </p>
        </div>

        {/* Search box */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {filteredPosts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      post.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      bởi {post.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div 
                    className="text-gray-600 mb-4 line-clamp-3 text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: post.content.replace(/<[^>]*>/g, ' ').substring(0, 150) + '...' 
                    }}
                  />
                  <Link
                    to={`/posts/${post.id}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Đọc tiếp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-gray-600">Không tìm thấy bài viết nào</p>
          </div>
        )}
      </div>
    </div>
  );
} 