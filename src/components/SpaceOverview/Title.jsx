import { useState } from "react";
import { motion } from "framer-motion";
import CreateModal from "./CreateSpaceModal";

export default function TitleSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col justify-start text-primary gap-2 p-6 md:w-1/2">
            <h1 className="text-2xl">Spaces</h1>
            <h3 className="font-thin text-sm">Create a space to share your media.</h3>
            <img 
                src="image-share.png" 
                alt="preview"
                className="border border-black"
            />
            <motion.button 
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                onClick={() => setIsModalOpen(true)}
                className="h-[50px] rounded-xl text-white text-2xl bg-secondary border-border mt-4"
            >
                Create Space
            </motion.button>

            <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}