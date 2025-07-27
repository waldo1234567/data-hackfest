import React from 'react';
import { Outlet } from 'react-router-dom';
import ActiveTaskManager from '../component/ActiveTaskManager';
import BottomNav from '../component/BottomNav';

export default function HistoryPageLayout() {
    return (
        <>
            <div className="w-full h-full">
                <Outlet />
                <ActiveTaskManager />
                <div className='text-white'>
                    <BottomNav />
                </div>
            </div>
        </>
    )
}