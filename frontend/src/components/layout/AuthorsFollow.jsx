'use client';
import { LuChevronLeft, LuChevronRight, LuUsers } from 'react-icons/lu';
import Image from 'next/image';

export default function AuthorsFollow() {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-5 dark:bg-neutral-900 dark:border-neutral-800 shadow-sm">
      {/* 1. Header with Icon */}
      <div className="flex items-center gap-x-3 mb-6">
        <div className="inline-flex justify-center items-center size-8 bg-blue-50 rounded-lg dark:bg-blue-900/30">
          <LuUsers className="size-4 text-blue-600 dark:text-blue-500" />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-neutral-200">
          Authors worth following
        </h3>
      </div>

      {/* 2. Spaced Author List */}
      <div className="flex flex-col gap-y-6">
        {[
          {
            name: 'Syed Ahmer Shah',
            bio: "Hey, I'm Ahmer — a Software Engineering student...",
            posts: '1 post this month',
          },
          {
            name: 'Rakesh Darge',
            bio: 'Microsoft MVP (Business Applications)| Lifelong Learne...',
            posts: '2 posts this month',
          },
          {
            name: 'Shreyas Patil',
            bio: 'Google Developer Expert for Android | ❤️ All things...',
            posts: '1 post this month',
          },
        ].map((author, idx) => (
          <div key={idx} className="flex gap-x-3">
            <div className="relative size-8 flex-shrink-0">
              <Image
                className="rounded-full object-cover"
                src={`https://i.pravatar.cc/150?u=${idx}`}
                alt={author.name}
                fill
              />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 hover:text-blue-600 cursor-pointer transition">
                {author.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-neutral-500 line-clamp-2 leading-relaxed">
                {author.bio}
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center gap-x-1.5 py-1 px-2 rounded-full text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-400">
                  {author.posts}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Pagination Footer (Preline Pagination Style) */}
      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs text-gray-500">
        <button
          className="inline-flex items-center gap-x-1 hover:text-blue-600 disabled:opacity-50"
          disabled
        >
          <LuChevronLeft className="size-3" />
          Prev
        </button>
        <span className="font-medium text-gray-400">1 / 3</span>
        <button className="inline-flex items-center gap-x-1 hover:text-blue-600">
          Next
          <LuChevronRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
