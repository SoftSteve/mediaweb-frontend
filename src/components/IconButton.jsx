import { motion } from 'framer-motion';

export default function IconButton({icon, text, ...props}) {
    return(
        <motion.button 
            whileTap={{scale:0.95}} 
            transition={{type:'spring', stiffness:500, damping:10}} 
            className='w-full flex flex-row gap-2 bg-surface rounded-3xl p-3 items-center justify-center'
            {...props}
        >
            {icon}
            {text}
        </motion.button>
    );
}
