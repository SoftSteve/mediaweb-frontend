
export default function SpaceHeader() {
    return (
  <div
    className="w-full h-80 relative bg-gradient-to-b rounded-b-xl shadow-md from-[#ece7e3] to-white"
  >

    {/* Foreground content */}
    <div className="relative z-10 flex flex-col h-full items-center justify-center gap-3 text-secondary">
      {/* Avatar */}
      <div className="h-40 w-40 rounded-full overflow-hidden shadow-lg border-2 border-white">
        <img
          src="/Dog.jpg"
          alt="Profile"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold">Lehman Wedding</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-10 pt-4 text-center">
        <div>
          <h1 className="text-xl font-bold">32</h1>
          <p className="text-sm text-gray-500">Posts</p>
        </div>
        <div>
          <h1 className="text-xl font-bold">15</h1>
          <p className="text-sm text-gray-500">Members</p>
        </div>
      </div>
    </div>
  </div>
);

}