"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function Carousel2({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [validImages, setValidImages] = useState<string[]>(images);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleItemClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
    imgRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleImageError = (index: number) => {
    const updatedImages = [...validImages];
    updatedImages.splice(index, 1);
    setValidImages(updatedImages);
  };

  return (
    <section className="pt-4">
      <div className="flex snap-x snap-mandatory space-x-4 overflow-x-auto">
        {validImages.length === 1 ? (
          <Image
            key={uuidv4()}
            width={250}
            height={400}
            className="relative mb-4 h-auto cursor-pointer rounded-xl bg-cover bg-center transition-all duration-300 ease-in-out"
            src={validImages[0]}
            alt="thread feature"
            onError={() => handleImageError(0)}
            onClick={() => handleItemClick(0)}
          />
        ) : (
          validImages.map((image, index) => (
            <Image
              key={uuidv4()}
              width={250}
              height={400}
              ref={(el) => (imgRefs.current[index] = el)}
              className={`relative mb-10 h-auto max-h-[400px] cursor-pointer rounded-xl bg-cover bg-center transition-all duration-300 ease-in-out
              ${activeIndex === index ? "shadow-xl" : ""}`}
              src={image}
              alt="thread feature"
              onError={() => handleImageError(index)}
              onClick={() => handleItemClick(index)}
            />
          ))
        )}
      </div>
    </section>
  );
}
