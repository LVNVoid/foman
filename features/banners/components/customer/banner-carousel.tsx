'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/app/generated/prisma/client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export function BannerCarousel({ banners }: { banners: Banner[] }) {
    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="w-full mb-8">
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                className="w-full"
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id}>
                            <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-lg shadow-md">
                                {banner.link ? (
                                    <Link href={banner.link} className="relative block w-full h-full">
                                        <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover hover:scale-105 transition-transform duration-500 " loading="eager" />
                                    </Link>
                                ) : (
                                    <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover hover:scale-105 transition-transform duration-500" loading="eager" />
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>
    );
}
