'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings, Moon, Sun, Monitor, Bell, Download, User, Palette,
    Clock, Shield, Database, ChevronRight, Check, Trash2, Info, Upload, ImageIcon
} from 'lucide-react';

import { useStore } from '@/lib/store';
import { DataManager } from '@/lib/data-manager';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
    return (
        <motion.div variants={item} className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: '#6366f1' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
            </div>
            {children}
        </motion.div>
    );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0',
            borderBottom: '1px solid var(--border-default)',
        }}>
            <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                {description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{description}</div>}
            </div>
            {children}
        </div>
    );
}

const backgrounds = [
    { id: 'bg_app', name: 'Deep Cosmos (Default)', src: '/assets/bg_app.png' },
    { id: 'bg_cyberpunk_loft', name: 'Cyberpunk Loft', src: '/assets/bg_cyberpunk_loft.png' },
    { id: 'bg_forest_retreat', name: 'Forest Retreat', src: '/assets/bg_forest_retreat.png' },
    { id: 'bg_study_room_rain', name: 'Rainy Study', src: '/assets/bg_study_room_rain.png' },
    { id: 'bg_grand_library', name: 'Grand Library', src: '/assets/bg_grand_library.png' },
    { id: 'bg_zen_garden', name: 'Zen Garden', src: '/assets/bg_zen_garden.png' },
];

