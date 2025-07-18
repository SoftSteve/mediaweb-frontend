import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/zoom";

function getAspectClass(width, height) {
  if (!width || !height) return "aspect-[4/5]";

  const ratio = width / height;

  if (ratio > 1.91) return "aspect-[1.91/1]";
  if (ratio < 0.8) return "aspect-[4/5]";
  return "aspect-[4/5]";
}

export default function AboutPage() {
  const [aspectClass, setAspectClass] = useState("aspect-square");
  const swiperRef = useRef(null);

  const dummyImages = [
    { id: 1, image: "wedding.jpg" },
    { id: 2, image: "brosis.JPEG" },
    { id: 3, image: "final-logo.png" },
    { id: 4, image: "raven.jpg" },
    { id: 5, image: "bean.jpg" },
  ];

  useEffect(() => {
    const img = new Image();
    img.src = dummyImages[0].image;
    img.onload = () => {
      console.log("Loaded image size:", img.width, "x", img.height);
      const aspect = getAspectClass(img.width, img.height);
      console.log("Determined aspect class:", aspect);
      setAspectClass(aspect);
    };
  }, []);

  useEffect(() => {
    function logSizes() {
      if (!swiperRef.current) return;

      const swiperEl = swiperRef.current;
      console.log("Swiper container size:", swiperEl.offsetWidth, "x", swiperEl.offsetHeight);

      const slides = swiperEl.querySelectorAll(".swiper-slide");
      slides.forEach((slide, i) => {
        console.log(`Slide ${i} size:`, slide.offsetWidth, "x", slide.offsetHeight);
      });
    }

    logSizes();
    window.addEventListener("resize", logSizes);
    return () => window.removeEventListener("resize", logSizes);
  }, [aspectClass]);

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center">
      <Swiper
        ref={swiperRef}
        modules={[Pagination, Zoom]}
        zoom
        slidesPerView={1}
        className={`${aspectClass} w-full overflow-hidden md:rounded-md md:border border-gray-300 md:border-0`}
        pagination={{ clickable: true, type: "bullets", dynamicBullets: true }}
      >
        {dummyImages.map((img, i) => (
          <SwiperSlide key={img.id} className="relative w-full h-full">
            {/* Background Blur */}
            <img
              src={img.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-fill blur-lg scale-100 opacity-40 z-0"
            />

            {/* Foreground Image with border and centered container */}
            <div className="swiper-zoom-container relative z-10 h-full w-full flex items-center justify-center">
              <img
                loading="lazy"
                src={img.image}
                alt={`post-media-${i}`}
                className="h-full w-full object-fill"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
