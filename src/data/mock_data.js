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
    "AIOverview": [
        "You've shown great consistency in completing habits! Looking at your daily completions, you generally average between 2 and 5 habits completed per day. There are some days with higher completion rates, peaking at 6. Notice how those days also correlate with more total duration. There is, however, a visible downtrend, especially in June, with multiple days dropping below 3 completions.\n\n**Suggestion**: Reflect on what might have caused the lower completion days. Did anything change in your schedule? Identifying these factors can help you proactively plan and maintain a higher completion rate. Perhaps setting a minimum daily target could also be beneficial.",
        "Your total duration spent on habits varies considerably from day to day, ranging from under an hour to over 4 hours. There appears to be some correlation between the number of habit completions and the total duration, which makes sense. Several peak days correspond with weekends (e.g., July 12, July 25, July 6), suggesting you may have more time for habits on those days.\n\n**Suggestion:** Consider scheduling longer duration habits for days when you know you'll have more free time. Also, breaking down longer habits into smaller, more manageable chunks on busier days could help you maintain momentum.",
        "You're tracking a good variety of habits (30 unique habits!), which shows a broad commitment to self-improvement. Your most frequent habit is 'Morning Run' which is fantastic. However, many habits have only been done a handful of times.\n\n**Suggestion**: Reflect on the habits you're tracking. Are all of them still relevant to your goals? Consider focusing on a smaller set of core habits to build stronger routines, and periodically evaluate if other habits should be added or removed.",
        "You're dedicating a significant amount of time to \"Morning Run\", which is great if fitness is a major priority. However, the durations for other habits show opportunities for adjustment. For example, practices like 'Take Vitamins' should not take almost 6 hours to complete.\n\n**Suggestion**: Analyze if time spent on habits aligns with their importance and intended benefit. Some habits might be worth increasing time on, while others might be streamlined.\nAlso, remember the data is only as useful as it is accurate. So remember to track them accurately, so you may optimize and analyze in the future."
    ]

}