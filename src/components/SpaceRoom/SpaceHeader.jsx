
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
      style={{ backgroundImage: `url('wedding.jpg')` }}
      >
      {/* Optional: dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Foreground Row */}
      <div className="relative z-10 h-full px-4 sm:px-8 flex items-center justify-center gap-6 max-w-7xl mx-auto text-white">
        {/* Avatar (optional) */}
        <div className="h-24 w-24 rounded-full bg-cover bg-center shadow-lg border-2 border-white shrink-0"
            style={{ backgroundImage: `url(${cover_image})` }} />

        {/* Text Column */}
        <div className="flex flex-col justify-center items-start">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-xs sm:max-w-md md:max-w-lg">
            {name}
          </h1>

          {/* Stats */}
          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-6 text-sm sm:text-base text-white/90">
            <div className="text-center">
              <h2 className="text-xl font-semibold">{posts?.length || 0}</h2>
              <p className="text-xs sm:text-sm">Posts</p>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">12</h2>
              <p className="text-xs sm:text-sm">{members?.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
