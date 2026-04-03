'use client';
import Logo from "../navigation/Logo";
import SearchInput from "../navigation/SearchInput";
import { LuBell, LuActivity, LuUser, LuSettings, LuLogOut, LuSearch } from 'react-icons/lu';
import ThemeToggle from "../navigation/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function Header() {
  const { user, logout } = useAuthStore();

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-aura-search'));
  };

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 w-full bg-navbar border-b border-navbar-line text-sm py-2.5 lg:ps-65">
      <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div className="me-5 lg:me-0 lg:hidden">
          <Link href="/" className="flex-none rounded-md focus:outline-hidden focus:opacity-80">
            <Logo />
          </Link>
        </div>

        <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
          <div className="hidden md:block">
            <SearchInput />
          </div>

          <div className="flex flex-row items-center justify-end gap-1">
            {/* Mobile Search Trigger */}
            <button
              onClick={handleSearchClick}
              type="button"
              className="md:hidden size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-foreground hover:bg-muted-hover focus:outline-hidden focus:bg-muted-focus disabled:opacity-50 disabled:pointer-events-none"
            >
              <LuSearch className="shrink-0 size-4" />
              <span className="sr-only">Search</span>
            </button>

            <Link
              href="/notifications"
              className="size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-foreground hover:bg-muted-hover focus:outline-hidden focus:bg-muted-focus"
            >
              <LuBell className="shrink-0 size-4" />
              <span className="sr-only">Notifications</span>
            </Link>

            <button
              type="button"
              className="size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-foreground hover:bg-muted-hover focus:outline-hidden focus:bg-muted-focus"
            >
              <LuActivity className="shrink-0 size-4" />
              <span className="sr-only">Activity</span>
            </button>

            {/* Dropdown */}
            <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
              <button
                id="hs-dropdown-account"
                type="button"
                className="size-9.5 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-foreground focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label="Dropdown"
              >
                <Image
                  className="shrink-0 size-9.5 rounded-full object-cover"
                  src={user?.profile_picture_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                  alt="Avatar"
                  width={38}
                  height={38}
                />
              </button>

              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-dropdown border border-dropdown-line shadow-md rounded-lg mt-2 p-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-account"
              >
                <div className="py-3 px-5 bg-surface rounded-t-lg border-b border-dropdown-line mb-1">
                  <p className="text-sm text-muted-foreground-1 font-medium">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-foreground truncate">
                    {user?.email || 'guest@site.com'}
                  </p>
                </div>
                
                <Link
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-dropdown-item-foreground hover:bg-dropdown-item-hover focus:bg-dropdown-item-focus"
                  href="/profile/me"
                >
                  <LuUser className="shrink-0 size-4" />
                  My Profile
                </Link>
                
                <button
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-dropdown-item-foreground hover:bg-dropdown-item-hover focus:bg-dropdown-item-focus text-left"
                >
                  <LuSettings className="shrink-0 size-4" />
                  Settings
                </button>

                <div className="my-1 border-t border-dropdown-line"></div>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-hidden text-left"
                >
                  <LuLogOut className="shrink-0 size-4" />
                  Sign out
                </button>
              </div>
            </div>
            {/* End Dropdown */}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
