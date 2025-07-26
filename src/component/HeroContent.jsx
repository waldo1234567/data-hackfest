import React from "react";
import { motion } from "framer-motion";

const heroVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } }
};

export default function HeroContent() {
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
            <div className="space-x-4">
                <button className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition">
                    Sign Up
                </button>
                <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition">
                    Log In
                </button>
            </div>
        </motion.div>

    );
}