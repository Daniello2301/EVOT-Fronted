const TONES = {
  success: 'bg-green-50 text-green-800 ring-green-600/20',
  warning: 'bg-amber-50 text-amber-800 ring-amber-600/25',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-blue-50 text-blue_primary ring-blue_primary/20',
  neutral: 'bg-gray-100 text-gray-700 ring-gray-500/20'
};

const DOTS = {
  success: 'bg-green-600',
  warning: 'bg-amber-500',
  danger: 'bg-red-600',
  info: 'bg-blue_primary',
  neutral: 'bg-gray-500'
};

/** Insignia de estado: color + texto (el color nunca va solo). */
export default function StatusBadge({ label, tone = 'neutral' }) {
  const key = TONES[tone] ? tone : 'neutral';
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONES[key]}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOTS[key]}`} />
      {label}
    </span>
  );
}
