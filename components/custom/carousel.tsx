"use client";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogContent } from "./dialog";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [validImages, setValidImages] = useState<string[]>(images);

  const totalSlides = validImages.length;

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const handleImageClick = (image: string) => {
    setZoomedImage(image);
  };

  const handleImageError = (image: string) => {
    // Filter out the invalid image from the list
    setValidImages((prevImages) => prevImages.filter((img) => img !== image));
  };

  return (
    <div className="relative w-full" data-carousel="slide">
      {/* Carousel Images */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {validImages.map((image, index) => (
          <Dialog key={uuidv4()}>
            <DialogTrigger asChild>
              <div
                className={`${activeIndex === index ? "block" : "hidden"} duration-700 ease-in-out`}
                data-carousel-item
              >
                <Image
                  src={image}
                  alt={`Slide ${index + 1}`}
                  width={500}
                  height={500}
                  className="absolute left-1/2 top-1/2 block aspect-[3/4] size-full -translate-x-1/2 -translate-y-1/2 scale-100 cursor-pointer object-cover blur-0 grayscale-0 transition-all hover:scale-105"
                  onClick={() => handleImageClick(image)} // Trigger zoom on click
                  onError={() => handleImageError(image)} // Handle image loading errors
                />
              </div>
            </DialogTrigger>
            <DialogContent className="bg-transparent p-0 sm:max-w-[425px]">
              {zoomedImage === image && (
                <Image
                  src={image}
                  alt="Zoomed Image"
                  width={1000}
                  height={1000}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
        {validImages.map((_, index) => (
          <button
            key={uuidv4()}
            type="button"
            className={`size-3 rounded-full ${activeIndex === index ? "bg-gray-500" : "bg-light-4"}`}
            aria-current={activeIndex === index ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>

      {/* Previous Button */}
      {validImages.length > 1 && (
        <button
          type="button"
          className="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
          onClick={prevSlide}
          data-carousel-prev
        >
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
            <svg
              className="size-4 text-light-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
      )}

      {/* Next Button */}
      {validImages.length > 1 && (
        <button
          type="button"
          className="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
          onClick={nextSlide}
          data-carousel-next
        >
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
            <svg
              className="size-4 text-light-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default Carousel;
