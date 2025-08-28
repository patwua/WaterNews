import * as React from 'react';

export const SkeletonLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="border rounded-xl p-4">
    <SkeletonLine className="h-5 w-1/3 mb-3" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLine key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'} mb-2`} />
    ))}
  </div>
);

export const SkeletonCardGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid md:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTiles: React.FC<{ rows?: number }> = ({ rows = 8 }) => (
  <ul className="divide-y rounded-xl border">
    {Array.from({ length: rows }).map((_, i) => (
      <li key={i} className="p-4">
        <SkeletonLine className="h-5 w-1/2 mb-2" />
        <SkeletonLine className="h-4 w-1/4" />
      </li>
    ))}
  </ul>
);

export const SkeletonMediaGrid: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border rounded overflow-hidden">
        <div className="animate-pulse bg-gray-200 w-full h-32" />
      </div>
    ))}
  </div>
);
