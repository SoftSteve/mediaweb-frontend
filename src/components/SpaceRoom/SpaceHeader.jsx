export default function SpaceHeader() {
    return(
        <div className="w-full h-1/3 bg-gradient-to-b from-[#ece7e3] to-white flex flex-col">
            <div className="flex p-4 justify-center">
                <div className="h-24 w-24 rounded-full bg-cover bg-center inset-0 resize-0"
                    style={{
                        backgroundImage: `url('wedding.jpg')`
                    }}
                ></div>
            </div>
            <div className="flex justify-center">
                <h1 className="text-2xl text-secondary font-semibold">
                    Lehman Wedding
                </h1>
            </div>
            <div className="grid grid-cols-2 px-8 pt-8 place-items-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-xl text-secondary font-semibold">
                        32
                    </h1>
                    <h1 className="text-gray-500 text-md">
                        Posts
                    </h1>
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-xl text-secondary font-semibold">
                        15
                    </h1>
                    <h1 className="text-md text-gray-500">
                        members
                    </h1>
                </div>
            </div>
        </div>
    )
}