'use client';
import { useState } from 'react';
import { useCreatePost } from '@/features/post/hooks/usePost';
import PostForm from './PostForm';
import { toast } from 'sonner';

export default function CreatePost() {
  const { mutate: createPost, isPending } = useCreatePost();
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = (data, options) => {
    const promise = new Promise((resolve, reject) => {
      createPost(data, {
        onSuccess: (res) => {
          if (options?.onSuccess) options.onSuccess(res);
          setResetKey(prev => prev + 1);
          resolve(res);
        },
        onError: (err) => {
          if (options?.onError) options.onError(err);
          reject(err);
        }
      });
    });

    toast.promise(promise, {
      loading: 'Creating your post...',
      success: 'Post created successfully!',
      error: 'Failed to create post.',
    });
  };

  return (
    <PostForm 
      key={`create-post-form-${resetKey}`}
      onSubmit={handleSubmit} 
      isPending={isPending} 
      buttonText="Post Now" 
    />
  );
}
