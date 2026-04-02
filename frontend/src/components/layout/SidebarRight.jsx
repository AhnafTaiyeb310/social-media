'use client';
import {
  LuPlus,
  LuTrendingUp,
  LuUsers,
  LuMessageSquare,
  LuBadgeCheck,
} from 'react-icons/lu';
import AuthorsFollow from './AuthorsFollow';

export default function RightSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-full hidden lg:block overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-y-4 p-4">
        {/* 1. Bento: Authors Worth Following */}
        <AuthorsFollow />

        {/* 2. Bento: Trending Tags */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 dark:bg-neutral-900 dark:border-neutral-800">
          <div className="flex items-center gap-x-2 mb-4">
            <LuTrendingUp className="size-4 text-blue-600" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase dark:text-neutral-500">
              Trending this week
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              '#nextjs15',
              '#django',
              '#tailwindcss',
              '#aura',
              '#webdev',
              '#python',
            ].map((tag) => (
              <a
                key={tag}
                href="#"
                className="py-1.5 px-3 rounded-lg bg-gray-100 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 transition"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>

        {/* 3. Bento: Trending Forums */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-4 dark:bg-neutral-900 dark:border-neutral-800">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 dark:text-neutral-500">
            Trending Forums
          </h3>
          <ul className="space-y-3">
            <li>
              <a className="group flex flex-col gap-y-1" href="#">
                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-500">
                  Next.js 15 Optimizations
                </span>
                <span className="text-xs text-gray-500">
                  1.2k members · 42 posts today
                </span>
              </a>
            </li>
            <li>
              <a className="group flex flex-col gap-y-1" href="#">
                <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-500">
                  Django 6.0 Discussion
                </span>
                <span className="text-xs text-gray-500">
                  850 members · 12 posts today
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* 4. Bento: Join the Forums CTA */}
        <div className="relative overflow-hidden bg-blue-600 rounded-xl p-5 dark:bg-blue-700">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">
              Build your community
            </h3>
            <p className="text-sm text-blue-100 mb-4">
              Create a forum and start sharing knowledge with fellow engineers
              in Bangladesh.
            </p>
            <button className="py-2 px-4 w-full inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-blue-600 hover:bg-gray-50 shadow-sm transition">
              <LuMessageSquare className="size-4" /> Start a Forum
            </button>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -top-12 -end-12 size-32 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Footer Links */}
        <div className="px-4 py-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-neutral-600">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Cookies
          </a>
          <span>© 2026 Aura Inc.</span>
        </div>
      </div>
    </aside>
  );
}
