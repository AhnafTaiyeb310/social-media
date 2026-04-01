'use client';
import { useState } from 'react';
import {
  LuImage,
  LuType,
  LuSettings,
  LuSearch,
  LuGlobe,
  LuLock,
  LuEllipsis,
} from 'react-icons/lu';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
      {/* 1. Profile & Visibility Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <img
            className="inline-block size-10 rounded-full"
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
            alt="User Avatar"
          />
          <div className="grow">
            <span className="block font-semibold text-gray-800 dark:text-neutral-200">
              Ahnaf
            </span>

            {/* Preline Dropdown for Visibility */}
            <div className="hs-dropdown relative inline-flex">
              <button
                id="hs-create-post-visibility"
                type="button"
                className="hs-dropdown-toggle py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {visibility === 'public' ? (
                  <LuGlobe className="size-3" />
                ) : (
                  <LuLock className="size-3" />
                )}
                <span className="capitalize">{visibility}</span>
                <svg
                  className="hs-dropdown-open:rotate-180 size-3 transition-transform"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-32 bg-white shadow-md rounded-lg p-1 dark:bg-neutral-900 dark:border dark:border-neutral-700"
                aria-labelledby="hs-create-post-visibility"
              >
                <button
                  onClick={() => setVisibility('public')}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  Public
                </button>
                <button
                  onClick={() => setVisibility('private')}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                >
                  Private
                </button>
              </div>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300">
          <LuEllipsis className="size-5" />
        </button>
      </div>

      {/* 2. Title & Content Area */}
      <div className="px-4 pb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title..."
          className="py-2 px-0 block w-full border-transparent bg-transparent text-lg font-bold placeholder:text-gray-400 focus:ring-0 focus:border-transparent dark:text-white dark:placeholder:text-neutral-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="py-2 px-0 block w-full border-transparent bg-transparent text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:border-transparent min-h-[120px] resize-none dark:text-neutral-300 dark:placeholder:text-neutral-500"
          placeholder="What's on your mind?"
        ></textarea>
      </div>

      {/* 3. Searchable Tag/Category Selection (Preline Combobox) */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-3 dark:border-neutral-700">
        <div
          className="relative"
          data-hs-combo-box='{
          "groupingType": "default",
          "isOpenOnFocus": true,
          "preventAutoPosition": false
        }'
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3.5">
              <LuSearch className="size-4 text-gray-400" />
            </div>
            <input
              className="py-2 ps-10 pe-4 block w-full bg-gray-50 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-500"
              type="text"
              placeholder="Select Category..."
              data-hs-combo-box-input=""
            />
          </div>

          {/* Combobox Dropdown Results */}
          <div
            className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 dark:bg-neutral-900 dark:border-neutral-700 overflow-hidden"
            style={{ display: 'none' }}
            data-hs-combo-box-output=""
          >
            <div
              className="max-h-48 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
              data-hs-combo-box-output-items-wrapper=""
            >
              {/* Example Category Items */}
              <div
                className="cursor-pointer py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                data-hs-combo-box-output-item='{"value": "tech", "label": "Technology"}'
              >
                Technology
              </div>
              <div
                className="cursor-pointer py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                data-hs-combo-box-output-item='{"value": "lifestyle", "label": "Lifestyle"}'
              >
                Lifestyle
              </div>
              <div
                className="cursor-pointer py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                data-hs-combo-box-output-item='{"value": "coding", "label": "Coding"}'
              >
                Coding
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Footer */}
      <div className="p-3 bg-gray-50 flex items-center justify-between rounded-b-xl border-t border-gray-200 dark:bg-neutral-800/50 dark:border-neutral-700">
        <div className="flex items-center gap-x-1">
          <button
            type="button"
            title="Add Image"
            className="p-2 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            <LuImage className="size-5" />
          </button>
          <button
            type="button"
            title="Text Formatting"
            className="p-2 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            <LuType className="size-5" />
          </button>
          <button
            type="button"
            title="Post Settings"
            className="p-2 inline-flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
          >
            <LuSettings className="size-5" />
          </button>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
          >
            Save Draft
          </button>
          <button
            type="button"
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
