import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [activeTasks, setActiveTasks] = useState([]);

    useEffect(() => {
        // Fetch initial tasks from an API or local storage
        const timer = setInterval(() => {
            setActiveTasks(tasks =>
                tasks.map(t => ({
                    ...t,
                    elapsed: Math.floor((Date.now() - t.startedAt) / 1000)
                }))
            );
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const acceptTask = ({ id, title }) => {
        setActiveTasks(tasks => [
            ...tasks,
            { id, title, startedAt: Date.now(), elapsed: 0 }
        ]);
    }

    const finishTask = (taskId) => {
        setActiveTasks(tasks => tasks.filter(t => t.id !== taskId));
        // TODO: record completion in backend
    }
    const cancelTask = id => setActiveTasks(tasks => tasks.filter(t => t.id !== id));

    return (
        <TaskContext.Provider value={{ activeTasks, acceptTask, finishTask, cancelTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTask() {
    return useContext(TaskContext);
}