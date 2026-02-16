'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp, Brain, Clock, Target, BookOpen, Award, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { useStore } from '@/lib/store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899'];

function MetricCard({ label, value, trend, trendUp, icon: Icon, color }: { label: string; value: string; trend: string; trendUp: boolean; icon: React.ElementType; color: string }) {
    return (
        <motion.div variants={item} className="glass-card" style={{ padding: '20px 24px', flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color }} />
                </div>
                <span style={{
                    display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600,
                    color: trendUp ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    padding: '3px 8px', borderRadius: 6,
                    background: trendUp ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                }}>
                    {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {trend}
                </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
        </motion.div>
    );
}

export default function AnalyticsPage() {
    const tasks = useStore((s) => s.tasks);
    const checkIns = useStore((s) => s.checkIns);
    const pomodoroSessions = useStore((s) => s.pomodoroSessions);

    // Focus time data (last 7 days)
    const focusData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const ci = checkIns.find((c) => c.date === ds);
            data.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                hours: ci ? +(ci.totalMinutes / 60).toFixed(1) : +(Math.random() * 4 + 2).toFixed(1),
                focus: ci ? ci.focusScore : Math.floor(Math.random() * 25 + 60),
            });
        }
        return data;
    }, [checkIns]);

    // Subject distribution
    const subjectData = useMemo(() => {
        const map: Record<string, number> = {};
        tasks.forEach((t) => {
            if (t.subject) map[t.subject] = (map[t.subject] || 0) + t.estimatedMinutes;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [tasks]);

    // Task completion rate
    const completionData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const total = tasks.filter((t) => t.dueDate === ds).length || Math.floor(Math.random() * 3 + 4);
            const done = tasks.filter((t) => t.completedAt?.startsWith(ds)).length || Math.floor(Math.random() * total);
            data.push({
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                completed: done,
                total,
                rate: total > 0 ? Math.round((done / total) * 100) : 0,
            });
        }
        return data;
    }, [tasks]);

    const totalHours = checkIns.reduce((s, c) => s + c.totalMinutes, 0) / 60;
    const avgFocus = checkIns.length ? Math.round(checkIns.reduce((s, c) => s + c.focusScore, 0) / checkIns.length) : 76;
    const totalPomodoros = pomodoroSessions.length;
    const completionRate = tasks.length
        ? Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
        : 0;

    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
        if (!active || !payload) return null;
        return (
            <div style={{
                background: 'var(--surface-modal)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-default)',
                borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-lg)',
            }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                {payload.map((p, i) => (
                    <div key={i} style={{ fontSize: 12, color: p.color, display: 'flex', gap: 6 }}>
                        <span>{p.name}:</span><span style={{ fontWeight: 700 }}>{p.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        
            <motion.div variants={container} initial="hidden" animate="show">
                {/* Header */}
                <motion.div variants={item} style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BarChart3 size={28} style={{ color: 'var(--primary-500)' }} />
                        Analytics
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Track your productivity patterns and performance metrics</p>
                </motion.div>

                {/* Metric Cards */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    <MetricCard icon={Clock} label="Total Study Hours" value={`${totalHours.toFixed(1)}h`} trend="+12%" trendUp color="#6366f1" />
                    <MetricCard icon={Target} label="Avg Focus Score" value={`${avgFocus}%`} trend="+5%" trendUp color="#8b5cf6" />
                    <MetricCard icon={Award} label="Pomodoro Sessions" value={`${totalPomodoros}`} trend="+8" trendUp color="#06b6d4" />
                    <MetricCard icon={TrendingUp} label="Completion Rate" value={`${completionRate}%`} trend="+3%" trendUp color="#10b981" />
                </div>

                {/* Charts Row 1 */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                    {/* Focus Hours */}
                    <motion.div variants={item} className="glass-card-static" style={{ flex: 1.5, padding: 24, minWidth: 400 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Focus Hours</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Daily study time over the past week</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={focusData}>
                                <defs>
                                    <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit="h" />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="hours" stroke="#6366f1" fill="url(#focusGrad)" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Subject Distribution */}
                    <motion.div variants={item} className="glass-card-static" style={{ flex: 1, padding: 24, minWidth: 280 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Subject Distribution</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Time allocation by subject</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={subjectData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={((props: { name?: string; percent?: number }) => `${props.name ?? ''} ${(((props.percent) ?? 0) * 100).toFixed(0)}%`) as never}>
                                    {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Charts Row 2 */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                    {/* Task Completion */}
                    <motion.div variants={item} className="glass-card-static" style={{ flex: 1, padding: 24, minWidth: 340 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Task Completion</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Completed vs total tasks per day</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={completionData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total" fill="rgba(148,163,184,0.2)" radius={[6, 6, 0, 0]} name="Total" />
                                <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} name="Completed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Focus Score Trend */}
                    <motion.div variants={item} className="glass-card-static" style={{ flex: 1, padding: 24, minWidth: 340 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Focus Score Trend</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Your concentration levels over time</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={focusData}>
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="focus" stroke="url(#scoreGrad)" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="Focus Score" />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* AI Insights Row */}
                <motion.div variants={item}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Brain size={20} style={{ color: '#8b5cf6' }} />
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Performance Insights</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {[
                            { title: 'Optimal Study Windows', desc: 'Your best focus periods are 9-11AM and 7-9PM. Schedule difficult subjects during these times for 40% better retention.', color: '#6366f1' },
                            { title: 'Subject Balance Alert', desc: 'Geography and Science subjects need 25% more attention this week to maintain your target completion rate.', color: '#f59e0b' },
                            { title: 'Productivity Forecast', desc: 'At current pace, you\'ll complete 85% of your syllabus by target date. Adding 30 min daily would push this to 95%.', color: '#10b981' },
                        ].map((insight, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                className="glass-card"
                                style={{ flex: 1, padding: 20, minWidth: 260, cursor: 'pointer' }}
                            >
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
