
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
    className="w-full h-80 relative bg-gradient-to-b rounded-b-xl shadow-md from-[#ece7e3] to-white"
  >

    {/* Foreground content */}
    <div className="relative z-10 flex flex-col h-full items-center justify-center gap-3 text-secondary">
      {/* Avatar */}
      <div className="h-40 w-40 rounded-full bg-cover bg-center shadow-lg border-2 border-white"
        style={{ backgroundImage: `url(https://api.memory-branch.com/${cover_image})` }}
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold">{name}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-10 pt-4 text-center">
        <div>
          <h1 className="text-xl font-bold">{posts?.length || 0}</h1>
          <p className="text-sm text-gray-500">Posts</p>
        </div>
        <div>
          <h1 className="text-xl font-bold">{members?.length || 0}</h1>
          <p className="text-sm text-gray-500">Members</p>
        </div>
      </div>
    </div>
  </div>
);

}
