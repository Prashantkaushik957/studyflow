'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CheckSquare,
    BarChart3,
    BookOpen,
    Timer,
    Flame,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Zap,
    LogOut,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const navItems = [
    { href: '/user', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/user/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/user/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/user/study', icon: BookOpen, label: 'Study Planner' },
    { href: '/user/pomodoro', icon: Timer, label: 'Pomodoro' },
    { href: '/user/habits', icon: Flame, label: 'Habits' },
    { href: '/user/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const collapsed = useStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useStore((s) => s.toggleSidebar);
    const tasks = useStore((s) => s.tasks);
    const habits = useStore((s) => s.habits);

    const completedToday = tasks.filter(
        (t) => t.completedAt && t.completedAt.startsWith(new Date().toISOString().split('T')[0])
    ).length;

    const activeStreak = Math.max(...habits.map((h) => h.streak), 0);

    return (
        <motion.aside
            className="sidebar-container"
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 50,
                background: 'var(--surface-sidebar)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRight: '1px solid var(--border-default)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Logo */}
            <div style={{ padding: collapsed ? '20px 16px' : '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Sparkles size={20} color="white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                        >
                            <h1 style={{ fontSize: 18, fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                StudyFlow
                            </h1>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>AI-Powered Productivity</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: collapsed ? '12px 16px' : '11px 16px',
                                    borderRadius: 12,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    background: active ? 'var(--gradient-primary)' : 'transparent',
                                    color: active ? 'white' : 'var(--text-secondary)',
                                    fontWeight: active ? 600 : 500,
                                    fontSize: 14,
                                    transition: 'all 0.2s',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                }}
                            >
                                <item.icon size={20} style={{ flexShrink: 0 }} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {active && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: 12,
                                            background: 'var(--gradient-primary)',
                                            zIndex: -1,
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Quick Stats */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)' }}
                    >
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                            <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Done Today</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Zap size={16} /> {completedToday}
                                </div>
                            </div>
                            <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Streak</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Flame size={16} /> {activeStreak}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                useStore.getState().setRole(null);
                                window.location.href = '/';
                            }}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                                color: '#818cf8', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
                        >
                            <LogOut size={16} /> Switch Portal
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapse Toggle */}
            <button
                onClick={toggleSidebar}
                style={{
                    position: 'absolute',
                    top: 28,
                    right: -14,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 60,
                }}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </motion.aside>
    );
}
