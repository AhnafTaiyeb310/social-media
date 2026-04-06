'use client';
import { useState, useEffect, useRef } from 'react';
import {
  LuImage,
  LuType,
  LuSettings,
  LuSearch,
  LuGlobe,
  LuLock,
  LuX,
  LuChevronDown,
  LuCalendar,
  LuHash,
} from 'react-icons/lu';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useCategories } from '@/features/post/hooks/usePost';

export default function PostForm({ initialData = null, onSubmit, isPending, buttonText = "Post Now" }) {
  const { user } = useAuthStore();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results || [];

  const [form, setForm] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    visibility: initialData?.visibility || 'public',
    status: initialData?.status || 'published',
    scheduled_for: initialData?.scheduled_for ? new Date(initialData.scheduled_for).toISOString().slice(0, 16) : '',
    category: initialData?.category_id || initialData?.category || null,
    tags: initialData?.tags || [],
    images: [],
    imagePreviews: initialData?.images?.map(img => img.image_url) || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showMoreOptions && typeof window !== 'undefined' && window.HSStaticMethods) {
      setTimeout(() => window.HSStaticMethods.autoInit(), 100);
    }
  }, [showMoreOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, '');
      if (val && !form.tags.includes(val)) {
        setForm(prev => ({ ...prev, tags: [...prev.tags, val] }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

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
      if (newPreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      return { ...prev, images: newImages, imagePreviews: newPreviews };
    });
  };

  const internalOnSubmit = (e) => {
    e.preventDefault();
    if (!form.content && form.images.length === 0) return;

    const data = new FormData();
    data.append('title', form.title || `Post by ${user?.first_name || 'User'}`);
    data.append('content', form.content);
    data.append('visibility', form.visibility);
    data.append('status', form.status);
    
    if (form.status === 'scheduled' && form.scheduled_for) {
      data.append('scheduled_for', new Date(form.scheduled_for).toISOString());
    }
    
    if (form.category) {
      const catId = typeof form.category === 'object' ? form.category.id : form.category;
      data.append('category', catId);
    }

    form.tags.forEach(tag => data.append('tag_names', tag));
    form.images.forEach((image) => data.append('uploaded_images', image));

    onSubmit(data);
  };

  const avatarSrc = user?.profile_picture_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-800 transition-all overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-x-3">
          <div className="relative size-10">
            <Image
              className="rounded-full object-cover"
              src={avatarSrc}
              alt="User Avatar"
              fill
              sizes="40px"
            />
          </div>
          <div className="grow">
            <span className="block font-semibold text-gray-800 dark:text-neutral-200">
              {user?.first_name + ' ' + user?.last_name  || 'User'}
            </span>
            <div className="hs-dropdown relative inline-flex">
              <button
                type="button"
                className="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {form.visibility === 'public' ? (
                  <LuGlobe className="size-3" />
                ) : (
                  <LuLock className="size-3" />
                )}
                <span className="capitalize">{form.visibility}</span>
                <LuChevronDown className="hs-dropdown-open:rotate-180 size-3 transition-transform" />
              </button>
              <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-32 bg-white shadow-md rounded-lg p-1 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                {['public', 'private'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, visibility: v }))}
                    className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 capitalize"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Give your post a title..."
          className="py-2 px-0 block w-full border-transparent bg-transparent text-xl font-bold placeholder:text-gray-400 focus:ring-0 focus:border-transparent dark:text-white dark:placeholder:text-neutral-500"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="py-2 px-0 block w-full border-transparent bg-transparent text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-transparent min-h-[140px] resize-none dark:text-neutral-300 dark:placeholder:text-neutral-500"
          placeholder="What's on your mind? Share your thoughts or code..."
        ></textarea>

        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-x-1 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-blue-600 dark:hover:text-white"
                >
                  <LuX className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {form.imagePreviews.length > 0 && (
          <div className="grid gap-2 grid-cols-3">
            {form.imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 dark:border-neutral-800"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <LuX className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showMoreOptions && (
        <div className="px-4 py-4 bg-gray-50 dark:bg-neutral-800/50 border-y border-gray-100 dark:border-neutral-800 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Post Status
              </label>
              <div className="hs-dropdown relative inline-flex w-full">
                <button
                  type="button"
                  className="hs-dropdown-toggle w-full py-2 px-3 inline-flex justify-between items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-white capitalize"
                >
                  {form.status} <LuChevronDown className="size-4" />
                </button>
                <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-full bg-white shadow-md rounded-lg p-1 dark:bg-neutral-800">
                  {['published', 'draft', 'scheduled', 'archived'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, status: s }))}
                      className="w-full text-start py-2 px-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 capitalize"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Category
              </label>
              <div className="hs-dropdown relative inline-flex w-full">
                <button
                  type="button"
                  className="hs-dropdown-toggle w-full py-2 px-3 inline-flex justify-between items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
                >
                  <span className="truncate">
                    {form.category
                      ? typeof form.category === 'object'
                        ? form.category.title
                        : form.category
                      : 'Uncategorized'}
                  </span>
                  <LuChevronDown className="size-4" />
                </button>
                <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-full max-h-48 overflow-y-auto bg-white shadow-md rounded-lg p-1 dark:bg-neutral-800">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, category: null }))}
                    className="w-full text-start py-2 px-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-700"
                  >
                    Uncategorized
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, category: cat }))}
                      className="w-full text-start py-2 px-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)..."
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:border-blue-500"
            />
          </div>
          {form.status === 'scheduled' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl flex items-center gap-x-3">
              <LuCalendar className="size-4 text-blue-600" />
              <input
                type="datetime-local"
                name="scheduled_for"
                value={form.scheduled_for}
                onChange={handleChange}
                className="bg-transparent border-none p-0 text-sm font-semibold focus:ring-0"
              />
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 flex items-center justify-between border-t border-gray-200 dark:border-neutral-700">
        <div className="flex items-center gap-x-1">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700 rounded-xl"
          >
            <LuImage className="size-5" />
          </button>
          <button
            type="button"
            className="p-2.5 text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700 rounded-xl"
          >
            <LuType className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className={`p-2.5 rounded-xl transition-all ${showMoreOptions ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700'}`}
          >
            <LuSettings className="size-5" />
          </button>
        </div>
        <div className="flex gap-x-2">
          <button
            type="button"
            onClick={internalOnSubmit}
            disabled={isPending}
            className="py-2 px-6 text-sm font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
          >
            {isPending ? 'Saving...' : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
