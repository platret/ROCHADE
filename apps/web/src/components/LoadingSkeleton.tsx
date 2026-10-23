const widths = ['w-1/3', 'w-2/3', 'w-1/2']

export const LoadingSkeleton = () => (
  <div className="space-y-3" role="status" aria-label="Daten werden geladen">
    {widths.map((width) => (
      <div key={width} className={`h-6 animate-pulse rounded-sm bg-surface-sunken ${width}`} />
    ))}
  </div>
)
