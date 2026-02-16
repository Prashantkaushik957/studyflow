'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, Target, CheckCircle2, TrendingUp, Clock, Brain, Flame, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function UserDashboardPage() {
    const tasks = useStore((s) => s.tasks);
    const habits = useStore((s) => s.habits);
    const checkIns = useStore((s) => s.checkIns);
    const pomodoroSessions = useStore((s) => s.pomodoroSessions);

    const today = new Date().toISOString().split('T')[0];
    const completedToday = tasks.filter((t) => t.completedAt?.startsWith(today)).length;
    const totalTasks = tasks.length;
    const productivityScore = checkIns.length
        ? Math.round(checkIns.slice(0, 7).reduce((s, c) => s + c.focusScore, 0) / Math.min(checkIns.length, 7))
        : 78;
    const totalHours = (checkIns.reduce((s, c) => s + c.totalMinutes, 0) / 60).toFixed(1);
    const activeStreak = Math.max(...habits.map((h) => h.streak), 0);

    const activityData = useMemo(() => {
        const data = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const ci = checkIns.find((c) => c.date === ds);
            data.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                hours: ci ? +(ci.totalMinutes / 60).toFixed(1) : +(Math.random() * 3 + 2).toFixed(1),
                focus: ci ? ci.focusScore : Math.floor(Math.random() * 20 + 65),
            });
        }
        return data;
    }, [checkIns]);

    const todayTasks = tasks.filter((t) => t.dueDate === today || t.status === 'in-progress').slice(0, 5);

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    })();

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            {/* Greeting */}
            <motion.div variants={item} style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
                    {greeting}, Scholar! 👋
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    Here&apos;s your productivity overview for today
                </p>
            </motion.div>

            {/* Productivity Score + Stats */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                {/* Score Gauge */}
                <motion.div variants={item} className="glass-card" style={{ padding: 28, minWidth: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 12 }}>
                        <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-default)" strokeWidth="8" />
                            <motion.circle
                                cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGradient)" strokeWidth="8"
                                strokeLinecap="round" strokeDasharray={2 * Math.PI * 52}
                                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - productivityScore / 100) }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 28, fontWeight: 800 }}>{productivityScore}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score</span>
                        </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Productivity Score</div>
                </motion.div>

                {/* Stat Cards */}
                {[
                    { icon: CheckCircle2, label: 'Completed Today', value: completedToday, color: '#10b981' },
                    { icon: Target, label: 'Total Tasks', value: totalTasks, color: '#6366f1' },
                    { icon: Clock, label: 'Study Hours', value: `${totalHours}h`, color: '#8b5cf6' },
                    { icon: Flame, label: 'Best Streak', value: `${activeStreak}d`, color: '#f59e0b' },
                ].map((stat, i) => (
                    <motion.div key={i} variants={item} className="glass-card" style={{ flex: 1, minWidth: 160, padding: 20 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                            <stat.icon size={18} style={{ color: stat.color }} />
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>{stat.value}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Activity Chart + Today's Tasks */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                <motion.div variants={item} className="glass-card-static" style={{ flex: 1.5, padding: 24, minWidth: 400 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Activity Overview</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Daily study hours over the past 2 weeks</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="h" />
                            <Tooltip />
                            <Area type="monotone" dataKey="hours" stroke="#6366f1" fill="url(#actGrad)" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div variants={item} className="glass-card-static" style={{ flex: 1, padding: 24, minWidth: 280 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Today&apos;s Tasks</h3>
                        <BookOpen size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    {todayTasks.map((task) => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: task.status === 'done' ? '#10b981' : task.status === 'in-progress' ? '#f59e0b' : '#6366f1',
                            }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.5 : 1 }}>
                                    {task.title}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.subject} · {task.estimatedMinutes}min</div>
                            </div>
                            <span style={{
                                padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                                background: task.priority === 'P1' ? 'rgba(244,63,94,0.12)' : task.priority === 'P2' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)',
                                color: task.priority === 'P1' ? '#f43f5e' : task.priority === 'P2' ? '#f59e0b' : '#6366f1',
                            }}>{task.priority}</span>
                        </div>
                    ))}
                    {todayTasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No tasks for today! 🎉</p>}
                </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div variants={item}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Brain size={20} style={{ color: '#8b5cf6' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Insights</h3>
                    <Sparkles size={14} style={{ color: '#f59e0b' }} />
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[
                        { title: 'Peak Performance', desc: 'Your focus peaks between 9-11AM. Schedule challenging subjects during this window for optimal learning.', color: '#6366f1' },
                        { title: 'Habit Momentum', desc: `You've been consistent with ${habits.filter(h => h.streak > 0).length} habits. Keep it going to build long-term discipline!`, color: '#10b981' },
                        { title: 'Session Tip', desc: `${pomodoroSessions.length} Pomodoro sessions logged. Try pairing with ambient sounds for deeper focus.`, color: '#f59e0b' },
                    ].map((insight, i) => (
                        <motion.div key={i} variants={item} className="glass-card" style={{ flex: 1, padding: 20, minWidth: 240, cursor: 'pointer' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: insight.color, marginBottom: 12 }} />
                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{insight.title}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{insight.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
