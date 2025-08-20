import React from "react";
export default function BrandLogo({ size = 28, className = "", title = "WaterNews" }) {
  return (
    <img
      src="/logo-mini.svg"
      alt={title}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
