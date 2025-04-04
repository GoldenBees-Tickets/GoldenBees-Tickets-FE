import { useParams } from "react-router-dom";
import PostForm from "@/components/Admin/AdminPosts/PostForm";

export default function PostsEdit() {
  const { id } = useParams();
  return <PostForm postId={id} />;
} 