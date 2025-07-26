import { House, Map, CircleCheck, ChartBar, CircleUserRound } from 'lucide-react';

const items = [
    { key: 'home', icon: <House className="w-6 h-6" />, href: '/' },
    { key: 'mindmap', icon: <Map className="w-6 h-6" />, href: '/mindmap' },
    { key: 'tasks', icon: <CircleCheck className="w-6 h-6" />, href: '/tasks' },
    { key: 'report', icon: <ChartBar className="w-6 h-6" />, href: '/report' },
    { key: 'you', icon: <CircleUserRound className="w-6 h-6" />, href: '/profile' },
];

export default function BottomNav({ active }) {
    return (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-6 py-2 flex space-x-8 shadow-lg z-50">
            {items.map(item => (
                <a
                    key={item.key}
                    href={item.href}
                    className={`flex items-center justify-center p-1 
            ${active === item.key ? 'text-white' : 'text-white/60 hover:text-white'}`}
                >
                    {item.icon}
                </a>
            ))}
        </nav>
    );
}