import React from 'react';
import { Outlet } from 'react-router-dom';
import ActiveTaskManager from '../component/ActiveTaskManager';
import BottomNav from '../component/BottomNav';

export default function TaskPageLayout() {
    return (
        <div className="flex h-screen bg-black text-white">
            <main className="flex-1 relative overflow-auto">
                <ActiveTaskManager />
                <div className="p-6">
                    <Outlet />         
                </div>
                <BottomNav active="tasks" />
            </main>
        </div>
    )
}