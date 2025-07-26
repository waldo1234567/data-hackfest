export const habits = [
    { id: '1', name: 'Morning Meditation', frequency: 'Daily', duration: '10 min' },
    { id: '2', name: 'Exercise', frequency: '3x/week', duration: '30 min' },
    { id: '3', name: 'Healthy Breakfast', frequency: 'Daily', duration: '15 min' },
    { id: '4', name: 'Reading', frequency: 'Daily', duration: '20 min' },
    { id: '5', name: 'Journaling', frequency: '5x/week', duration: '5 min' },
    { id: '6', name: 'Social Media', frequency: 'Daily', duration: '60 min' },
    { id: '7', name: 'Deep Work', frequency: 'Daily', duration: '90 min' },
    { id: '8', name: 'Language Learning', frequency: '4x/week', duration: '15 min' },
    { id: '9', name: 'Evening Walk', frequency: 'Daily', duration: '20 min' },
    { id: '10', name: 'Yoga', frequency: '3x/week', duration: '45 min' },
    { id: '11', name: 'Podcast Listening', frequency: '2x/week', duration: '30 min' },
    { id: '12', name: 'Sketching', frequency: 'Weekly', duration: '60 min' },
    { id: '13', name: 'Cooking New Recipe', frequency: 'Weekly', duration: '90 min' },
    { id: '14', name: 'Gardening', frequency: 'Weekly', duration: '45 min' },
    { id: '15', name: 'House Cleaning', frequency: 'Weekly', duration: '60 min' },
    { id: '16', name: 'Call a Friend', frequency: '3x/week', duration: '15 min' },
    { id: '17', name: 'Watch Documentaries', frequency: '2x/week', duration: '60 min' },
    { id: '18', name: 'Plan Tomorrow', frequency: 'Daily', duration: '10 min' },
    { id: '19', name: 'Mindful Breathing', frequency: 'Daily', duration: '5 min' },
    { id: '20', name: 'Digital Detox', frequency: 'Weekend', duration: '120 min' },

    { id: '21', name: 'Hydration Tracking', frequency: 'Daily', duration: '2 min' },
    { id: '22', name: 'Gratitude Practice', frequency: 'Daily', duration: '5 min' },
    { id: '23', name: 'Stretching Routine', frequency: 'Daily', duration: '10 min' },
    { id: '24', name: 'Financial Review', frequency: 'Weekly', duration: '20 min' },
    { id: '25', name: 'Volunteer Work', frequency: 'Monthly', duration: '180 min' },
    { id: '26', name: 'Music Practice', frequency: '4x/week', duration: '30 min' },
    { id: '27', name: 'Meal Planning', frequency: 'Weekly', duration: '45 min' },
    { id: '28', name: 'Cold Shower', frequency: 'Daily', duration: '5 min' },
    { id: '29', name: 'Speed Reading', frequency: '3x/week', duration: '15 min' },
    { id: '30', name: 'No Caffeine Afternoon', frequency: 'Daily', duration: '0 min' }
];

export const relations = {
    Relation: [
        { From: 'Morning Meditation', to: 'Mindful Breathing', Probability: 93.2 },
        { From: 'Mindful Breathing', to: 'Morning Meditation', Probability: 88.5 },

        { From: 'Hydration Tracking', to: 'Healthy Breakfast', Probability: 79.4 },
        { From: 'Stretching Routine', to: 'Exercise', Probability: 81.6 },
        { From: 'Cold Shower', to: 'Deep Work', Probability: 68.9 },
        { From: 'No Caffeine Afternoon', to: 'Evening Walk', Probability: 72.1 },

        { From: 'Gratitude Practice', to: 'Journaling', Probability: 87.3 },
        { From: 'Journaling', to: 'Gratitude Practice', Probability: 75.2 },
        { From: 'Gratitude Practice', to: 'Mindful Breathing', Probability: 83.7 },
        { From: 'Podcast Listening', to: 'Music Practice', Probability: 63.8 },

        { From: 'Meal Planning', to: 'Cooking New Recipe', Probability: 85.4 },
        { From: 'Financial Review', to: 'Plan Tomorrow', Probability: 69.5 },
        { From: 'Speed Reading', to: 'Reading', Probability: 91.2 },
        { From: 'Deep Work', to: 'Speed Reading', Probability: 76.3 },

        { From: 'Social Media', to: 'Music Practice', Probability: -52.7 },
        { From: 'No Caffeine Afternoon', to: 'Social Media', Probability: -48.9 },

        { From: 'Music Practice', to: 'Language Learning', Probability: 57.4 },
        { From: 'Sketching', to: 'Music Practice', Probability: 44.6 },

        { From: 'Volunteer Work', to: 'Call a Friend', Probability: 64.2 },
        { From: 'Gardening', to: 'Volunteer Work', Probability: 38.7 },

        { From: 'Digital Detox', to: 'Hydration Tracking', Probability: 28.5 },
        { From: 'House Cleaning', to: 'Financial Review', Probability: 33.9 }
    ]
};

