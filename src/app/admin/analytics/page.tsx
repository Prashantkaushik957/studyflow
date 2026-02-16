'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Users, Clock, Target, Repeat, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/lib/store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

export default function AdminAnalyticsPage() {
    const registeredUsers = useStore((s) => s.registeredUsers);

    // Feature usage
    const featureUsage = useMemo(() => [
        { feature: 'Dashboard', users: Math.round(registeredUsers.length * 0.95) },
        { feature: 'Tasks', users: Math.round(registeredUsers.length * 0.88) },
        { feature: 'Pomodoro', users: Math.round(registeredUsers.length * 0.72) },
        { feature: 'Habits', users: Math.round(registeredUsers.length * 0.65) },
        { feature: 'Analytics', users: Math.round(registeredUsers.length * 0.55) },
        { feature: 'Study Plan', users: Math.round(registeredUsers.length * 0.48) },
    ], [registeredUsers]);

    // Retention curve
    const retentionData = useMemo(() => [
        { week: 'W1', rate: 100 },
        { week: 'W2', rate: 78 },
        { week: 'W3', rate: 65 },
        { week: 'W4', rate: 58 },
        { week: 'W5', rate: 52 },
        { week: 'W6', rate: 48 },
        { week: 'W7', rate: 45 },
        { week: 'W8', rate: 42 },
    ], []);

    // Location distribution
    const locationData = useMemo(() => {
        const map: Record<string, number> = {};
        registeredUsers.forEach((u) => { map[u.location] = (map[u.location] || 0) + 1; });
        return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
    }, [registeredUsers]);

    // Engagement over time
    const engagementData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            data.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                sessions: Math.floor(Math.random() * 30 + 40),
                avgDuration: Math.floor(Math.random() * 20 + 25),
            });
        }
        return data;
    }, []);

    const totalTasks = registeredUsers.reduce((s, u) => s + u.tasksCompleted, 0);
    const totalHours = Math.round(registeredUsers.reduce((s, u) => s + u.totalFocusMinutes, 0) / 60);
    const avgRetention = '58%';
    const dailyActive = Math.round(registeredUsers.filter(u => u.status === 'active').length * 0.7);

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BarChart3 size={28} style={{ color: '#8b5cf6' }} />Platform Analytics
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Aggregate engagement and usage metrics</p>
            </motion.div>

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { icon: Target, label: 'Total Tasks Done', value: totalTasks.toLocaleString(), color: '#6366f1' },
                    { icon: Clock, label: 'Total Focus Hours', value: `${totalHours.toLocaleString()}h`, color: '#8b5cf6' },
                    { icon: Repeat, label: 'Avg Retention', value: avgRetention, color: '#06b6d4' },
                    { icon: Users, label: 'Daily Active', value: dailyActive.toString(), color: '#10b981' },
                ].map((c, i) => (
                    <motion.div key={i} variants={item} className="glass-card" style={{ flex: 1, minWidth: 180, padding: '18px 22px' }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                            <c.icon size={18} style={{ color: c.color }} />
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>{c.value}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                <motion.div variants={item} className="glass-card-static" style={{ flex: 1, padding: 24, minWidth: 360 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Feature Usage</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Number of users per feature</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={featureUsage} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                            <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="feature" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip />
                            <Bar dataKey="users" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={18} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div variants={item} className="glass-card-static" style={{ flex: 1, padding: 24, minWidth: 340 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Retention Curve</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Weekly user retention since signup</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={retentionData}>
                            <defs>
                                <linearGradient id="retGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#f43f5e" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                            <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="rate" stroke="url(#retGrad)" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} name="Retention %" />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <motion.div variants={item} className="glass-card-static" style={{ flex: 1.2, padding: 24, minWidth: 360 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Daily Engagement</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Sessions and average duration this week</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="sessions" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Sessions" />
                            <Bar dataKey="avgDuration" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Avg Duration (min)" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div variants={item} className="glass-card-static" style={{ flex: 0.8, padding: 24, minWidth: 280 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>User Locations</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Top cities</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={locationData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                {locationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                        {locationData.map((d, i) => (
                            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                                {d.name}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
