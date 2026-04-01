'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    const initPreline = async () => {
      // 1. Import the library
      const preline = await import('preline/dist/preline.js');

      // 2. Manually attach to window if not already there
      window.HSStaticMethods = preline.HSStaticMethods;
      window.HSOverlay = preline.HSOverlay;
      window.HSComboBox = preline.HSComboBox;

      // 3. Initialize everything on the page
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    };

    initPreline();
  }, [path]);

  return null;
}
