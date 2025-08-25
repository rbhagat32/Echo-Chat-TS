import { useState } from "react";

export const ImageWithSkeleton = ({
  src,
  alt,
  onLoadCallback,
}: {
  src: string;
  alt: string;
  onLoadCallback?: () => void;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <div className="relative flex max-h-64 w-full items-center justify-center">
      {!loaded && <div className="h-64 w-80 animate-pulse rounded-md bg-zinc-700" />}
      <img
        src={src}
        alt={alt}
        className={`max-h-64 cursor-pointer rounded-md object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "absolute opacity-0"
        }`}
        onClick={() => window.open(src, "_blank")}
        onLoad={() => {
          setLoaded(true);
          onLoadCallback?.();
        }}
      />
    </div>
  );
};
