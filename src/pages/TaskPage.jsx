import React, { useState, useEffect } from 'react';
import TaskCard from '../component/TaskCard';
import { fetchHabits } from '../api/fetchApi';
import { useAuth0 } from "@auth0/auth0-react";

const TaskPage = () => {
    const [acceptedIds, setAcceptedIds] = useState(new Set());
    const [tasks, setTasks] = useState([]);
    const { getAccessTokenSilently } = useAuth0();


    useEffect(() => {
        const getData = async () => {
            const token = await getAccessTokenSilently({
                audience: import.meta.env.VITE_AUDIENCE
            })
            try {
                const data = await fetchHabits(token);
                console.log(data.habits);
                setTasks(data.habits);
            } catch (error) {
                console.log(error);
            }
        }

        getData();
    }, [])

    const handleAccept = id => {
        setAcceptedIds(new Set(acceptedIds).add(id));
    };


    return (
        <div className="relative flex flex-col w-full min-h-screen bg-black text-white">
            <header className="px-6 py-4 bg-black border-b border-gray-800">
                <h2 className="text-3xl font-bold">Choose Your Task</h2>
            </header>

            <main className="flex-1 overflow-auto p-6">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {tasks.map((task, i) => (
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
        </div >
    );
}

export default TaskPage;