import { useState } from "react";
import { useGetPostsQuery, useDeletePostMutation } from "@/api/postApi";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

export default function PostsList() {
  const { data: postsData, isLoading, isError } = useGetPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await deletePost(id).unwrap();
        toast.success("Xóa bài viết thành công");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Không thể xóa bài viết");
      }
    }
  };

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý bài viết</h1>
        <Link
          to="/admin/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-300"
        >
          <FiPlus className="mr-2" /> Thêm bài viết
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {filteredPosts?.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === "active"
                          ? "bg-green-100 text-green-800"
                          : post.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {post.status === "active"
                        ? "Đã xuất bản"
                        : post.status === "draft"
                        ? "Bản nháp"
                        : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/posts/edit/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Không tìm thấy bài viết nào</p>
        </div>
      )}
    </div>
  );
} 