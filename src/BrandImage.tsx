import React from "react";

type BrandImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  badge?: string;
  objectPosition?: string;
  loading?: "lazy" | "eager";
  zoom?: boolean;
  overlay?: boolean;
};

export function BrandImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  badge,
  objectPosition = "center",
  loading = "lazy",
  zoom = true,
  overlay = true,
}: BrandImageProps) {
  return (
    <div className={`brand-image-wrap ${zoom ? "brand-image-wrap--zoom" : ""} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`brand-image ${imageClassName}`}
        style={{ objectPosition }}
      />
      {overlay ? <div className="brand-image-overlay" aria-hidden="true" /> : null}
      {badge ? <span className="brand-image-badge">{badge}</span> : null}
    </div>
  );
}
