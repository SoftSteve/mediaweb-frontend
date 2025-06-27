export default function CustomDivider({text}) {
    return(
        <div className="flex items-center w-full">
        <div className="flex-grow h-px bg-white"></div>
        <span className="mx-2 text-white text-lg whitespace-nowrap">{text}</span>
        <div className="flex-grow h-px bg-white"></div>
        </div>

    )
}