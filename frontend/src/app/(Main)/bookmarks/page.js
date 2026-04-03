'use client';
import { FaRegBookmark } from 'react-icons/fa6';

export default function BookmarksPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-20 bg-purple-50 dark:bg-purple-900/30 rounded-full mb-4">
          <FaRegBookmark className="size-10 text-purple-600 dark:text-purple-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Bookmarks
        </h1>
        <p className="text-gray-500 dark:text-neutral-500 max-w-sm mx-auto">
          Save your favorite posts to read them later. This feature is coming soon!
        </p>
      </div>
    </div>
  );
}
