import { motion } from "framer-motion";

export default function SpaceCard({ image, title, onClick }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <motion.div 
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05}}
                className="h-40 w-64 bg-gray-200 rounded-xl overflow-hidden"
                onClick={onClick}
            >
                <img src={image} alt={title} className="w-full h-full object-cover" />
            </motion.div>
            <p className="text-sm text-center text-primary">{title}</p>
        </div>
    );
}