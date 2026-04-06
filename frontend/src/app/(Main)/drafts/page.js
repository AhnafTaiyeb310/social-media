'use client';
import { useState, useEffect } from 'react';
import { 
  LuEllipsis, 
  LuPencil, 
  LuTrash2, 
  LuFileText, 
  LuBadgeCheck, 
  LuArchive,
  LuPlus,
  LuInfo,
  LuX
} from 'react-icons/lu';
import { useAuthStore } from '@/store/useAuthStore';
import { usePosts, useDeletePost, useUpdatePost } from '@/features/post/hooks/usePost';
import PostForm from '@/components/feed/PostForm';

export default function DraftsPage() {
  const { user } = useAuthStore();
  const { data: postsData, isLoading, refetch } = usePosts();
  
  const [activeTab, setActiveTab] = useState('draft');
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToEdit, setPostToEdit] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter posts
  const allPosts = postsData?.results || [];
  const userPosts = allPosts.filter(p => p.author === user?.username);
  const filteredPosts = userPosts.filter(p => p.status === activeTab);
  
  const counts = {
    draft: userPosts.filter(p => p.status === 'draft').length,
    published: userPosts.filter(p => p.status === 'published').length,
    archived: userPosts.filter(p => p.status === 'archived').length,
  };

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [isMounted, filteredPosts, activeTab]);

  const confirmDelete = () => {
    if (!postToDelete) return;
    deletePost(postToDelete.id, {
      onSuccess: () => {
        if (window.HSOverlay) window.HSOverlay.close('#hs-delete-post-modal');
        setPostToDelete(null);
      }
    });
  };

  const handleUpdate = (formData) => {
    if (!postToEdit) return;
    updatePost({ id: postToEdit.id, data: formData }, {
      onSuccess: () => {
        if (window.HSOverlay) window.HSOverlay.close('#hs-edit-post-modal');
        setPostToEdit(null);
      }
    });
  };

  if (!isMounted) return null;

  const getStatusIcon = (status) => {
    switch (status) {
    case 'published': return <LuBadgeCheck className="size-4 text-green-500" />;
    case 'archived': return <LuArchive className="size-4 text-gray-500" />;
    default: return <LuFileText className="size-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-layer px-4">
      <div className="max-w-3xl mx-auto space-y-8 py-10">
        
        {/* Header Row */}
        <div className="flex items-center justify-between pb-6 border-b border-navbar-line">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">
              {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-sm text-muted-foreground-1">Manage your stories and ideas</p>
          </div>
        </div>

        {/* Status Navigation */}
        <div className="flex justify-center">
          <nav className="inline-flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl">
            {['draft', 'published', 'archived'].map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center gap-x-2 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                  activeTab === id
                    ? 'bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <span className="capitalize">{id}s</span>
                <span className={`inline-flex items-center py-0.5 px-1.5 rounded-full text-[10px] font-bold ${
                  activeTab === id ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40' : 'bg-gray-200 dark:bg-neutral-600 text-gray-600 dark:text-neutral-300'
                }`}>
                  {counts[id]}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-20 animate-pulse text-gray-400">Loading your posts...</div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="group flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:border-blue-500/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 p-2.5 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                    {getStatusIcon(post.status)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate group-hover:text-blue-600 transition-colors">
                      {post.title || 'Untitled'}
                    </h3>
                    <p className="text-xs text-muted-foreground-1 mt-0.5">
                      Edited {new Date(post.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="hs-dropdown relative inline-flex">
                  <button
                    id={`hs-draft-menu-${post.id}`}
                    type="button"
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <LuEllipsis className="size-5" />
                  </button>
                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-32 bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-2 border border-gray-100 dark:border-neutral-700"
                    aria-labelledby={`hs-draft-menu-${post.id}`}
                  >
                    <button 
                      type="button"
                      data-hs-overlay="#hs-edit-post-modal"
                      onClick={() => setPostToEdit(post)}
                      className="flex items-center gap-x-3 py-2 px-3 w-full rounded-lg text-sm text-gray-800 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <LuPencil className="size-4" /> Edit
                    </button>
                    <div className="my-1 border-t border-gray-100 dark:border-neutral-700"></div>
                    <button 
                      type="button"
                      data-hs-overlay="#hs-delete-post-modal"
                      onClick={() => setPostToDelete(post)}
                      className="flex items-center gap-x-3 py-2 px-3 w-full rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LuTrash2 className="size-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
              <LuFileText className="size-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-neutral-400 text-sm">No {activeTab} posts found.</p>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      <div id="hs-edit-post-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[100] overflow-x-hidden overflow-y-auto pointer-events-none">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto">
          <div className="relative flex flex-col bg-white border shadow-sm rounded-2xl dark:bg-neutral-900 dark:border-neutral-800 pointer-events-auto">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Edit Post
              </h3>
              <button type="button" className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-neutral-700 dark:focus:ring-offset-neutral-800" data-hs-overlay="#hs-edit-post-modal">
                <LuX className="size-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {postToEdit && (
                <PostForm 
                  initialData={postToEdit} 
                  onSubmit={handleUpdate} 
                  isPending={isUpdating} 
                  buttonText="Save Changes" 
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <div id="hs-delete-post-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[100] overflow-x-hidden overflow-y-auto pointer-events-none flex items-center justify-center">
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="relative flex flex-col bg-white border shadow-sm rounded-2xl dark:bg-neutral-900 dark:border-neutral-800 pointer-events-auto">
            <div className="p-4 sm:p-10 text-center">
              <span className="mb-4 inline-flex justify-center items-center size-16 rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
                <LuInfo className="size-8" />
              </span>
              <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-neutral-200">
                Delete Post?
              </h3>
              <p className="text-gray-500 dark:text-neutral-500">
                Are you sure you want to delete <span className="font-bold text-gray-800 dark:text-neutral-200">&quot;{postToDelete?.title || "this post"}&quot;</span>? 
                This action cannot be undone.
              </p>
              <div className="mt-8 flex justify-center gap-x-3">
                <button type="button" className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800" data-hs-overlay="#hs-delete-post-modal">Cancel</button>
                <button type="button" onClick={confirmDelete} disabled={isDeleting} className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-bold rounded-xl border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-500/20">
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
