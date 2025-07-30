"use client";

import { useState, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface LazyProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: LazyProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden">
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <ImageIcon className="w-12 h-12 mb-2" />
          <span className="text-sm">Imagem não disponível</span>
          <span className="text-xs text-red-500 mt-1">
            Erro no carregamento
          </span>
        </div>
      )}

      <img
        ref={imgRef}
        src={src || "/placeholder.svg"}
        alt={alt}
        loading="lazy"
        className={cn(
          "transition-opacity duration-300 shimmer",
          className,
          isLoading || hasError ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
