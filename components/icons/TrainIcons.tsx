interface IconProps {
  className?: string;
}

export function TrainIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M12 3v14" />
      <path d="M4 10h16" />
      <circle cx="8" cy="20" r="1" />
      <circle cx="16" cy="20" r="1" />
      <path d="M8 17l-2 3" />
      <path d="M16 17l2 3" />
    </svg>
  );
}

export function ThermometerIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

export function FuelIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17" />
      <path d="M3 22h12" />
      <path d="M7 8h4" />
      <path d="M15 12h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9l-3-3" />
    </svg>
  );
}

export function GaugeIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 12l3.5-3.5" />
      <path d="M20.3 18c.4-1 .7-2.2.7-3.4C21 9.1 16.9 5 12 5S3 9.1 3 14.6c0 1.2.3 2.4.7 3.4" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}
