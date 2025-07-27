import React from "react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5 } }
};

export default function HeroButtons() {
    const { loginWithRedirect, isLoading, error, isAuthenticated } = useAuth0();
    
    if (error) return <div className="text-white">Error: {error.message}</div>;
    if (isAuthenticated) {
        // Handle authenticated state - maybe redirect to /task
        return <div className="text-white">Welcome back! Redirecting...</div>;
    }

    return (
        <motion.div
            className="space-x-4 mr-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={buttonVariants}
        >
            <button
                onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
                className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition"
            >
                Sign Up
            </button>
            <button
                onClick={() => loginWithRedirect()}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
            >
                Log In
            </button>
        </motion.div>
    );
}