import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetPostByIdQuery } from "@/api/postApi";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: postData, isLoading, isError } = useGetPostByIdQuery(id, {
    skip: !id
  });
  
  useEffect(() => {
    if (!id) {
      navigate('/blog');
    }
  }, [id, navigate]);

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
    // Ưu tiên sử dụng thumbnail nếu có
    if (post.thumbnail) return post.thumbnail;
    
    // Thử lấy ảnh từ trường image
    if (post.image) return post.image;
    
    // Trích xuất ảnh từ nội dung bài viết
    const contentImage = extractImageFromContent(post.content);
    if (contentImage) return contentImage;
    
    // Nếu không có ảnh, trả về null để không hiển thị phần ảnh
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500 border-r-2"></div>
      </div>
    );
  }

  if (isError || !postData?.post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="mb-6 text-gray-800 font-medium">Không tìm thấy bài viết hoặc đã xảy ra lỗi</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-5 py-2.5 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600"
          >
            Quay lại trang blog
          </button>
        </div>
      </div>
    );
  }

  const { post } = postData;
  
  const formattedDate = post.createdAt 
    ? new Date(post.createdAt).toLocaleDateString("vi-VN")
    : "Không có thông tin ngày";

  // Lấy ảnh bài viết
  const postImage = getPostImage(post);

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Navigation link */}
        <div className="mb-6">
          <Link to="/blog" className="text-amber-600 hover:text-amber-700 flex items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang blog
          </Link>
        </div>

        {/* Post header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <span className="mr-4 flex items-center">
              {post.author || "Admin"}
            </span>
            <span className="flex items-center">
              {formattedDate}
            </span>
          </div>
          
          {/* Post banner image - display only if post has an image */}
          {postImage && (
            <div className="mt-4 -mx-6 mb-6">
              <img 
                src={postImage} 
                alt={post.title} 
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          )}
        </div>

        {/* Post content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
          {post.content ? (
            <div 
              className="prose prose-sm sm:prose lg:prose-lg mx-auto prose-headings:text-gray-800 prose-a:text-amber-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">Không có nội dung bài viết</p>
          )}
        </div>

        {/* Post tags and share */}
        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">Blog</span>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">Điện Ảnh</span>
          </div>
          
          <div className="mt-3 sm:mt-0">
            <Link
              to="/blog"
              className="inline-block px-5 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600"
            >
              Quay lại trang blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 