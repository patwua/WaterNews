import React from "react";
import { withCloudinaryAuto } from "@/lib/media";

export default function BrandLogo({ size = 28, className = "", title = "WaterNews" }) {
  return (
    <img
      src={withCloudinaryAuto(
        "https://res.cloudinary.com/dpdhi4joq/image/upload/v1755962658/logo-mini_uhsj21.png"
      )}
      alt={title}
      width={size}
      height={size}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
