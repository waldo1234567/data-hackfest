import React, { useEffect, useState, useRef } from 'react';
import { FloatingParticles } from '../component/ThreeBackground';
import { useScroll, ScrollControls, Scroll } from '@react-three/drei';
import HeroContent from '../component/HeroContent';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

const cardVariants = {
    hiddenLeft: { opacity: 0, x: -50 },
    hiddenRight: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    exitLeft: { opacity: 0, x: -50, transition: { duration: 0.4 } },
    exitRight: { opacity: 0, x: 50, transition: { duration: 0.4 } }
};

const features = [
    { icon: '💡', title: 'AI‑Driven Insights', desc: 'See themes emerge from your reflections.' },
    { icon: '🗺️', title: 'Interactive Mind Map', desc: 'Visualize your growth in real time.' },
    { icon: '🏆', title: 'Gamified Progress', desc: 'Level up your habits with XP & rewards.' },
    { icon: '📊', title: 'Detailed Reports', desc: 'Track streaks and top motivations.' },
    { icon: '🔔', title: 'Smart Reminders', desc: 'Never miss a day with AI‑timed nudges.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'Your data stays yours.' }
];

const Landing = () => {
    const [section, setSection] = useState(0);
    const containerRef = useRef();
    const bgColors = ['#000000', '#111111', '#222222'];

    useEffect(() => {
        const onScroll = () => {
            if (!containerRef.current) return;
            const scrollY = window.scrollY;
            const vh = window.innerHeight;
            const current = Math.min(2, Math.floor(scrollY / vh));
            setSection(current);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    function SectionListener({ pages, onSectionChange }) {
        const scroll = useScroll();

        useFrame(() => {
            const offset = scroll.offset;            // 0 → 1 over all pages
            const current = Math.min(pages - 1, Math.floor(offset * pages));
            onSectionChange(current);
        });

        return null;
    }
    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden transition-colors duration-700"
            style={{ backgroundColor: bgColors[section] }}
        >
            <Canvas
                className="absolute inset-0 z-0"
                camera={{ position: [0, 0, 10], fov: 75 }}
            >
                <ScrollControls pages={3} damping={6}>
                    <Scroll>
                        <ambientLight intensity={0.5} />
                        <FloatingParticles count={900} spread={[20, 60, 20]} />
                    </Scroll>

                    <Scroll
                        html
                        style={{ width: '100%' }}
                    >
                        <div className="absolute inset-0 h-screen flex flex-col items-center justify-center px-4">
                            <HeroContent />
                        </div>

                        <div className="absolute inset-x-0 top-[100vh] min-h-screen flex flex-col items-center px-6 py-16 space-y-12">
                            <h2 className="text-4xl font-semibold text-white mb-6">Dive Deeper</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl w-full">
                                {features.map((f, i) => {
                                    const isLeft = i % 2 === 0;
                                    return (
                                        <motion.div
                                            key={f.title}
                                            className="bg-black/70 p-6 rounded-2xl border border-white/20 flex flex-col items-center text-center"

                                            // start off-screen left or right
                                            initial={isLeft ? 'hiddenLeft' : 'hiddenRight'}
                                            // animate into place when 50% of the card is in view
                                            whileInView="visible"
                                            // animate out when it leaves
                                            exit={isLeft ? 'exitLeft' : 'exitRight'}
                                            viewport={{ once: false, amount: 0.5 }}

                                            variants={cardVariants}
                                        >
                                            <div className="text-5xl mb-4">{f.icon}</div>
                                            <h3 className="text-xl font-medium text-white mb-2">{f.title}</h3>
                                            <p className="text-text-secondary">{f.desc}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* === Page 3: Call-to-Action & Footer === */}
                        <div className="absolute inset-x-0 top-[200vh] min-h-screen flex flex-col items-center px-4 py-16 space-y-8">
                            <h2 className="text-4xl font-semibold text-white">Ready to Start Your Journey?</h2>
                            <div className="space-x-4">
                                <button className="px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition">
                                    Sign Up Now
                                </button>
                                <button className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition">
                                    Learn More
                                </button>
                            </div>
                            {/* Footer */}
                            <footer className="mt-auto text-gray-500 text-sm">
                                © 2025 HabitQuest • <a href="/terms" className="underline">Terms</a> • <a href="/privacy" className="underline">Privacy</a>
                            </footer>
                        </div>
                    </Scroll>
                    <SectionListener pages={3} onSectionChange={setSection} />
                </ScrollControls>
            </Canvas>

            <noscript>
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <HeroContent />
                </div>
            </noscript>
        </div>
    );
}

export default Landing;