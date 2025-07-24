
export default function SpaceHeader({eventSpace}) {
    if (!eventSpace) return null;

    const {
      cover_image = '',
      name = '',
      posts =  [],
      members = []
    } = eventSpace;
   
  return (
    <div
        className="w-full h-40 sm:h-56 relative bg-cover bg-center shadow-lg overflow-hidden"
        style={{ backgroundImage: `url(${cover_image})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Foreground Content */}
        <div className="relative z-10 h-full px-4 sm:px-8 flex items-center gap-6 max-w-7xl mx-auto text-white">

          {/* Avatar */}
          <div
            className="h-24 w-24 rounded-full bg-cover bg-center shadow-lg border-2 border-white shrink-0"
            style={{ backgroundImage: `url(${cover_image})` }}
          />

          {/* Name + Stats container */}
          <div className="flex flex-col justify-center flex-grow gap-2 overflow-hidden">

            {/* Scrolling Title */}
            <div className="w-full overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-2xl sm:text-3xl font-bold font-display tracking-tight">
                {name}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-row gap-14 text-sm sm:text-base text-white/90">
              <div className="text-center">
                <h2 className="text-xl font-semibold">{posts?.length || 0}</h2>
                <p className="text-xs sm:text-sm">Posts</p>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{members?.length || 0}</h2>
                <p className="text-xs sm:text-sm">Members</p>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}
