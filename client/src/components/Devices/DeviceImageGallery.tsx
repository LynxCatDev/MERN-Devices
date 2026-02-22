'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkImageUrl } from '@/helpers';

import './DeviceImageGallery.scss';

interface DeviceImageGalleryProps {
  deviceName: string;
  images?: string[];
}

const PLACEHOLDER_IMAGE = '/images/placeholder.webp';

const normalizeImagePath = (image: string) => {
  if (!image) {
    return '';
  }

  if (image === PLACEHOLDER_IMAGE) {
    return PLACEHOLDER_IMAGE;
  }

  return checkImageUrl(image);
};

export const DeviceImageGallery = ({
  deviceName,
  images = [],
}: DeviceImageGalleryProps) => {
  const preparedImages = useMemo(() => {
    const normalizedImages = images
      .filter((image): image is string => Boolean(image))
      .map(normalizeImagePath)
      .filter((image) => Boolean(image));

    const uniqueImages = Array.from(new Set(normalizedImages));

    if (!uniqueImages.length) {
      return [PLACEHOLDER_IMAGE];
    }

    return uniqueImages;
  }, [images]);

  const [galleryImages, setGalleryImages] = useState<string[]>(preparedImages);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    setGalleryImages(preparedImages);
    setActiveImageIndex(0);
  }, [preparedImages]);

  const totalImages = galleryImages.length;
  const hasMultipleImages = totalImages > 1;

  const goToImage = useCallback(
    (index: number) => {
      if (!totalImages) {
        return;
      }

      const boundedIndex = (index + totalImages) % totalImages;
      setActiveImageIndex(boundedIndex);
    },
    [totalImages],
  );

  const goToPreviousImage = useCallback(() => {
    goToImage(activeImageIndex - 1);
  }, [activeImageIndex, goToImage]);

  const goToNextImage = useCallback(() => {
    goToImage(activeImageIndex + 1);
  }, [activeImageIndex, goToImage]);

  const handleImageError = useCallback((index: number) => {
    setGalleryImages((currentImages) =>
      currentImages.map((image, currentIndex) =>
        currentIndex === index ? PLACEHOLDER_IMAGE : image,
      ),
    );
  }, []);

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsZoomOpen(false);
      }

      if (event.key === 'ArrowLeft') {
        goToPreviousImage();
      }

      if (event.key === 'ArrowRight') {
        goToNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyboardEvent);
    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [goToNextImage, goToPreviousImage, isZoomOpen]);

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isZoomOpen]);

  const activeImage = galleryImages[activeImageIndex] || PLACEHOLDER_IMAGE;

  return (
    <div className="device-gallery">
      <div className="device-gallery__main">
        <button
          type="button"
          className="device-gallery__image-button"
          onClick={() => setIsZoomOpen(true)}
          aria-label={`Open ${deviceName} image in zoom`}
        >
          <Image
            src={activeImage}
            alt={`${deviceName} image ${activeImageIndex + 1}`}
            width={960}
            height={960}
            sizes="(max-width: 992px) 100vw, 45vw"
            priority
            onError={() => handleImageError(activeImageIndex)}
          />
        </button>
        <span className="device-gallery__counter" aria-live="polite">
          {activeImageIndex + 1} / {totalImages}
        </span>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="device-gallery__nav-button device-gallery__nav-button--prev"
              onClick={goToPreviousImage}
              aria-label="Show previous image"
            >
              &#8249;
            </button>
            <button
              type="button"
              className="device-gallery__nav-button device-gallery__nav-button--next"
              onClick={goToNextImage}
              aria-label="Show next image"
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="device-gallery__thumbnails">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`device-gallery__thumbnail ${
                index === activeImageIndex ? 'is-active' : ''
              }`}
              onClick={() => goToImage(index)}
              aria-label={`Select image ${index + 1}`}
              aria-current={index === activeImageIndex}
            >
              <Image
                src={image}
                alt={`${deviceName} thumbnail ${index + 1}`}
                width={120}
                height={120}
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}

      {isZoomOpen && (
        <div
          className="device-gallery__zoom-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${deviceName} image zoom`}
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            type="button"
            className="device-gallery__zoom-close"
            aria-label="Close zoom"
            onClick={() => setIsZoomOpen(false)}
          >
            &times;
          </button>
          <span className="device-gallery__zoom-counter" aria-live="polite">
            {activeImageIndex + 1} / {totalImages}
          </span>

          {hasMultipleImages && (
            <button
              type="button"
              className="device-gallery__zoom-nav device-gallery__zoom-nav--prev"
              onClick={(event) => {
                event.stopPropagation();
                goToPreviousImage();
              }}
              aria-label="Show previous zoomed image"
            >
              &#8249;
            </button>
          )}

          <div
            className="device-gallery__zoom-image-wrapper"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={`${deviceName} zoomed image ${activeImageIndex + 1}`}
              width={1400}
              height={1400}
              sizes="90vw"
              onError={() => handleImageError(activeImageIndex)}
            />
          </div>

          {hasMultipleImages && (
            <button
              type="button"
              className="device-gallery__zoom-nav device-gallery__zoom-nav--next"
              onClick={(event) => {
                event.stopPropagation();
                goToNextImage();
              }}
              aria-label="Show next zoomed image"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </div>
  );
};
