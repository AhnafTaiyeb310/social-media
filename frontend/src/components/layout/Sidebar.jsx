'use client';
import { FaBookBookmark } from 'react-icons/fa6';
import { FaRegBookmark } from 'react-icons/fa6';
import { FaBook } from 'react-icons/fa6';
import {
  LuBookOpen,
  LuNotebookPen,
  LuNotepadTextDashed,
  LuCopyCheck,
  LuBell,
  LuHouse,
  LuSearch,
} from 'react-icons/lu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../navigation/Logo';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: LuHouse },
    { label: 'Search', href: '/search', icon: LuSearch },
    { label: 'Blogs', href: '/blogs', icon: LuBookOpen },
    { label: 'Bookmarks', href: '/bookmarks', icon: FaRegBookmark },
  ];

  const authorItems = [
    { label: 'Write', href: '/', icon: LuNotebookPen }, // Assuming Home has the create post form
    { label: 'Drafts', href: '/drafts', icon: LuNotepadTextDashed },
    { label: 'Submissions', href: '#', icon: LuCopyCheck },
  ];

  const getItemClass = (href) => {
    const isActive = pathname === href;
    return `flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg transition-colors ${
      isActive 
        ? 'bg-sidebar-nav-active text-sidebar-nav-foreground font-semibold' 
        : 'text-sidebar-nav-foreground hover:bg-sidebar-nav-hover focus:outline-hidden focus:bg-sidebar-nav-focus'
    }`;
  };

  return (
    <div
      id="hs-application-sidebar"
      className="hs-overlay  [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-65 h-full hidden fixed inset-y-0 start-0 z-60 bg-sidebar border-e border-sidebar-line lg:block lg:translate-x-0 lg:end-auto lg:bottom-0"
      role="dialog"
      tabIndex="-1"
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col h-full max-h-full">
        <div className="px-6 pt-4 flex items-center">
          <Link
            className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
            href="/"
            aria-label="Preline"
          >
            <Logo />
          </Link>
          <div className="hidden lg:block ms-2"></div>
        </div>

        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb">
          <nav className="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
            <ul className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link className={getItemClass(item.href)} href={item.href}>
                    <item.icon className="shrink-0 size-4" />
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="hs-accordion" id="account-accordion">
                <button type="button" className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-sidebar-nav-foreground rounded-lg hover:bg-sidebar-nav-hover focus:outline-hidden focus:bg-sidebar-nav-focus" aria-expanded="true" aria-controls="account-accordion-child">
                  <svg className="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="15" r="3" /><circle cx="9" cy="7" r="4" /><path d="M10 15H6a4 4 0 0 0-4 4v2" /><path d="m21.7 16.4-.9-.3" /><path d="m15.2 13.9-.9-.3" /><path d="m16.6 18.7.3-.9" /><path d="m19.1 12.2.3-.9" /><path d="m19.6 18.7-.4-1" /><path d="m16.8 12.3-.4-1" /><path d="m14.3 16.6 1-.4" /><path d="m20.7 13.8 1-.4" /></svg>
                  Author
                  <svg className="hs-accordion-active:block ms-auto hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                  <svg className="hs-accordion-active:hidden ms-auto block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </button>

                <div id="account-accordion-child" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="account-accordion">
                  <ul className="ps-8 pt-1 space-y-1">
                    {authorItems.map((item) => (
                      <li key={item.label}>
                        <Link className={getItemClass(item.href)} href={item.href}>
                          <item.icon className="shrink-0 size-4" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              <li>
                <Link className={getItemClass('/notifications')} href="/notifications">
                  <LuBell className="shrink-0 size-4" />
                  Notifications
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
