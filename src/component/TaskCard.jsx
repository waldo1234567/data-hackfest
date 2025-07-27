import React from 'react';
import { motion } from 'framer-motion';
import { useTask } from '../context/TaskContext';

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: i => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.8 }
    }),
    exit: { opacity: 0, y: 40, transition: { duration: 0.3 } }
};

export default function TaskCard({ task, accepted, onAccept, index }) {
    const { acceptTask } = useTask();
    const handleAccept = () => {
        acceptTask({ id: task.id, title: task.name });
        onAccept(); 
    };
    return (
        <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className={`
        bg-white text-black rounded-2xl shadow-xl p-6 flex flex-col justify-between
        ${accepted ? 'opacity-60' : 'opacity-100'}
      `}
        >
            <div>
                <h3 className="text-2xl font-semibold mb-4">{task.name}</h3>
                <hr className="border-gray-400 mb-4" />
                <p className="text-gray-600 mb-4 p-6">{task.description}</p>
            </div>
            <button
                onClick={handleAccept}
                disabled={accepted}
                className={`
          mt-auto w-full py-3 rounded-lg font-medium transition
          ${accepted
                        ? 'bg-gray-300 text-gray-600 cursor-default'
                        : 'bg-black text-white hover:bg-gray-800'}
        `}
            >
                {accepted ? 'Accepted' : 'Accept'}
            </button>
        </motion.div>
    );
}   