'use client';
import { LuBell } from 'react-icons/lu';

export default function NotificationsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-20 bg-yellow-50 dark:bg-yellow-900/30 rounded-full mb-4">
          <LuBell className="size-10 text-yellow-600 dark:text-yellow-400 animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Notifications
        </h1>
        <p className="text-gray-500 dark:text-neutral-500 max-w-sm mx-auto">
          Stay updated with likes, comments, and new followers. This feature is coming soon!
        </p>
      </div>
    </div>
  );
}
