import React, { use, useEffect, useState } from 'react';
import { fetchHistory } from "../api/fetchApi";
import Loader from '../component/Loader';
import HistoryList from '../component/HistoryList';
import { useAuth0 } from "@auth0/auth0-react";

const HistoryPage = () => {
    const [timeline, setTimeline] = useState();
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const getData = async () => {
            const token = await getAccessTokenSilently({
                audience: import.meta.env.VITE_AUDIENCE
            })
            try {
                const data = await fetchHistory(token);
                console.log(data.timeline);
                setTimeline(data.timeline);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getData();

    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div className="p-6 bg-black min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Your History</h1>
                <HistoryList items={timeline} />
            </div>
        </>
    )
}

export default HistoryPage;