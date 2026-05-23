interface AdUnitProps {
  slot?: string;
  className?: string;
}

export default function AdUnit({ slot, className = "" }: AdUnitProps) {
  return (
    <aside
      className={`my-6 flex min-h-[250px] items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 ${className}`}
      aria-label="広告"
      data-ad-slot={slot}
    >
      広告枠
    </aside>
  );
}
