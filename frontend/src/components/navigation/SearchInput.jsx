export default function SearchInput() {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
        <svg
          className="shrink-0 size-4 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <input
        type="text"
        className="py-2 ps-10 pe-16 block w-full bg-layer border-layer-line rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none"
        placeholder="Search"
      />
      <div className="hidden absolute inset-y-0 end-0 flex items-center z-20 pe-1">
        <button
          type="button"
          className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-muted-foreground-1 hover:text-primary-hover focus:outline-hidden focus:text-primary-focus"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </button>
      </div>
      <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-muted-foreground">
        <svg
          className="shrink-0 size-3 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        <span className="mx-1">
          <svg
            className="shrink-0 size-3 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </span>
        <span className="text-xs">/</span>
      </div>
    </div>
  );
}
