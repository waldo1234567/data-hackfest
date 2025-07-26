const ReportPage = () => {
    return (
        <div className="relative flex flex-col w-full min-h-screen bg-black text-white">
            <header className="flex items-center justify-between px-4 py-3 bg-black border-b border-white/20">
                <h1 className="text-2xl font-semibold">Your Report</h1>
            </header>
            <main className="flex-1 overflow-auto p-6">
                <div className='space-y-4'>
                    {/* Report content goes here */}
                    <p>Your report details will be displayed here.</p>
                </div>
            </main>
        </div>
    );
}

export default ReportPage;