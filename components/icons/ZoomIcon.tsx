interface ZoomIconProps {
  className?: string;
}

export function ZoomIcon({ className = 'w-6 h-6' }: ZoomIconProps) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
      />
    </svg>
  );
}
