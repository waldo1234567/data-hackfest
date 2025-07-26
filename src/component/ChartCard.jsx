import React from "react";

const ChartCard = ({ title, children }) => {
    return (
        <>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 shadow-lg">
                <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
                {children}
            </div>
        </>
    )
}

export default ChartCard;