export const stats_mock = {
    "overview": {
        "totalCompletions": 58,
        "totalDuration": "10:30:45",
        "totalUniqueHabits": 4,
        "averageSessionDurationSeconds": 652.5
    },
    "timelineData": [
        {
            "period": "Week of 2025-07-06",
            "completions": 15,
            "totalDurationSeconds": 9800
        },
        {
            "period": "Week of 2025-07-13",
            "completions": 25,
            "totalDurationSeconds": 16200
        },
        {
            "period": "Week of 2025-07-20",
            "completions": 18,
            "totalDurationSeconds": 11845
        }
    ],
    "habitBreakdown": [
        {
            "id": 101,
            "name": "Workout",
            "frequency": 20,
            "duration": "05:00:00"
        },
        {
            "id": 102,
            "name": "Reading",
            "frequency": 15,
            "duration": "03:15:30"
        },
        {
            "id": 103,
            "name": "Coding",
            "frequency": 13,
            "duration": "01:45:15"
        },
        {
            "id": 104,
            "name": "Meditation",
            "frequency": 10,
            "duration": "00:30:00"
        }
    ],
    "AIOverview":{
        "Habit Completions Trend (Daily)": "**Analysis:** The daily habit completion count fluctuates significantly. There are days with only 1-2 completions, and days with 5-6. Looking at the data alone, the user seems to be most consistent between 3-5 completions per day. There isn't a clear upward or downward trend overall. Periods of higher completion are often followed by dips. July 12th and 25th have the highest number of completions. There are also days with just 1 completion, indicating potential off days or periods of lower motivation. June 25th has no entry, indicating a missing day of tracking.\n\n**Suggestions:**\n\n*   **Identify Trigger Days/Events:** Analyze personal schedules and events for high and low completion days. Are weekends different from weekdays? Does work load impact habit adherence? Are there certain events or activities that sabotage the user's ability to complete habits?\n*   **Establish Minimum Baseline:** Aim for a minimum consistent number of completions per day, even on busy or challenging days. Start with 3, for example, and protect that time.\n*   **Spread Out High Volume Days:** If specific days require a high number of completions, explore if some habits can be shifted to other days to create a more balanced distribution.\n*   **Address Zero/One Completion Days:** Actively identify the reason for these days. Plan for obstacles in advance and have backup habits that are simpler or shorter on these days.\n*   **Fix Missing data**: Start keeping a record daily so that the data can be complete.",
        "Total Duration Trend (Daily)": "**Analysis:** Similar to the habit completion count, the daily total duration also varies substantially. Days with the highest completion counts tend to have higher total durations, but not always proportionally. For instance, July 6th has a higher duration, despite only being 1 completion less than July 12th. This suggests some habits have significantly longer durations than others. Also, while the user might complete a lot of habits, the total amount of time may vary widely. There also seems to be days with less completions, but with longer durations, like June 24th.\n\n**Suggestions:**\n\n*   **Correlate Duration with Completions:** Compare the two trends to understand which habits contribute most to the total duration. This can help in prioritizing or adjusting time allocation.\n*   **Time Blocking:** Consider time-blocking specific periods for habit completion. This can help ensure sufficient time is allocated for longer duration habits.\n*   **Break Up Long Habits:** If possible, break down long-duration habits into smaller, more manageable chunks. This can make them less daunting and easier to fit into a busy day.\n*   **Flexibility and Prioritization:** On busy days, prioritize shorter-duration habits to maintain momentum. Save longer habits for days with more available time.",
        "Overall Habit Frequency Insights": "**Analysis:** There's a clear hierarchy of habit frequency. \"Morning Run\" is the most frequent habit by a large margin (64 times), suggesting it's well-established and a priority. Other habits have significantly lower frequencies. The breakdown shows a long tail, with many habits only being completed a few times. This indicates that some habits are more experimental or less integrated into the user's routine. The user has a strong core habit that is performed regularly, but most other habits are not being performed regularly.\n\n**Suggestions:**\n\n*   **Identify Core vs. Experimental Habits:** Categorize habits as either \"core\" (consistent and essential) or \"experimental\" (being tested for integration).\n*   **Focus on Consistency:** Choose 2-3 low-frequency habits that are valuable and commit to increasing their frequency. Focus on building momentum before adding new habits.\n*   **Re-evaluate Low-Frequency Habits:** Evaluate why low-frequency habits are not being completed. Are they not enjoyable? Too time-consuming? Not a priority? Adjust or eliminate them.\n*   **Celebrate High-Frequency Habits:** Acknowledge the success of high-frequency habits like \"Morning Run.\" Use this as a foundation to build other habits.",
        "Time Spent Per Habit Insights": "**Analysis:** The total duration per habit provides insight into time commitment. \"Morning Run\" consumes the most time by a significant margin. Some habits completed with similar frequency (e.g., \"Meditate\" and \"Learn New Language\") have drastically different durations, highlighting the time investment required for each. The habits performed less are relatively low in time consumption overall. This might indicate a lack of comfort in performing them, or a lack of time.\n\n**Suggestions:**\n\n*   **Time Auditing:** Track time spent on individual habits for a week to validate the data. This can reveal hidden time commitments or inefficiencies.\n*   **Optimize Time Allocation:** Ensure time is allocated in line with priorities. Is the time spent on \"Morning Run\" justifiable, given other goals? Should other habits be prioritized?\n*   **Efficiency Improvements:** Explore ways to shorten the duration of high-time-commitment habits. Can the \"Morning Run\" be shortened while still providing benefits?\n*   **Leverage Habit Stacking:** Pair shorter-duration habits with existing high-frequency habits to improve consistency. For example, do \"Meditate\" immediately after \"Morning Run.\"\n*   **Review the Purpose of the Habits**: Some of the habits may not be relevant to the end goals of the user, so they may need to be changed or removed entirely. The user should focus on high impact habits."
    }

}