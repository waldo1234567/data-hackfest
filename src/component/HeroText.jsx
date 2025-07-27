import React from "react";
import { motion } from "framer-motion";

const heroVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } }
};

export default function HeroText() {
    return (
        <motion.div
            className="text-center px-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={heroVariants}
        >
            <h1 className="text-5xl font-bold text-white mb-4">
                Turn Your Habits Into Your Story
            </h1>
            <p className="text-lg text-gray-300 mb-8">
                Track. Reflect. Visualize.
            </p>
        </motion.div>
    );
}