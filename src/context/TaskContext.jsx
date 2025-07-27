import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTask, addTask, updateTask } from '../api/fetchApi';
import { useAuth0 } from '@auth0/auth0-react';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const [activeTasks, setActiveTasks] = useState([]);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        if (!isAuthenticated) return;

        (async () => {
            const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_AUDIENCE });
            const records = await getTask(token);
            console.log(records, "==> records")
            // records assumed: [{ recordId, habitId, habitName, startTime, status }]
            setActiveTasks(records.activeRecords.map(r => ({
                id: r.recordId,
                title: r.habitName,
                startedAt: new Date(r.startTime).getTime(),
                elapsed: Math.floor((Date.now() - new Date(r.startTime).getTime()) / 1000)
            })));

        })();
    }, [isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
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

    const acceptTask = async ({ id: habitId, title }) => {
        const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_AUDIENCE });
        console.log(habitId)
        const startTime = new Date().toISOString();
        // call backend to start record
        const recordId = await addTask(token, habitId, startTime);
        if (!recordId) {
            // maybe there's already one active; exit early
            return;
        }

        // then add locally
        setActiveTasks(tasks => [
            ...tasks,
            {
                recordId,                // ← correct ID for updates
                title,
                startedAt: new Date(startTime).getTime(),
                elapsed: 0
            }
        ]);
    };

    const finishTask = async (recordId, status = 1) => {
        const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_AUDIENCE });
        console.log(recordId)
        const endTime = new Date().toISOString();
        // update backend record
        await updateTask(token, recordId, endTime, status);

        // remove locally
        setActiveTasks(tasks => tasks.filter(t => t.id !== recordId));
    };

    const cancelTask = async recordId => {
        // if you want to mark status=0 (cancelled) in backend:
        const token = await getAccessTokenSilently({ audience: import.meta.env.VITE_AUDIENCE });
        const endTime = new Date().toISOString();
        await updateTask(token, recordId, endTime, 0);

        setActiveTasks(tasks => tasks.filter(t => t.id !== recordId));
    };

    return (
        <TaskContext.Provider value={{ activeTasks, acceptTask, finishTask, cancelTask }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTask() {
    return useContext(TaskContext);
}