export default function SettingsPage() {
    const { theme, toggleTheme, currentRole, setRole, background, setBackground } = useStore((s) => ({
        theme: s.theme,
        toggleTheme: s.toggleTheme,
        currentRole: s.currentRole,
        setRole: s.setRole,
        background: s.background,
        setBackground: s.setBackground,
    }));
    const [activeTab, setActiveTab] = useState('profile');

    // Mock user for display since we don't have auth
    const user = {
        name: 'Prashant Kaushik',
        email: 'prashant@example.com',
        avatar: '👨‍💻',
        role: currentRole
    };

    const logout = () => {
        setRole(null);
        window.location.href = '/'; // Force reload/redirect to landing
    };
    const pomodoroSettings = useStore((s) => s.pomodoroSettings);
    const updatePomodoroSettings = useStore((s) => s.updatePomodoroSettings);
    const tasks = useStore((s) => s.tasks);
    const habits = useStore((s) => s.habits);
    const checkIns = useStore((s) => s.checkIns);

    const [notifications, setNotifications] = useState({
        taskReminders: true,
        breakReminders: true,
        dailyReport: true,
        achievements: true,
        motivational: false,
    });

    const [profile, setProfile] = useState({
        name: 'Prashant Kaushik',
        email: 'prashant@example.com',
        examGoal: 'UPSC CSE 2027',
    });

    const exportData = (format: 'json' | 'csv') => {
        const data = { tasks, habits, checkIns };
        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            filename = 'studyflow-data.json';
            mimeType = 'application/json';
        } else {
            const headers = ['Title', 'Subject', 'Status', 'Priority', 'Due Date', 'Estimated Min', 'Created'];
            const rows = tasks.map((t) => [t.title, t.subject, t.status, t.priority, t.dueDate, t.estimatedMinutes, t.createdAt].join(','));
            content = [headers.join(','), ...rows].join('\n');
            filename = 'studyflow-tasks.csv';
            mimeType = 'text/csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearAllData = () => {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('productivity-app-storage');
            window.location.reload();
        }
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid var(--border-default)',
        background: 'var(--surface-input)',
        color: 'var(--text-primary)',
        fontSize: 14,
        outline: 'none',
        fontFamily: 'inherit',
        width: '100%',
    };

    return (

        <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Header */}
            <motion.div variants={item} style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Settings size={28} style={{ color: 'var(--primary-500)' }} />
                    Settings
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Customize your StudyFlow experience</p>
            </motion.div>

            {/* Profile */}
            <SettingSection title="Profile" icon={User}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Name</label>
                        <input style={inputStyle} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label>
                        <input style={inputStyle} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Exam Goal</label>
                        <input style={inputStyle} value={profile.examGoal} onChange={(e) => setProfile({ ...profile, examGoal: e.target.value })} />
                    </div>
                </div>
            </SettingSection>


            <SettingSection title="Appearance" icon={Monitor}>
                <SettingRow label="Theme" description="Toggle between Light and Dark mode">
                    <button
                        onClick={toggleTheme}
                        className="px-4 py-2 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-sm font-medium hover:bg-[var(--surface-active)] transition-colors"
                    >
                        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                </SettingRow>

                <div className="pt-6 border-t border-[var(--border-subtle)] mt-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <ImageIcon size={20} className="text-[var(--primary)]" />
                        Environment
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {backgrounds.map((bg) => (
                            <button
                                key={bg.id}
                                onClick={() => setBackground(bg.src)}
                                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${background === bg.src
                                    ? 'border-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
                                    : 'border-transparent hover:border-[var(--border-strong)]'
                                    }`}
                            >
                                <img
                                    src={bg.src}
                                    alt={bg.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white font-medium text-sm">{bg.name}</span>
                                </div>
                                {background === bg.src && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-black text-xs font-bold">
                                        ✓
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </SettingSection>

            {/* Pomodoro Settings */}
            < SettingSection title="Pomodoro Timer" icon={Clock} >
                <SettingRow label="Focus Duration" description="Minutes per focus session">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {[15, 25, 30, 45, 60].map((mins) => (
                            <button
                                key={mins}
                                onClick={() => updatePomodoroSettings({ focusDuration: mins })}
                                style={{
                                    padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    border: pomodoroSettings.focusDuration === mins ? '2px solid var(--primary-500)' : '1px solid var(--border-default)',
                                    background: pomodoroSettings.focusDuration === mins ? 'rgba(99,102,241,0.1)' : 'var(--surface-input)',
                                    color: pomodoroSettings.focusDuration === mins ? 'var(--primary-500)' : 'var(--text-secondary)',
                                }}
                            >
                                {mins}m
                            </button>
                        ))}
                    </div>
                </SettingRow>
                <SettingRow label="Break Duration" description="Minutes per short break">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {[3, 5, 10, 15].map((mins) => (
                            <button
                                key={mins}
                                onClick={() => updatePomodoroSettings({ breakDuration: mins })}
                                style={{
                                    padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    border: pomodoroSettings.breakDuration === mins ? '2px solid var(--primary-500)' : '1px solid var(--border-default)',
                                    background: pomodoroSettings.breakDuration === mins ? 'rgba(99,102,241,0.1)' : 'var(--surface-input)',
                                    color: pomodoroSettings.breakDuration === mins ? 'var(--primary-500)' : 'var(--text-secondary)',
                                }}
                            >
                                {mins}m
                            </button>
                        ))}
                    </div>
                </SettingRow>
                <SettingRow label="Long Break Duration" description="Minutes per long break">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {[10, 15, 20, 30].map((mins) => (
                            <button
                                key={mins}
                                onClick={() => updatePomodoroSettings({ longBreakDuration: mins })}
                                style={{
                                    padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    border: pomodoroSettings.longBreakDuration === mins ? '2px solid var(--primary-500)' : '1px solid var(--border-default)',
                                    background: pomodoroSettings.longBreakDuration === mins ? 'rgba(99,102,241,0.1)' : 'var(--surface-input)',
                                    color: pomodoroSettings.longBreakDuration === mins ? 'var(--primary-500)' : 'var(--text-secondary)',
                                }}
                            >
                                {mins}m
                            </button>
                        ))}
                    </div>
                </SettingRow>
            </SettingSection >

            {/* Notifications */}
            < SettingSection title="Notifications" icon={Bell} >
                {
                    Object.entries(notifications).map(([key, value]) => (
                        <SettingRow
                            key={key}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                            description={{ taskReminders: 'Get reminded before task deadlines', breakReminders: 'Reminders to take breaks', dailyReport: 'Daily summary of progress', achievements: 'Celebrate milestones', motivational: 'Inspirational quotes during study' }[key]}
                        >
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                style={{
                                    width: 48, height: 28, borderRadius: 14, padding: 3, cursor: 'pointer',
                                    background: value ? 'var(--primary-500)' : 'var(--border-default)',
                                    border: 'none', display: 'flex', alignItems: 'center',
                                    justifyContent: value ? 'flex-end' : 'flex-start',
                                    transition: 'background 0.2s',
                                }}
                            >
                                <motion.div
                                    layout
                                    style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', boxShadow: 'var(--shadow-sm)' }}
                                />
                            </motion.button>
                        </SettingRow>
                    ))
                }
            </SettingSection >

            {/* Data Management */}
            < SettingSection title="Data Management" icon={Database} >
                <SettingRow label="Export Data" description="Download your data as JSON or CSV">
                    <div style={{ display: 'flex', gap: 10 }}>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => DataManager.exportData()}
                            style={{
                                padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-primary)',
                                background: 'var(--bg-input)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
                            }}
                        >
                            <Download size={14} /> Backup (JSON)
                        </motion.button>
                    </div>
                </SettingRow>

                <SettingRow label="Import Data" description="Restore from a backup file">
                    <div style={{ position: 'relative' }}>
                        <input
                            type="file"
                            accept=".json"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const result = await DataManager.importData(file);
                                    alert(result.message);
                                    if (result.success) window.location.reload();
                                }
                            }}
                            style={{
                                position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'
                            }}
                        />
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-primary)',
                                background: 'var(--bg-input)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
                            }}
                        >
                            <Upload size={14} /> Restore from File
                        </motion.button>
                    </div>
                </SettingRow>

                <SettingRow label="Clear All Data" description="⚠️ This cannot be undone">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={clearAllData}
                        style={{
                            padding: '8px 16px', borderRadius: 8, border: '1px solid #3f0e0e',
                            background: '#1c0505', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            color: '#ef4444', fontSize: 13, fontWeight: 600,
                        }}
                    >
                        <Trash2 size={14} /> Clear Data
                    </motion.button>
                </SettingRow>
            </SettingSection >

            {/* About */}
            < motion.div variants={item} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                <p style={{ fontWeight: 600 }}>StudyFlow v1.0.0</p>
                <p style={{ marginTop: 4 }}>AI-Powered Productivity & Study Management</p>
            </motion.div >
        </motion.div >

    );
}
