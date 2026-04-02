'use client';
import { useState, useEffect, useRef } from 'react';
import {
  LuImage,
  LuType,
  LuSettings,
  LuSearch,
  LuGlobe,
  LuLock,
  LuEllipsis,
  LuX,
} from 'react-icons/lu';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useCategories, useCreatePost } from '@/features/post/hooks/usePost';

export default function CreatePost() {
  const { user } = useAuthStore();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results || [];
  const { mutate: createPost, isPending } = useCreatePost();

  // 1. Single State Object
  const [form, setForm] = useState({
    title: '',
    content: '',
    visibility: 'public',
    category: null,
    images: [],
    imagePreviews: [],
  });

  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Single Handle Change for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      const newPreviews = [...prev.imagePreviews];
      
      URL.revokeObjectURL(newPreviews[index]);
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      return { ...prev, images: newImages, imagePreviews: newPreviews };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.content && form.images.length === 0) return;

    const data = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('visibility', form.visibility);
    formData.append('status', 'published');
    if (form.category) data.append('category', form.category.id);

    form.images.forEach((image) => {
      data.append('uploaded_images', image);
    });

    createPost(data, {
      onSuccess: () => {
        setForm({
          title: '',
          content: '',
          visibility: 'public',
          category: null,
          images: [],
          imagePreviews: [],
        });
      },
    });
  };

  const avatarSrc = user?.profile?.profile_picture_url || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700"
    >
      {/* 1. Profile & Visibility Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <div className="relative size-10">
            <Image
              className="rounded-full object-cover"
              src={avatarSrc}
              alt="User Avatar"
              fill
            />
          </div>
          <div className="grow">
            <span className="block font-semibold text-gray-800 dark:text-neutral-200">
              {`${user?.first_name} ${user?.last_name}` || 'User'}
            </span>

            {/* Preline Dropdown for Visibility */}
            <div className="hs-dropdown relative inline-flex">
              <button
                id="hs-create-post-visibility"
                type="button"
                className="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {form.visibility === 'public' ? <LuGlobe className="size-3" /> : <LuLock className="size-3" />}
                <span className="capitalize">{form.visibility}</span>
                <svg className="hs-dropdown-open:rotate-180 size-3 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </button>

              <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-32 bg-white shadow-md rounded-lg p-1 dark:bg-neutral-900 dark:border dark:border-neutral-700">
                <button type="button" onClick={() => setForm(p => ({...p, visibility: 'public'}))} className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800">Public</button>
                <button type="button" onClick={() => setForm(p => ({...p, visibility: 'private'}))} className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800">Private</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300">
          <LuEllipsis className="size-5" />
        </button>
      </div>

      {/* 2. Title & Content Area */}
      <div className="px-4 pb-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Post Title (optional)..."
          className="py-2 px-0 block w-full border-transparent bg-transparent text-lg font-bold placeholder:text-gray-400 focus:ring-0 focus:border-transparent dark:text-white dark:placeholder:text-neutral-500"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="py-2 px-0 block w-full border-transparent bg-transparent text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-transparent min-h-[120px] resize-none dark:text-neutral-300 dark:placeholder:text-neutral-500"
          placeholder="What's on your mind?"
        ></textarea>
      </div>

      {/* Image Previews */}
      {form.imagePreviews.length > 0 && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {form.imagePreviews.map((preview, index) => (
            <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
              <Image src={preview} alt="preview" fill className="object-cover" />
              <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <LuX className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Searchable Tag/Category Selection */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-3 dark:border-neutral-700">
        <div className="relative" data-hs-combo-box={mounted ? JSON.stringify({ groupingType: 'default', isOpenOnFocus: true, preventAutoPosition: false }) : undefined} suppressHydrationWarning={true}>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3.5">
              <LuSearch className="size-4 text-gray-400" />
            </div>
            <input
              className="py-2 ps-10 pe-4 block w-full bg-gray-50 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-500"
              type="text"
              placeholder={form.category ? form.category.title : 'Select Category...'}
              data-hs-combo-box-input=""
            />
          </div>

          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 dark:bg-neutral-900 dark:border-neutral-700 overflow-hidden" style={{ display: 'none' }} data-hs-combo-box-output="">
            <div className="max-h-48 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" data-hs-combo-box-output-items-wrapper="">
              {categories.map((cat) => (
                <div key={cat.id} onClick={() => setForm(p => ({...p, category: cat}))} className="cursor-pointer py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800" data-hs-combo-box-output-item={JSON.stringify({ value: cat.id, label: cat.title, name: cat.title })}>
                  {cat.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Footer */}
      <div className="p-3 bg-gray-50 flex items-center justify-between rounded-b-xl border-t border-gray-200 dark:bg-neutral-800/50 dark:border-neutral-700">
        <div className="flex items-center gap-x-1">
          <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
          <button type="button" title="Add Image" onClick={() => fileInputRef.current?.click()} className="p-2 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700">
            <LuImage className="size-5" />
          </button>
          <button type="button" className="p-2 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"><LuType className="size-5" /></button>
          <button type="button" className="p-2 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"><LuSettings className="size-5" /></button>
        </div>

        <div className="flex gap-x-2">
          <button type="button" className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700">Save Draft</button>
          <button type="submit" disabled={isPending} className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
}
