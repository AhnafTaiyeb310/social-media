export default function Logo() {
  return (
    <div className="flex items-center gap-l-2 ">
      {/* Stylized 'S' Icon */}
      <svg
        className="w-8 h-8 text-primary"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 10.5C24 7.46243 21.5376 5 18.5 5H13.5C10.4624 5 8 7.46243 8 10.5C8 13.5376 10.4624 16 13.5 16H18.5C21.5376 16 24 18.4624 24 21.5C24 24.5376 21.5376 27 18.5 27H13.5C10.4624 27 8 24.5376 8 21.5"
          className="stroke-primary"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="16"
          cy="16"
          r="2"
          className="fill-primary"
          fill="currentColor"
        />
      </svg>
      
      {/* Brand Text */}
      <span className="text-xl font-blue-400 tracking-tighter text-foreground">
        y n c
      </span>
    </div>
  );
}
