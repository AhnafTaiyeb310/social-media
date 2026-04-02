'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    const initPreline = async () => {
      try {
        // 1. Import the library
        const preline = await import('preline/dist/preline.js');

        // 2. Manually attach to window if not already there
        window.HSStaticMethods = preline.HSStaticMethods;
        window.HSOverlay = preline.HSOverlay;
        window.HSComboBox = preline.HSComboBox;

        // 3. Initialize everything on the page with a small delay to ensure DOM is ready
        setTimeout(() => {
          if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
            window.HSStaticMethods.autoInit();
          }
        }, 100);
      } catch (error) {
        console.error('Preline initialization error:', error);
      }
    };

    initPreline();
  }, [path]);

  return null;
}
