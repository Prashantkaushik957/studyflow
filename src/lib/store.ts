'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type UserRole = 'admin' | 'user' | null;

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    subject: string;
    chapter: string;
    estimatedMinutes: number;
    actualMinutes: number;
    subtasks: SubTask[];
    dueDate: string;
    createdAt: string;
    completedAt?: string;
    tags: string[];
    isTimerRunning: boolean;
    timerStartedAt?: number;
}

export interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    completedDates: string[];
    streak: number;
    bestStreak: number;
    createdAt: string;
}

export interface PomodoroSession {
    id: string;
    taskId?: string;
    type: 'focus' | 'break' | 'long-break';
    duration: number;
    completedAt: string;
}

export interface DailyCheckIn {
    date: string;
    mood: number;
    energy: number;
    focusScore: number;
    tasksCompleted: number;
    totalMinutes: number;
    notes: string;
}

export interface StudyGoal {
    id: string;
    name: string;
    template: string;
    subjects: { id: string; name: string; chapters: { id: string; name: string; completed: boolean; estimatedHours: number }[] }[];
    targetDate: string;
    createdAt: string;
}

// Admin: registered user type
export interface RegisteredUser {
    id: string;
    name: string;
    email: string;
    avatar: string;
    joinedAt: string;
    lastActive: string;
    device: string;
    os: string;
    browser: string;
    location: string;
    tasksCompleted: number;
    totalFocusMinutes: number;
    habitsActive: number;
    streak: number;
    plan: 'free' | 'pro';
    status: 'active' | 'inactive';
}

interface AppState {
    // Role
    currentRole: UserRole;
    setRole: (role: UserRole) => void;

    // Theme
    theme: 'light' | 'dark';
    toggleTheme: () => void;

    // Sidebar
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;

    // Tasks
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'actualMinutes' | 'isTimerRunning'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newStatus: TaskStatus) => void;

    // Habits
    habits: Habit[];
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'completedDates'>) => void;
    toggleHabitDate: (habitId: string, date: string) => void;
    deleteHabit: (id: string) => void;

    // Pomodoro
    pomodoroSessions: PomodoroSession[];
    addPomodoroSession: (session: Omit<PomodoroSession, 'id'>) => void;
    pomodoroSettings: { focusDuration: number; breakDuration: number; longBreakDuration: number; sessionsBeforeLongBreak: number };
    updatePomodoroSettings: (s: Partial<AppState['pomodoroSettings']>) => void;

    // Daily check-ins
    checkIns: DailyCheckIn[];
    addCheckIn: (checkIn: DailyCheckIn) => void;

    // Study goals
    studyGoals: StudyGoal[];
    addStudyGoal: (goal: StudyGoal) => void;
    updateStudyGoal: (id: string, updates: Partial<StudyGoal>) => void;

    // Activity log
    activityLog: { id: string; action: string; details: string; timestamp: string }[];
    logActivity: (action: string, details: string) => void;

    // Admin: registered users (simulated)
    registeredUsers: RegisteredUser[];
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Role
            currentRole: null,
            setRole: (role) => set({ currentRole: role }),

            // Theme
            theme: 'dark',
            toggleTheme: () => {
                const next = get().theme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                set({ theme: next });
            },

            // Sidebar
            sidebarCollapsed: false,
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

            // Tasks
            tasks: [],
            addTask: (task) => {
                const newTask: Task = { ...task, id: uid(), createdAt: new Date().toISOString(), actualMinutes: 0, isTimerRunning: false };
                set((s) => ({ tasks: [...s.tasks, newTask] }));
                get().logActivity('Task Created', task.title);
            },
            updateTask: (id, updates) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
            deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
            moveTask: (taskId, newStatus) => {
                set((s) => ({
                    tasks: s.tasks.map((t) =>
                        t.id === taskId ? { ...t, status: newStatus, ...(newStatus === 'done' ? { completedAt: new Date().toISOString() } : {}) } : t
                    ),
                }));
                get().logActivity('Task Moved', `to ${newStatus}`);
            },

            // Habits
            habits: [],
            addHabit: (habit) => set((s) => ({ habits: [...s.habits, { ...habit, id: uid(), createdAt: new Date().toISOString(), streak: 0, bestStreak: 0, completedDates: [] }] })),
            toggleHabitDate: (habitId, date) =>
                set((s) => ({
                    habits: s.habits.map((h) => {
                        if (h.id !== habitId) return h;
                        const has = h.completedDates.includes(date);
                        const completedDates = has ? h.completedDates.filter((d) => d !== date) : [...h.completedDates, date];
                        let streak = 0;
                        const today = new Date();
                        for (let i = 0; i < 365; i++) {
                            const d = new Date(today);
                            d.setDate(d.getDate() - i);
                            const ds = d.toISOString().split('T')[0];
                            if (completedDates.includes(ds)) streak++;
                            else break;
                        }
                        return { ...h, completedDates, streak, bestStreak: Math.max(h.bestStreak, streak) };
                    }),
                })),
            deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

            // Pomodoro
            pomodoroSessions: [],
            addPomodoroSession: (session) => set((s) => ({ pomodoroSessions: [...s.pomodoroSessions, { ...session, id: uid() }] })),
            pomodoroSettings: { focusDuration: 25, breakDuration: 5, longBreakDuration: 15, sessionsBeforeLongBreak: 4 },
            updatePomodoroSettings: (updates) => set((s) => ({ pomodoroSettings: { ...s.pomodoroSettings, ...updates } })),

            // Check-ins
            checkIns: [],
            addCheckIn: (checkIn) => set((s) => ({ checkIns: [...s.checkIns, checkIn] })),

            // Study goals
            studyGoals: [],
            addStudyGoal: (goal) => set((s) => ({ studyGoals: [...s.studyGoals, goal] })),
            updateStudyGoal: (id, updates) => set((s) => ({ studyGoals: s.studyGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)) })),

            // Activity log
            activityLog: [],
            logActivity: (action, details) =>
                set((s) => ({
                    activityLog: [{ id: uid(), action, details, timestamp: new Date().toISOString() }, ...s.activityLog].slice(0, 50),
                })),

            // Admin: mock registered users
            registeredUsers: [],
        }),
        {
            name: 'productivity-app-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.documentElement.setAttribute('data-theme', state.theme);
                }
            },
        }
    )
);

