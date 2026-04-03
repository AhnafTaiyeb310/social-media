'use client';
import { useRouter } from 'next/navigation';
import { LuSearch, LuCommand } from 'react-icons/lu';

export default function SearchInput() {
  const router = useRouter();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  const handleClick = () => {
    // Dispatch a custom event that SearchModal listens to
    window.dispatchEvent(new CustomEvent('open-aura-search'));
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
        <LuSearch className="shrink-0 size-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <input
        readOnly // Input is just a trigger for the modal
        type="text"
        onKeyDown={handleKeyDown}
        className="py-2 ps-10 pe-16 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground placeholder:text-muted-foreground group-hover:border-primary/50 transition-all cursor-pointer"
        placeholder="Search (Ctrl + K)"
      />
      <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-muted-foreground">
        <kbd className="inline-flex items-center gap-x-1 px-1.5 py-0.5 border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 rounded-md text-[10px] font-bold text-gray-400">
          <LuCommand className="size-2.5" /> K
        </kbd>
      </div>
    </div>
  );
}
