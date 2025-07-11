
export default function SpaceHeader() {
    return (
  <div
    className="w-full h-80 relative bg-gradient-to-b from-[#ece7e3] to-white"
  >
    {/* Overlay blur & tint */}
    <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-0" />

    {/* Foreground content */}
    <div className="relative z-10 flex flex-col h-full items-center justify-center gap-3 text-white">
      {/* Avatar */}
      <div className="h-24 w-24 rounded-full bg-cover bg-center shadow-lg border-2 border-white"
        style={{ backgroundImage: `url('/wedding.jpg')` }}
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold">Lehman Wedding</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-10 pt-4 text-center">
        <div>
          <h1 className="text-xl font-bold">32</h1>
          <p className="text-sm text-white/80">Posts</p>
        </div>
        <div>
          <h1 className="text-xl font-bold">15</h1>
          <p className="text-sm text-white/80">Members</p>
        </div>
      </div>
    </div>
  </div>
);

}