// Generate mock registered users for admin panel
function generateMockUsers(): RegisteredUser[] {
    const names = [
        { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', location: 'New Delhi' },
        { name: 'Ananya Patel', email: 'ananya.patel@gmail.com', location: 'Mumbai' },
        { name: 'Rohan Gupta', email: 'rohan.gupta@outlook.com', location: 'Bangalore' },
        { name: 'Priya Singh', email: 'priya.singh@gmail.com', location: 'Pune' },
        { name: 'Vikram Reddy', email: 'vikram.reddy@yahoo.com', location: 'Hyderabad' },
        { name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com', location: 'Chennai' },
        { name: 'Arjun Nair', email: 'arjun.nair@proton.me', location: 'Kochi' },
        { name: 'Kavya Joshi', email: 'kavya.joshi@gmail.com', location: 'Jaipur' },
        { name: 'Rahul Mishra', email: 'rahul.mishra@outlook.com', location: 'Lucknow' },
        { name: 'Diya Kapoor', email: 'diya.kapoor@gmail.com', location: 'Chandigarh' },
        { name: 'Aditya Verma', email: 'aditya.verma@gmail.com', location: 'Kolkata' },
        { name: 'Ishita Das', email: 'ishita.das@yahoo.com', location: 'Bhopal' },
        { name: 'Karan Mehta', email: 'karan.mehta@gmail.com', location: 'Ahmedabad' },
        { name: 'Neha Saxena', email: 'neha.saxena@outlook.com', location: 'Noida' },
        { name: 'Siddharth Kumar', email: 'sid.kumar@gmail.com', location: 'Patna' },
    ];

    const devices = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro', 'iPad Air', 'Windows Desktop', 'Pixel 8', 'OnePlus 12', 'iPhone 14'];
    const oses = ['iOS 18', 'Android 15', 'macOS Sonoma', 'iPadOS 18', 'Windows 11', 'Android 14', 'OxygenOS 14', 'iOS 17'];
    const browsers = ['Safari', 'Chrome', 'Firefox', 'Edge', 'Brave', 'Arc'];
    const avatars = ['👨‍💻', '👩‍🎓', '👨‍🔬', '👩‍💼', '🧑‍🏫', '👩‍🎨', '🧑‍⚕️', '👨‍🚀', '👩‍🔧', '🧑‍🍳', '👨‍✈️', '👩‍⚖️', '🧑‍🌾', '👩‍🏭', '👨‍🎤'];

    return names.map((n, i) => {
        const daysAgo = Math.floor(Math.random() * 60);
        const joined = new Date();
        joined.setDate(joined.getDate() - daysAgo - 30);
        const lastActive = new Date();
        lastActive.setDate(lastActive.getDate() - Math.floor(Math.random() * 3));
        lastActive.setHours(Math.floor(Math.random() * 12) + 8);

        return {
            id: uid(),
            name: n.name,
            email: n.email,
            avatar: avatars[i % avatars.length],
            joinedAt: joined.toISOString(),
            lastActive: lastActive.toISOString(),
            device: devices[i % devices.length],
            os: oses[i % oses.length],
            browser: browsers[i % browsers.length],
            location: n.location,
            tasksCompleted: Math.floor(Math.random() * 80) + 10,
            totalFocusMinutes: Math.floor(Math.random() * 3000) + 500,
            habitsActive: Math.floor(Math.random() * 6) + 1,
            streak: Math.floor(Math.random() * 30),
            plan: (Math.random() > 0.4 ? 'pro' : 'free') as 'free' | 'pro',
            status: (Math.random() > 0.15 ? 'active' : 'inactive') as 'active' | 'inactive',
        };
    });
}

// Seed with sample data if empty
export function seedSampleData() {
    const state = useStore.getState();

    // Always ensure mock users exist for admin panel
    if (state.registeredUsers.length === 0) {
        useStore.setState({ registeredUsers: generateMockUsers() });
    }

    if (state.tasks.length > 0) return;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const sampleTasks: Omit<Task, 'id' | 'createdAt' | 'actualMinutes' | 'isTimerRunning'>[] = [
        { title: 'Indian Polity - Chapter 3', description: 'Study fundamental rights and directive principles', status: 'todo', priority: 'P1', subject: 'Polity', chapter: 'Chapter 3', estimatedMinutes: 90, subtasks: [{ id: '1', title: 'Read Laxmikanth', completed: false }, { id: '2', title: 'Make notes', completed: false }], dueDate: today, tags: ['UPSC', 'Polity'] },
        { title: 'Economics - GDP & Growth', description: 'Understand GDP calculation methods', status: 'in-progress', priority: 'P2', subject: 'Economics', chapter: 'Chapter 7', estimatedMinutes: 60, subtasks: [], dueDate: today, tags: ['UPSC', 'Economics'] },
        { title: 'Geography - Monsoon Patterns', description: 'Study Indian monsoon system and jet streams', status: 'todo', priority: 'P2', subject: 'Geography', chapter: 'Chapter 5', estimatedMinutes: 75, subtasks: [{ id: '3', title: 'Watch lecture', completed: true }, { id: '4', title: 'Practice MCQs', completed: false }], dueDate: tomorrow, tags: ['UPSC', 'Geography'] },
        { title: 'History - Modern India', description: 'Revolt of 1857 and its impact', status: 'review', priority: 'P1', subject: 'History', chapter: 'Chapter 12', estimatedMinutes: 120, subtasks: [], dueDate: today, tags: ['UPSC', 'History'] },
        { title: 'Current Affairs - February Week 2', description: 'Compile and study current affairs', status: 'todo', priority: 'P3', subject: 'Current Affairs', chapter: '', estimatedMinutes: 45, subtasks: [], dueDate: tomorrow, tags: ['UPSC', 'Current Affairs'] },
        { title: 'Essay Practice - Social Justice', description: 'Write practice essay on social justice themes', status: 'done', priority: 'P2', subject: 'Essay', chapter: '', estimatedMinutes: 120, subtasks: [], dueDate: today, tags: ['UPSC', 'Essay'], completedAt: new Date().toISOString() },
        { title: 'CSAT - Logical Reasoning Set', description: 'Practice 50 logical reasoning questions', status: 'done', priority: 'P3', subject: 'CSAT', chapter: 'Logic', estimatedMinutes: 60, subtasks: [], dueDate: today, tags: ['UPSC', 'CSAT'], completedAt: new Date().toISOString() },
        { title: 'Science & Tech Notes', description: 'ISRO missions and space tech updates', status: 'todo', priority: 'P4', subject: 'Science', chapter: 'Space Tech', estimatedMinutes: 40, subtasks: [], dueDate: nextWeek, tags: ['UPSC', 'Science'] },
    ];

    sampleTasks.forEach((t) => state.addTask(t));

    const sampleHabits = [
        { name: 'Morning Revision', icon: '📖', color: '#6366f1' },
        { name: 'Exercise', icon: '🏃', color: '#10b981' },
        { name: 'Meditation', icon: '🧘', color: '#8b5cf6' },
        { name: 'Read Newspaper', icon: '📰', color: '#f59e0b' },
        { name: 'Answer Writing', icon: '✍️', color: '#f43f5e' },
        { name: 'Sleep by 11 PM', icon: '😴', color: '#06b6d4' },
    ];

    sampleHabits.forEach((h) => state.addHabit(h));

    const habits = useStore.getState().habits;
    habits.forEach((h) => {
        const daysToMark = Math.floor(Math.random() * 7) + 3;
        for (let i = 1; i <= daysToMark; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            state.toggleHabitDate(h.id, d.toISOString().split('T')[0]);
        }
    });

    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        state.addCheckIn({
            date: d.toISOString().split('T')[0],
            mood: Math.floor(Math.random() * 3) + 3,
            energy: Math.floor(Math.random() * 3) + 3,
            focusScore: Math.floor(Math.random() * 30) + 60,
            tasksCompleted: Math.floor(Math.random() * 5) + 2,
            totalMinutes: Math.floor(Math.random() * 180) + 180,
            notes: '',
        });
    }

    for (let i = 0; i < 20; i++) {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 7));
        state.addPomodoroSession({ type: 'focus', duration: 25, completedAt: d.toISOString() });
    }
}
