import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { X, Check, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function ActiveTaskManager() {
    const { activeTasks, finishTask, cancelTask } = useTask();
    const [open, setOpen] = useState(false);

    const formatTime = secs => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    console.log(activeTasks, "==> active tasks");
    return (
    
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
            <button
                onClick={() => setOpen(o => !o)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
                {open
                    ? <ChevronsRight className="w-6 h-6 text-white" />
                    : <ChevronsLeft className="w-6 h-6 text-white" />}
            </button>

            <div
                className={`
          mt-2 w-64 max-h-96 bg-black/80 backdrop-blur-md rounded-2xl
          overflow-auto transition-all duration-300
          ${open ? 'p-4 opacity-100' : 'h-0 p-0 opacity-0'}
        `}
            >
                <h3 className="text-white font-semibold mb-2">Active Tasks</h3>
                {activeTasks.length === 0 && (
                    <p className="text-gray-400 text-sm">No active tasks</p>
                )}
                {activeTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between mb-2 last:mb-0">
                        <div className="flex-1 pr-2">
                            <div className="text-white font-medium truncate">{t.title}</div>
                            <div className="text-gray-400 text-xs">{formatTime(t.elapsed)}</div>
                        </div>
                        <div className="flex space-x-1">
                            <button
                                onClick={() => finishTask(t.id)}
                                className="p-1 bg-green-600 hover:bg-green-500 rounded-full"
                            >
                                <Check className="w-4 h-4 text-white" />
                            </button>
                            <button
                                onClick={() => cancelTask(t.id)}
                                className="p-1 bg-red-600 hover:bg-red-500 rounded-full"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}