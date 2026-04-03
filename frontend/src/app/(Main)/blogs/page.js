'use client';
import { LuBookOpen } from 'react-icons/lu';

export default function BlogsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-20 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
          <LuBookOpen className="size-10 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Blogs
        </h1>
        <p className="text-gray-500 dark:text-neutral-500 max-w-sm mx-auto">
          We're building a new way to explore long-form stories. This feature is coming soon!
        </p>
      </div>
    </div>
  );
}
