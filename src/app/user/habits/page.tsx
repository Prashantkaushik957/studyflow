'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, X, Check, Award, TrendingUp, Calendar } from 'lucide-react';

import { useStore } from '@/lib/store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const EMOJI_OPTIONS = ['📖', '🏃', '🧘', '📰', '✍️', '😴', '💧', '🍎', '🎯', '💪', '🧠', '📝', '🎨', '🎸', '👨‍💻'];
const COLOR_OPTIONS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#14b8a6'];

function HabitCard({ habit }: { habit: ReturnType<typeof useStore.getState>['habits'][0] }) {
    const toggleHabitDate = useStore((s) => s.toggleHabitDate);
    const deleteHabit = useStore((s) => s.deleteHabit);
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completedDates.includes(today);

    // Last 7 days
    const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const ds = d.toISOString().split('T')[0];
        return { date: ds, completed: habit.completedDates.includes(ds), day: d.toLocaleDateString('en-US', { weekday: 'narrow' }) };
    });

    // Monthly mini heatmap (last 30 days)
    const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return { date: d.toISOString().split('T')[0], completed: habit.completedDates.includes(d.toISOString().split('T')[0]) };
    });

    return (
        <motion.div
            variants={item}
            className="glass-card"
            style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
        >
            {/* Gradient accent top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: habit.color }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 28 }}>{habit.icon}</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{habit.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                            <Flame size={13} style={{ color: habit.streak > 0 ? '#f59e0b' : 'var(--text-muted)' }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: habit.streak > 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                                {habit.streak} day streak
                            </span>
                            {habit.bestStreak > 0 && (
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• Best: {habit.bestStreak}</span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => deleteHabit(habit.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, opacity: 0.5, borderRadius: 6 }}
                >
                    <X size={14} />
                </button>
            </div>

            {/* Week view */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {last7.map((d) => (
                    <motion.button
                        key={d.date}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleHabitDate(habit.id, d.date)}
                        style={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
                            border: d.date === today ? `2px solid ${habit.color}` : '1px solid var(--border-default)',
                            background: d.completed ? `${habit.color}18` : 'var(--surface-input)',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{d.day}</span>
                        {d.completed ? (
                            <Check size={16} style={{ color: habit.color }} />
                        ) : (
                            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--border-default)' }} />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Monthly mini heatmap */}
            <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>Last 30 days</div>
                <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {last30.map((d) => (
                        <div
                            key={d.date}
                            style={{
                                width: 10, height: 10, borderRadius: 2,
                                background: d.completed ? habit.color : 'var(--surface-input)',
                                opacity: d.completed ? 1 : 0.4,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Today toggle */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleHabitDate(habit.id, today)}
                style={{
                    width: '100%', marginTop: 14, padding: '10px', borderRadius: 10, border: 'none',
                    background: isCompletedToday ? habit.color : 'var(--surface-input)',
                    color: isCompletedToday ? 'white' : 'var(--text-secondary)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.2s',
                }}
            >
                {isCompletedToday ? <><Check size={16} /> Completed Today!</> : 'Mark as Done Today'}
            </motion.button>
        </motion.div>
    );
}

function CreateHabitModal({ onClose }: { onClose: () => void }) {
    const addHabit = useStore((s) => s.addHabit);
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('📖');
    const [color, setColor] = useState('#6366f1');

    const handleCreate = () => {
        if (!name.trim()) return;
        addHabit({ name, icon, color });
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 420, padding: 28, borderRadius: 20,
                    background: 'var(--surface-modal)', backdropFilter: 'blur(24px)',
                    border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>New Habit</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={18} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Habit Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Morning Meditation"
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                border: '1px solid var(--border-default)', background: 'var(--surface-input)',
                                color: 'var(--text-primary)', fontSize: 14, outline: 'none', fontFamily: 'inherit',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Icon</label>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {EMOJI_OPTIONS.map((e) => (
                                <button
                                    key={e}
                                    onClick={() => setIcon(e)}
                                    style={{
                                        width: 40, height: 40, borderRadius: 10, fontSize: 20, cursor: 'pointer',
                                        border: icon === e ? '2px solid var(--primary-500)' : '1px solid var(--border-default)',
                                        background: icon === e ? 'rgba(99,102,241,0.1)' : 'var(--surface-input)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Color</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    style={{
                                        width: 32, height: 32, borderRadius: 8, background: c, cursor: 'pointer',
                                        border: color === c ? '3px solid white' : 'none',
                                        boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button onClick={handleCreate} className="btn-gradient" style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 14 }}>
                            Create Habit
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function HabitsPage() {
    const habits = useStore((s) => s.habits);
    const [showModal, setShowModal] = useState(false);

    const totalStreaks = habits.reduce((s, h) => s + h.streak, 0);
    const bestStreak = Math.max(...habits.map((h) => h.bestStreak), 0);
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter((h) => h.completedDates.includes(today)).length;

    return (
        
            <motion.div variants={container} initial="hidden" animate="show">
                {/* Header */}
                <motion.div variants={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Flame size={28} style={{ color: '#f59e0b' }} />
                            Habit Tracker
                        </h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Build consistency with daily habit tracking and streaks</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowModal(true)}
                        className="btn-gradient"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 14, fontSize: 14 }}
                    >
                        <Plus size={18} /> New Habit
                    </motion.button>
                </motion.div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Active Habits', value: habits.length, icon: TrendingUp, color: '#6366f1' },
                        { label: 'Done Today', value: `${completedToday}/${habits.length}`, icon: Check, color: '#10b981' },
                        { label: 'Total Streaks', value: totalStreaks, icon: Flame, color: '#f59e0b' },
                        { label: 'Best Streak', value: `${bestStreak} days`, icon: Award, color: '#8b5cf6' },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={item} className="glass-card" style={{ flex: 1, minWidth: 160, padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <stat.icon size={16} style={{ color: stat.color }} />
                                </div>
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Habits Grid */}
                <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                    {habits.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} />
                    ))}
                </motion.div>

                {habits.length === 0 && (
                    <motion.div variants={item} style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No habits yet</div>
                        <div style={{ fontSize: 14 }}>Start building your daily routine by adding your first habit!</div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {showModal && <CreateHabitModal onClose={() => setShowModal(false)} />}
                </AnimatePresence>
            </motion.div>
        
    );
}
