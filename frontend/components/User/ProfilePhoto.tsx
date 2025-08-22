import React from "react";
type Props = {
  name: string;
  url?: string | null;
  size?: number;             // px
  isVerified?: boolean;
  isOrganization?: boolean;  // renders square if true
  className?: string;
};

function initials(name: string) {
  const parts = (name || "").trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join("") || "?";
}

export default function ProfilePhoto({
  name, url, size = 48, isVerified = false, isOrganization = false, className = "",
}: Props) {
  const dim = { width: size, height: size };
  const shape = isOrganization ? "rounded-lg" : "rounded-full";
  const alt = isOrganization ? `${name} logo` : `Photo of ${name}`;

  return (
    <div className={`relative inline-block ${className}`} style={dim} aria-label={alt}>
      {url ? (
        <img
          src={url}
          alt={alt}
          width={size}
          height={size}
          className={`${shape} object-cover w-full h-full`}
          loading="lazy"
        />
      ) : (
        <div
          className={`${shape} bg-gray-200 text-gray-700 grid place-items-center font-semibold`}
          style={dim}
          aria-hidden="true"
        >
          {initials(name)}
        </div>
      )}

      {isVerified && (
        <span
          className="absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full bg-white"
          style={{ width: Math.max(16, size * 0.33), height: Math.max(16, size * 0.33) }}
          aria-label="Verified"
          title="Verified"
        >
          {/* checkmark */}
          <svg viewBox="0 0 24 24" className="text-blue-600" style={{ width: "70%", height: "70%" }}>
            <path fill="currentColor" d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z"/>
          </svg>
        </span>
      )}
    </div>
  );
}
