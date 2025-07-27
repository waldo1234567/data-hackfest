import React from 'react';
import { motion } from 'framer-motion';
import { CheckLine, Footprints, CircleX } from 'lucide-react'
import clsx from 'clsx';

const STATUS = {
    1: { label: 'Completed', color: 'bg-green-600', Icon: CheckLine },
    0: { label: 'Ongoing', color: 'bg-blue-600', Icon: Footprints },
    2: { label: 'Canceled', color: 'bg-red-600', Icon: CircleX }
};
    
const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, duration: 0.4 }
    })
};

export default function HistoryItem({ item, index }) {
    const { habitName, startTime, endTime, status, xpAmount } = item;
    const st = new Date(startTime).toLocaleString();
    const et = endTime ? new Date(endTime).toLocaleString() : '—';

    let duration = '—';
    if (status === 0 && endTime) {
        const diff = new Date(endTime) - new Date(startTime);
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        duration = `${hrs}h ${mins}m`;
    }
    const { label, color, Icon } = STATUS[status] || {};

    return (
        <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className={clsx(
                'relative bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between',
                'hover:shadow-lg hover:-translate-y-1 transition'
            )}
        >

            <div className="absolute left-[-28px] top-1">
                <span className="block w-5 h-5 rounded-full bg-white border-4 border-gray-300"></span>
            </div>

            <div className="flex-1 space-y-1">
                <div className="text-xl font-semibold text-gray-800">{habitName}</div>
                <div className="flex flex-wrap text-sm text-gray-500 gap-4">
                    <div><strong>Start:</strong> {st}</div>
                    <div><strong>End:</strong> {et}</div>
                    {duration !== '—' && <div><strong>Duration:</strong> {duration}</div>}
                </div>
                {/* XP progress bar example (you can compute percentage as you like) */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-green-400"
                        style={{ width: Math.min((xpAmount / 100) * 100, 100) + '%' }}
                    />
                </div>
            </div>

            <div className="flex flex-col items-end mt-4 md:mt-0 space-y-2">
                <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white', color)}>
                    <Icon className="w-4 h-4 mr-1" />
                    {label}
                </span>
                <div className="text-sm text-gray-600"><strong>XP:</strong> {xpAmount}</div>
            </div>
        </motion.div>
    );
}