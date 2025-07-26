import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import ChartCard from '../component/ChartCard';
import { stats_mock } from '../data/mock_data';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const ReportPage = () => {
    const [data, setData] = useState(stats_mock);

    const { overview, timelineData, habitBreakdown, AIOverview } = data;

    const completionsData = timelineData.map(d => ({
        period: d.period,
        completions: d.completions
    }));

    // 2) Line chart for weekly duration in hours
    const durationData = timelineData.map(d => ({
        period: d.period,
        hours: +(d.totalDurationSeconds / 3600).toFixed(1)
    }));

    // 3) Bar chart for habit frequency
    const frequencyData = habitBreakdown.map(h => ({
        name: h.name,
        frequency: h.frequency
    }));

    // 4) Pie chart for time‑spent
    const pieData = habitBreakdown.map(h => {
        const [hh, mm, ss] = h.duration.split(':').map(Number);
        const minutes = hh * 60 + mm + ss / 60;
        return { name: h.name, value: +minutes.toFixed(1) };
    });
    const COLORS = ['#ffffff', '#cccccc', '#999999', '#666666'];

    const slides = [
        {
            title: 'Weekly Habit Completions',
            component: (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={completionsData}>
                        <XAxis dataKey="period" tick={{ fill: '#fff' }} />
                        <YAxis tick={{ fill: '#fff' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} itemStyle={{ color: '#fff' }} />
                        <Line
                            type="monotone"
                            dataKey="completions"
                            stroke="#fff"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            isAnimationActive
                            animationDuration={1200}
                            animationEasing="ease-out"
                        />
                    </LineChart>
                </ResponsiveContainer>
            ),
            overview: AIOverview[0],
            reverse: false
        },
        {
            title: 'Weekly Total Duration (hours)',
            component: (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={durationData}>
                        <XAxis dataKey="period" tick={{ fill: '#fff' }} />
                        <YAxis tick={{ fill: '#fff' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} itemStyle={{ color: '#fff' }} />
                        <Line
                            type="monotone"
                            dataKey="hours"
                            stroke="#fff"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            isAnimationActive
                            animationDuration={1200}
                            animationEasing="ease-out"
                        />
                    </LineChart>
                </ResponsiveContainer>
            ),
            overview: AIOverview[1],
            reverse: false
        },
        {
            title: 'Habit Frequency',
            component: (
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={frequencyData}>
                        <XAxis dataKey="name" tick={{ fill: '#fff' }} />
                        <YAxis tick={{ fill: '#fff' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} itemStyle={{ color: '#fff' }} />
                        <Bar
                            dataKey="frequency"
                            fill="#fff"
                            isAnimationActive
                            animationDuration={1200}
                            animationEasing="ease-out"
                        />
                    </BarChart>
                </ResponsiveContainer>
            ),
            overview: AIOverview[2],
            reverse: false
        },
        {
            title: 'Time Spent per Habit (minutes)',
            component: (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%" cy="50%"
                            innerRadius={50} outerRadius={80}
                            label={{ fill: '#fff', fontSize: 12 }}
                            isAnimationActive
                            animationDuration={1200}
                            animationEasing="ease-out"
                        >
                            {pieData.map((_, idx) =>
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            )}
                        </Pie>
                        <Legend verticalAlign="bottom" wrapperStyle={{ color: '#fff' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                </ResponsiveContainer>
            ),
            overview: AIOverview[3],
            reverse: false
        }
    ];

    const getVariants = (i, isChart) => {
        switch (i) {
            case 0:
                return {
                    initial: isChart ? { x: -200, opacity: 0 } : { x: 200, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                    exit: isChart ? { x: -200, opacity: 0 } : { x: 200, opacity: 0 },
                    transition: { type: 'tween', duration: 0.8 }
                };
            case 1:
                return {
                    initial: isChart ? { y: -200, opacity: 0 } : { y: 200, opacity: 0 },
                    animate: { y: 0, opacity: 1 },
                    exit: isChart ? { y: -200, opacity: 0 } : { y: 200, opacity: 0 },
                    transition: { type: 'spring', stiffness: 80, damping: 12 }
                };
            case 2:
                return {
                    initial: isChart ? { scale: 0.5, opacity: 0 } : { scale: 1.2, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    exit: isChart ? { scale: 0.5, opacity: 0 } : { scale: 1.2, opacity: 0 },
                    transition: { type: 'spring', stiffness: 120, damping: 20 }
                };
            case 3:
                return {
                    initial: isChart ? { rotate: -10, opacity: 0 } : { rotate: 10, opacity: 0 },
                    animate: { rotate: 0, opacity: 1 },
                    exit: isChart ? { rotate: -10, opacity: 0 } : { rotate: 10, opacity: 0 },
                    transition: { type: 'tween', duration: 0.7 }
                };
            default:
                return {};
        }
    };

    return (
        <div className="h-screen overflow-y-scroll scroll-snap-y bg-black text-white">
            <header className="px-6 py-4 bg-black border-b border-gray-800">
                <h2 className="text-3xl font-bold">Your Habit Report</h2>
            </header>

            {slides.map((slide, i) => {
                const chartVars = getVariants(i, true);
                const textVars = getVariants(i, false);

                return (
                    <section
                        key={i}
                        className="h-screen snap-start flex flex-col items-center justify-center p-6 gap-8"
                    >
                        {/* 1) Chart at the top */}
                        <motion.div
                            className="w-full max-w-4xl"
                            initial={chartVars.initial}
                            whileInView={chartVars.animate}
                            exit={chartVars.exit}
                            transition={chartVars.transition}
                            viewport={{ once: false, amount: 0.5 }}
                        >
                            <ChartCard title={slide.title}>
                                <ResponsiveContainer width="100%" height={350}>
                                    {slide.component}
                                </ResponsiveContainer>
                            </ChartCard>
                        </motion.div>

                        {/* 2) Text underneath */}
                        <motion.div
                            className="w-full max-w-5xl p-4"
                            initial={textVars.initial}
                            whileInView={textVars.animate}
                            exit={textVars.exit}
                            transition={textVars.transition}
                            viewport={{ once: false, amount: 0.5 }}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                            >
                                {slide.overview}
                            </ReactMarkdown>
                        </motion.div>
                    </section>
                );
            })}
        </div>
    );
}

export default ReportPage;