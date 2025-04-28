import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useCreatePostMutation, useUpdatePostMutation, useGetPostByIdQuery } from "@/api/postApi";

export default function PostForm({ postId }) {
  const navigate = useNavigate();
  const isEditMode = Boolean(postId);
  
  const { data: postData, isLoading: isLoadingPost } = useGetPostByIdQuery(postId, {
    skip: !isEditMode,
  });
  
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("active");
  
  const isLoading = isCreating || isUpdating;

  // Cấu hình cho ReactQuill
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  }), []);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "color", "background",
    "align",
    "link", "image",
  ];

  useEffect(() => {
    if (isEditMode && postData?.post) {
      const post = postData.post;
      reset({
        title: post.title,
        author: post.author,
      });
      
      setContent(post.content);
      setStatus(post.status);
    }
  }, [isEditMode, postData, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", content);
      formData.append("status", status);
      
      if (data.author) {
        formData.append("author", data.author);
      }
      
      if (isEditMode) {
        await updatePost({ id: postId, formData }).unwrap();
        toast.success("Cập nhật bài viết thành công");
      } else {
        await createPost(formData).unwrap();
        toast.success("Thêm bài viết mới thành công");
      }
      
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Có lỗi xảy ra khi lưu bài viết");
    }
  };

  if (isEditMode && isLoadingPost) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditMode ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", { required: "Tiêu đề không được để trống" })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tiêu đề bài viết"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <div className="border border-gray-300 rounded-md">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="h-64 mb-12"
            />
          </div>
          {!content && (
            <p className="text-red-500 text-xs mt-1">Nội dung không được để trống</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tác giả
          </label>
          <input
            {...register("author")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Admin"
          />
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/posts")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </span>
            ) : (
              "Lưu bài viết"
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 