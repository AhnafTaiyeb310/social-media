'use client';
import { useCreatePost } from '@/features/post/hooks/usePost';
import PostForm from './PostForm';

export default function CreatePost() {
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (data) => {
    createPost(data);
  };

  return (
    <PostForm 
      onSubmit={handleSubmit} 
      isPending={isPending} 
      buttonText="Post Now" 
    />
  );
}
