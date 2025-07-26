import React, { useState } from 'react';
import TaskCard from '../component/TaskCard';
import BottomNav from '../component/BottomNav';
import ActiveTaskManager from '../component/ActiveTaskManager';

const initialTasks = [
    { id: 1, title: 'Drink 2L Water', desc: 'Stay hydrated all day', accepted: false },
    { id: 2, title: 'Read 30 mins', desc: 'Read a chapter of your book', accepted: false },
    { id: 3, title: 'Meditate', desc: '5-minute morning meditation', accepted: false },
];


const TaskPage = () => {
    const [acceptedIds, setAcceptedIds] = useState(new Set());

    const handleAccept = id => {
        setAcceptedIds(new Set(acceptedIds).add(id));
    };


    return (
        <div className="relative flex flex-col w-full min-h-screen bg-black text-white">
            <header className="px-6 py-4 bg-black border-b border-gray-800">
                <h2 className="text-3xl font-bold">Choose Your Task</h2>
            </header>

            <main className="flex-1 overflow-auto p-6">
                <ActiveTaskManager />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {initialTasks.map((task, i) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            accepted={acceptedIds.has(task.id)}
                            onAccept={() => handleAccept(task.id)}
                            index={i}
                        />
                    ))}
                </div>
            </main>
            <BottomNav active="tasks" />
        </div >
    );
}

export default TaskPage;