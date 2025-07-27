import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});


export const fetchHabits = async (token) => {
    try {
        const response = await api.post('/Habit/GetHabits', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const fetchStatistics = async (token) => {
    try {
        const response = await api.post('/Habit/Statistics',
            { granularity: 1 },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const fetchHistory = async (token) => {
    try {
        const response = await api.post('/Habit/HistoryTimeline', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error(error)
    }
}
