'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImage {
    id: string;
    imageUrl: string | null;
}

interface ProductImageGalleryProps {
    images: ProductImage[];
    productName: string;
}

export function ProductImageGallery({ images, productName, compact = false }: ProductImageGalleryProps & { compact?: boolean }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Filter out images with null URLs
    const validImages = images.filter(img => img.imageUrl);

    // If no valid images, show placeholder
    if (validImages.length === 0) {
        return (
            <div className={`relative ${compact ? 'aspect-[4/3] max-w-2xl mx-auto' : 'aspect-square'} w-full overflow-hidden rounded-lg bg-gray-100`}>
                <div className="flex h-full items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                </div>
            </div>
        );
    }

    const currentImage = validImages[selectedIndex];

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className={`relative ${compact ? 'aspect-[4/3] max-w-2xl mx-auto' : 'aspect-square'} w-full overflow-hidden rounded-lg bg-gray-100`}>
                <Image
                    src={currentImage.imageUrl || '/images/placeholder-image.jpg'}
                    alt={`${productName} - Gambar ${selectedIndex + 1}`}
                    fill
                    className="object-cover"
                    priority={selectedIndex === 0}
                    sizes={compact ? "(max-width: 768px) 100vw, 672px" : "(max-width: 768px) 100vw, 50vw"}
                />

                {/* Navigation Arrows - Only show if more than 1 image */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition hover:bg-white"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition hover:bg-white"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {validImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                        {selectedIndex + 1} / {validImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Grid - Only show if more than 1 image */}
            {validImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {validImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative aspect-square overflow-hidden rounded-md transition ${selectedIndex === index
                                ? 'ring-2 ring-primary ring-offset-2'
                                : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={image.imageUrl || '/images/placeholder-image.jpg'}
                                alt={`${productName} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 25vw, 12vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}