import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/zoom";



export default function AboutPage() {
  return (
   <div className="w-screen min-h-screen flex flex-col bg-white">
          <div className="w-full h-40 sm:h-56 relative bg-gradient-to-br from-amber-50 via-white to-blue-50 shadow-lg overflow-hidden">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#ece7e3] to-white backdrop-blur-sm"></div>

            {/* Foreground Row */}
            <div className="relative z-10 h-full px-4 sm:px-8 flex items-center gap-4 sm:gap-6 max-w-7xl mx-auto">
              {/* Avatar */}
              <div
                className="h-24 w-24 sm:h-24 sm:w-24 rounded-full bg-cover bg-center shadow-xl border-2 border-white transition-transform duration-300 hover:scale-105 shrink-0"
                style={{ backgroundImage: `url(${cover_image})` }}
              />

              {/* Text Column */}
              <div className="flex flex-col justify-center">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-xs sm:max-w-md md:max-w-lg">
                  {name}
                </h1>

                {/* Stats */}
                <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-4 sm:gap-8 text-center">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{posts?.length || 0}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-sans">Posts</p>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{members?.length || 0}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-sans">Members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}
