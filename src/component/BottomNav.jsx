import { BrainCircuit, CircleCheck, ChartBar, History, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'


const items = [
    { key: 'mindmap', icon: <BrainCircuit className="w-6 h-6" />, href: '/mindmap' },
    { key: 'tasks', icon: <CircleCheck className="w-6 h-6" />, href: '/task' },
    { key: 'report', icon: <ChartBar className="w-6 h-6" />, href: '/report' },
    { key: 'history', icon: <History className="w-6 h-6" />, href: '/history' },
];

export default function BottomNav({ active }) {
    const { logout } = useAuth0();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin, // redirects to "/"
            },
        });
    };

    return (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-6 py-2 flex space-x-8 shadow-lg z-50">
            {items.map(item => (
                <NavLink to={item.href}
                    key={item.key}
                    title={item.key}
                    className={({ isActive }) =>
                        `p-2 rounded ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
                    }>
                    {item.icon}
                </NavLink>
            ))}
            <button
                onClick={handleLogout}
                className="p-2 rounded hover:bg-white/10 text-white"
                title="Log out"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </nav>
    );
}