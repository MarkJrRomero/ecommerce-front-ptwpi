import { useState, useEffect } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

const DEFAULT_IMAGE = "https://sublimac.com/wp-content/uploads/2017/11/default-placeholder.png";

function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(DEFAULT_IMAGE);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}

export default ProductImage;

