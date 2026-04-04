// app/search/page.js

import { connection } from 'next/server';
import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default async function Page() {
  await connection(); 

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400 animate-pulse">
          Initializing Aura Search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
