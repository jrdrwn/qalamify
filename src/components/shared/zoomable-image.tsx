import Image from 'next/image';
import React, { useState } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
}) => {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <>
        <Image
          onClick={() => setZoomed(true)}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      </>
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-background/80"
          onClick={() => setZoomed(false)}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-full w-full scale-105 rounded-lg object-contain shadow-2xl transition-transform duration-200"
          />
        </div>
      )}
    </>
  );
};

export default ZoomableImage;
