import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import { MdOutlineFileDownload,  } from 'react-icons/md';
import { IoMdClose } from "react-icons/io";

import 'yet-another-react-lightbox/styles.css';

export default function Gallery({ posts }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const allImages = posts.flatMap(post => post.images.map(img => ({ src: img.image })));

  return (
    <div className="flex flex-col w-full gap-4 mt-4">
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4">
        {allImages.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={`Gallery Image ${i}`}
            className="object-cover w-full aspect-[3/3] border border-black cursor-pointer md:aspect-[4/3]"
            onClick={() => setOpenIndex(i)}
          />
        ))}
      </div>

      <Lightbox
        open={openIndex >= 0}
        close={() => setOpenIndex(-1)}
        slides={allImages}
        render={{
          iconZoomIn: () => null,
          iconZoomOut: () => null,
        }}
        index={openIndex}
        onIndexChange={setOpenIndex}
        animation={{ swipe: 250, fade: 250 }}
        carousel={{ padding: 0 }}
        plugins={[Zoom, Download]}
        zoom={{
          maxZoomPixelRatio: 2,
          scrollToZoom: true,
          doubleClickMaxStops: 0
        }}
        download={{
          fileName: ({ slide }) => `photo-${slide.src.split('/').pop()}`,
        }}
        
      />
    </div>
  );
}