import React from "react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

const heroVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } }
};

export default function HeroContent() {
    const { loginWithRedirect, isLoading, error, isAuthenticated } = useAuth0();
    if (error) return <div className="text-white">Error: {error.message}</div>;
    if (isAuthenticated) {
        // Handle authenticated state - maybe redirect to /task
        return <div className="text-white">Welcome back! Redirecting...</div>;
    }
    return (
        <>

            <motion.div
                className="text-center px-4 pointer-events-auto"
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
                    <button
                        onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
                     
                        className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition">
                        Sign Up
                    </button>
                    <button
                        onClick={() => loginWithRedirect()}
                    
                        className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition">
                        Log In
                    </button>
                </div>
            </motion.div>
        </>
    );
}