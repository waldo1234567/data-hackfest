import React from 'react';
import HistoryItem from './HistoryItem';

export default function HistoryList({ items }) {
    const grouped = items.reduce((acc, item) => {
        const day = new Date(item.startTime).toLocaleDateString();
        (acc[day] = acc[day] || []).push(item);
        return acc;
    }, {});

    return (
        <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-1 bg-gray-200" />

            {Object.entries(grouped).map(([date, items]) => (
                <div key={date} className="relative mb-12 pt-6">
                    <div className="absolute left-3 top-0 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ zIndex: 10 }} >
                        <div className="px-3 py-1 bg-gray-50 text-gray-600 text-sm font-semibold rounded-full shadow-sm">
                            {date}
                        </div>
                    </div>

                    <div className="space-y-6 mt-6">
                        {items.map((item, idx) => (
                            <HistoryItem item={item} index={idx} key={item.recordId} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
