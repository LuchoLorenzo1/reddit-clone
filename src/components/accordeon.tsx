"use client";

import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function DefaultCarousel() {
  return (
    <Carousel>
      <Image
        alt="..."
        width="600"
        height="600"
        src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
      />
      <Image
        alt="..."
        width="600"
        height="600"
        src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
      />

      <Image
        alt="..."
        width="600"
        height="600"
        src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
      />
    </Carousel>
  );
}
