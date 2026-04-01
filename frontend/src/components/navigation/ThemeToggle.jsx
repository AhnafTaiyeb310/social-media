'use client';
import { useEffect, useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Sync React state with Preline's local storage value
    const savedTheme = localStorage.getItem('hs_theme') || 'default';
    setTheme(savedTheme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = (newTheme) => {
    const html = document.querySelector('html');

    if (newTheme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
      localStorage.setItem('hs_theme', 'dark');
      setTheme('dark');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
      localStorage.setItem('hs_theme', 'light');
      setTheme('light');
    }
  };

  return (
    <button
      type="button"
      onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
      className="block font-medium text-gray-800 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      <span className="group inline-flex shrink-0 justify-center items-center size-9">
        {theme === 'dark' ? (
          <LuMoon className="shrink-0 size-4" />
        ) : (
          <LuSun className="shrink-0 size-4" />
        )}
      </span>
    </button>
  );
}
