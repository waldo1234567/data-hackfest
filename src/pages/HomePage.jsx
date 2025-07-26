const HomePage = () => {
    return (
        <div className="relative flex flex-col w-full min-h-screen bg-black text-white">
            <header className="flex items-center justify-between px-4 py-3 bg-black border-b border-white/20">
                <h1 className="text-2xl font-semibold">Welcome to Habit Tracker</h1>
            </header>
            <main className="flex-1 overflow-auto p-6">
                <p className="text-lg">Your journey to better habits starts here!</p>
            </main>
        </div>
    );
}
export default HomePage;