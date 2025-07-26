import { BrainCircuit, CircleCheck, ChartBar, History } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
    { key: 'mindmap', icon: <BrainCircuit className="w-6 h-6" />, href: '/mindmap' },
    { key: 'tasks', icon: <CircleCheck className="w-6 h-6" />, href: '/task' },
    { key: 'report', icon: <ChartBar className="w-6 h-6" />, href: '/report' },
    { key: 'you', icon: <History className="w-6 h-6" />, href: '/history' },
];

export default function BottomNav({ active }) {
    return (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-6 py-2 flex space-x-8 shadow-lg z-50">
            {items.map(item => (
                <NavLink to={item.href}
                    key={item.key}
                    className={({ isActive }) =>
                        `p-2 rounded ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
                    }>
                    {item.icon}
                </NavLink>
            ))}
        </nav>
    );
}