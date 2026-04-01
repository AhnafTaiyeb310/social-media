'use client';
import { useEffect } from 'react';

export default function SearchModal() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();

        // Look for the global Preline objects we attached in PrelineScript
        const { HSOverlay, HSComboBox } = window;

        if (!HSOverlay) {
          console.warn('Preline HSOverlay not found on window');
          return;
        }

        const modalEl = document.querySelector('#search-modal');
        if (modalEl) {
          // Open the modal
          HSOverlay.open(modalEl);

          // Focus the input inside the modal
          setTimeout(() => {
            const input = modalEl.querySelector('input');
            if (input) input.focus();
          }, 100);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      id="search-modal"
      className="hs-overlay hidden size-full fixed top-0 start-0 z-[100] overflow-x-hidden overflow-y-auto pointer-events-none bg-black/50"
    >
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700">
          <div className="p-4">
            <input
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
              type="text"
              placeholder="Search..."
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
