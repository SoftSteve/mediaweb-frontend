import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Zoom } from "swiper/modules";
import { useState, useEffect, useRef } from "react";

const ads = [
  { id: 1, image: "burger-ad.jpg", link: "https://example.com/1", title: "BOGO for national burger day!" },
  { id: 2, image: "shoes-ad.jpg", link: "https://example.com/2", title: "50% off your first order!" },
  { id: 3, image: "wedding.jpg", link: "https://example.com/3", title: "Find Your Dream Venue" },
];

function getAspectClass(width, height) {
  if (!width || !height) return "aspect-[4/5]";
  const ratio = width / height;
  if (ratio > 1.91) return "aspect-[1.91/1]";
  if (ratio < 0.8) return "aspect-[4/5]";
  return "aspect-[1/1]";
}

export default function AdSenseAd() {
  const [aspectClass, setAspectClass] = useState("aspect-[4/5]");
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!ads.length) return;
    const img = new Image();
    img.src = ads[0].image;
    img.onload = () => {
      setAspectClass(getAspectClass(img.width, img.height));
    };
  }, []);

  if (!ads.length) return null;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Swiper
        modules={[Pagination, Zoom]}
        zoom
        slidesPerView={1}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className={`${aspectClass} w-full overflow-hidden md:rounded-md md:border border-gray-300 md:border-0`}
        pagination={{ clickable: true, type: "bullets", dynamicBullets: true }}
      >
        {ads.map((ad, i) => (
          <SwiperSlide key={ad.id ?? i} className="relative w-full h-full">
            <img
              src={ad.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-lg scale-100 opacity-60 z-0"
            />
            <span className="absolute top-2 left-2 z-20 bg-black/40 text-white text-xs px-2 py-1 rounded">
              Sponsored
            </span>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full"
            >
              <div className="swiper-zoom-container relative z-10 h-full w-full">
                <img
                  loading="lazy"
                  src={ad.image}
                  alt={ad.title}
                  className="h-full w-full object-contain"
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="w-full bg-white text-secondary text-md md:text-base px-4 py-3 flex justify-between items-center">
        <span>{ads[currentIndex]?.title}</span>
        <a
          href={ads[currentIndex]?.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline text-sm"
        >
          Visit →
        </a>
      </div>
    </div>
  );
}
