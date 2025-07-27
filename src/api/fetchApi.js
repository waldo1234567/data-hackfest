import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});


export const fetchHabits = async (token) => {
    console.log(token, "==> token");
    try {
        const response = await api.post('/Habit/GetHabits', {}, {
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
        const response = await api.post('/Habit/HistoryTimeline', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    } catch (error) {
        console.error(error)
    }
}

export const addTask = async (token, id, startTime) => {
    try {
        const { data } = await api.post('/Habit/StartRecord', {
            "habitId": id,
            "startTime": startTime
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        return data.recordId;
    } catch (error) {
        console.error(error);
    }
}

export const updateTask = async (token, id, endTime, status) => {
    try {
        await api.post('/Habit/UpdateRecord', {
            "recordId": id,
            "endTime": endTime,
            "status": status
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        )
    } catch (error) {
        console.error(error)
    }
}

export const getTask = async (token) => {
    try {
        const response = await api.post('/Habit/ActiveRecords', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
    } catch (error) {
        console.error(error)
    }
}