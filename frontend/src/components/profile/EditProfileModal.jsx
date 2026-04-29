'use client';
import { useState, useRef, useEffect } from 'react';
import { LuX, LuCamera, LuSave, LuLoader } from 'react-icons/lu';
import Image from 'next/image';
import { DEFAULT_AVATAR } from '@/lib/constants';

export default function EditProfileModal({ profile, onSave, isPending }) {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    role: profile?.role || 'Member',
    birth_date: profile?.birth_date || '',
    twitter_url: profile?.twitter_url || '',
    github_url: profile?.github_url || '',
    website_url: profile?.website_url || '',
  });

  const [previewUrl, setPreviewUrl] = useState(profile?.profile_picture_url || DEFAULT_AVATAR);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        role: profile.role || 'Member',
        birth_date: profile.birth_date || '',
        twitter_url: profile.twitter_url || '',
        github_url: profile.github_url || '',
        website_url: profile.website_url || '',
      });
      if (profile.profile_picture_url) {
        setPreviewUrl(profile.profile_picture_url);
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Structure for nested user updates: first_name and last_name are at root in serializer for writing
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('bio', formData.bio);
    data.append('role', formData.role);
    data.append('twitter_url', formData.twitter_url);
    data.append('github_url', formData.github_url);
    data.append('website_url', formData.website_url);

    if (selectedFile) {
      data.append('profile_picture', selectedFile);
    }

    onSave(data);
  };

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div id="hs-edit-profile-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[100] overflow-x-hidden overflow-y-auto pointer-events-none">
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <form onSubmit={handleSubmit} className="w-full flex flex-col bg-white border shadow-sm rounded-3xl dark:bg-neutral-900 dark:border-neutral-800 pointer-events-auto overflow-hidden">
          <div className="flex justify-between items-center py-4 px-6 border-b dark:border-neutral-800">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">
              Edit Profile
            </h3>
            <button type="button" className="p-2 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700" data-hs-overlay="#hs-edit-profile-modal">
              <LuX className="size-4" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-y-4">
              <div className="relative group">
                <div className="relative size-28 rounded-3xl overflow-hidden border-4 border-gray-50 dark:border-neutral-800 shadow-md bg-white">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" sizes="112px" />
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                >
                  <LuCamera className="size-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Change</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB</p>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 dark:text-neutral-200">First Name</label>
                  <input 
                    type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                    className="w-full py-2.5 px-4 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-neutral-200"
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 dark:text-neutral-200">Last Name</label>
                  <input 
                    type="text" name="last_name" value={formData.last_name} onChange={handleChange}
                    className="w-full py-2.5 px-4 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-neutral-200"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 dark:text-neutral-200">Role / Headline</label>
                <input 
                  type="text" name="role" value={formData.role} onChange={handleChange}
                  className="w-full py-2.5 px-4 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-neutral-200"
                  placeholder="e.g. Senior Developer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 dark:text-neutral-200">About Bio</label>
                <textarea 
                  name="bio" value={formData.bio} onChange={handleChange}
                  className="w-full py-2.5 px-4 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-neutral-200 min-h-[100px]"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 dark:text-neutral-200">Twitter URL</label>
                  <input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleChange} className="w-full py-2.5 px-4 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://twitter.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 dark:text-neutral-200">GitHub URL</label>
                  <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="w-full py-2.5 px-4 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://github.com/..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 dark:text-neutral-200">Personal Website</label>
                <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} className="w-full py-2.5 px-4 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-x-2 py-4 px-6 border-t dark:border-neutral-800">
            <button type="button" className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800 transition-all" data-hs-overlay="#hs-edit-profile-modal">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="py-2.5 px-6 inline-flex items-center gap-x-2 text-sm font-bold rounded-xl border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/20 transition-all"
            >
              {isPending ? <LuLoader className="size-4 animate-spin" /> : <LuSave className="size-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
