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
  LuChevronDown,
  LuCalendar,
  LuTrash2,
  LuLayoutList,
  LuHash,
} from 'react-icons/lu';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useCategories, useCreatePost } from '@/features/post/hooks/usePost';

export default function CreatePost() {
  const { user } = useAuthStore();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.results || [];
  const { mutate: createPost, isPending } = useCreatePost();

  const [form, setForm] = useState({
    title: '',
    content: '',
    visibility: 'public',
    status: 'published',
    scheduled_for: '',
    category: null,
    tags: [],
    images: [],
    imagePreviews: [],
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
      
      // Clean up the URL to prevent memory leaks
      URL.revokeObjectURL(newPreviews[index]);
      
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      return { ...prev, images: newImages, imagePreviews: newPreviews };
    });
  };

  const resetForm = () => {
    // Revoke all previews
    form.imagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    setForm({
      title: '',
      content: '',
      visibility: 'public',
      status: 'published',
      scheduled_for: '',
      category: null,
      tags: [],
      images: [],
      imagePreviews: [],
    });
    setTagInput('');
    setShowMoreOptions(false);
  };

  const handleSubmit = (e) => {
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
    
    if (form.category) data.append('category', form.category.id);

    form.tags.forEach(tag => {
      data.append('tag_names', tag);
    });

    form.images.forEach((image) => {
      data.append('uploaded_images', image);
    });

    createPost(data, { onSuccess: resetForm });
  };

  const avatarSrc = user?.profile?.profile_picture_url || 'https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-800 transition-all overflow-hidden"
    >
      {/* 1. Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <div className="relative size-10">
            <Image className="rounded-full object-cover" src={avatarSrc} alt="User Avatar" fill />
          </div>
          <div className="grow">
            <span className="block font-semibold text-gray-800 dark:text-neutral-200">
              {user?.first_name || 'User'}
            </span>

            <div className="hs-dropdown relative inline-flex">
              <button
                id="hs-create-post-visibility"
                type="button"
                className="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {form.visibility === 'public' ? <LuGlobe className="size-3" /> : <LuLock className="size-3" />}
                <span className="capitalize">{form.visibility}</span>
                <LuChevronDown className="hs-dropdown-open:rotate-180 size-3 transition-transform" />
              </button>

              <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-32 bg-white shadow-md rounded-lg p-1 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                {['public', 'private'].map((v) => (
                  <button key={v} type="button" onClick={() => setForm(p => ({...p, visibility: v}))} className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 capitalize">{v}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hs-dropdown relative inline-flex">
          <button id="hs-create-post-menu" type="button" className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
            <LuEllipsis className="size-5" />
          </button>
          <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-48 bg-white shadow-md rounded-xl p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700">
            <button type="button" onClick={resetForm} className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20">
              <LuTrash2 className="size-4" /> Clear Draft
            </button>
            <button type="button" className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700">
              <LuLayoutList className="size-4" /> View My Posts
            </button>
          </div>
        </div>
      </div>

      {/* 2. Title & Content */}
      <div className="px-4 pt-4 pb-2">
        <input
          type="text" name="title" value={form.title} onChange={handleChange}
          placeholder="Give your post a title..."
          className="py-2 px-0 block w-full border-transparent bg-transparent text-xl font-bold placeholder:text-gray-400 focus:ring-0 focus:border-transparent dark:text-white dark:placeholder:text-neutral-500"
        />
        <textarea
          name="content" value={form.content} onChange={handleChange}
          className="py-2 px-0 block w-full border-transparent bg-transparent text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-transparent min-h-[140px] resize-none dark:text-neutral-300 dark:placeholder:text-neutral-500"
          placeholder="What's on your mind? Share your thoughts or code..."
        ></textarea>
      </div>

      {/* Tags Display */}
      {form.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {form.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-x-1 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-600 dark:hover:text-white">
                <LuX className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 3. Image Previews Section */}
      {form.imagePreviews.length > 0 && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {form.imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-gray-100 dark:border-neutral-800 shadow-sm">
                {/* Using standard img for local blob previews to avoid optimization issues */}
                <img 
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)} 
                    className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-all hover:scale-110"
                    title="Remove image"
                  >
                    <LuTrash2 className="size-5" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] rounded-md backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MORE OPTIONS (Expanded by Settings Icon) */}
      {showMoreOptions && (
        <div className="px-4 py-4 bg-gray-50 dark:bg-neutral-800/50 border-y border-gray-100 dark:border-neutral-800 transition-all space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Post Status</label>
              <div className="hs-dropdown relative inline-flex w-full">
                <button type="button" className="hs-dropdown-toggle w-full py-2 px-3 inline-flex justify-between items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                  <span className="capitalize">{form.status}</span>
                  <LuChevronDown className="hs-dropdown-open:rotate-180 size-4" />
                </button>
                <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-full bg-white shadow-md rounded-lg p-1 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                  {['published', 'draft', 'scheduled', 'archived'].map((s) => (
                    <button key={s} type="button" onClick={() => setForm(p => ({...p, status: s}))} className="w-full text-start py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 capitalize">{s}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
              <div className="hs-dropdown relative inline-flex w-full">
                <button type="button" className="hs-dropdown-toggle w-full py-2 px-3 inline-flex justify-between items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                  <span className="truncate">{form.category ? form.category.title : 'Uncategorized'}</span>
                  <LuChevronDown className="hs-dropdown-open:rotate-180 size-4" />
                </button>
                <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-full max-h-48 overflow-y-auto bg-white shadow-md rounded-lg p-1 dark:bg-neutral-800 dark:border dark:border-neutral-700 custom-scrollbar">
                  <button type="button" onClick={() => setForm(p => ({...p, category: null}))} className="w-full text-start py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800">Uncategorized</button>
                  {categories.map((cat) => (
                    <button key={cat.id} type="button" onClick={() => setForm(p => ({...p, category: cat}))} className="w-full text-start py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800">{cat.title}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tag Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tags</label>
            <div className="relative">
              {/* <LuHash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" /> */}
              <input 
                type="text" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="   Add tags (press Enter)..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-neutral-200 shadow-sm"
              />
            </div>
          </div>

          {form.status === 'scheduled' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl flex items-center gap-x-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white"><LuCalendar className="size-4" /></div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">Schedule Publication</p>
                <input type="datetime-local" name="scheduled_for" value={form.scheduled_for} onChange={handleChange} className="w-full bg-transparent border-none p-0 text-sm font-semibold text-gray-800 dark:text-neutral-200 focus:ring-0" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Action Footer */}
      <div className="p-3 bg-gray-50 flex items-center justify-between rounded-b-xl border-t border-gray-200 dark:bg-neutral-800/50 dark:border-neutral-700">
        <div className="flex items-center gap-x-1">
          <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
          <button type="button" title="Add Image" onClick={() => fileInputRef.current?.click()} className="p-2.5 inline-flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700 transition-colors">
            <LuImage className="size-5" />
          </button>
          <button type="button" title="Text Formatting" className="p-2.5 inline-flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"><LuType className="size-5" /></button>
          
          <button 
            type="button" 
            title="More Settings"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className={`p-2.5 inline-flex items-center justify-center rounded-xl transition-all ${showMoreOptions ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700'}`}
          >
            <LuSettings className={`size-5 ${showMoreOptions ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>

        <div className="flex gap-x-2">
          <button type="button" onClick={() => setForm(p => ({...p, status: 'draft'}))} className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 transition-all">Save Draft</button>
          <button type="submit" disabled={isPending} className="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-bold rounded-xl border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            {isPending ? 'Posting...' : form.status === 'scheduled' ? 'Schedule' : 'Post Now'}
          </button>
        </div>
      </div>
    </form>
  );
}
