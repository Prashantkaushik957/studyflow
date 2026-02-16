'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, BarChart3, Settings, ChevronLeft, ChevronRight, Shield, LogOut, Activity,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const collapsed = useStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useStore((s) => s.toggleSidebar);
    const setRole = useStore((s) => s.setRole);
    const registeredUsers = useStore((s) => s.registeredUsers);

    const activeUsers = registeredUsers.filter((u) => u.status === 'active').length;

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
                background: 'var(--surface-sidebar)', backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)', borderRight: '1px solid var(--border-default)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
        >
            {/* Logo */}
            <div style={{ padding: collapsed ? '20px 16px' : '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <Shield size={20} color="white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <h1 style={{ fontSize: 18, fontWeight: 800, background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Admin Panel
                            </h1>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Platform Management</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map((navItem) => {
                    const active = pathname === navItem.href;
                    return (
                        <Link key={navItem.href} href={navItem.href} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: collapsed ? '12px 16px' : '11px 16px', borderRadius: 12,
                                    cursor: 'pointer', position: 'relative',
                                    background: active ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'transparent',
                                    color: active ? 'white' : 'var(--text-secondary)',
                                    fontWeight: active ? 600 : 500, fontSize: 14,
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                }}
                            >
                                <navItem.icon size={20} style={{ flexShrink: 0 }} />
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {navItem.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Stats + Exit */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)' }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                            <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Total Users</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Users size={16} /> {registeredUsers.length}
                                </div>
                            </div>
                            <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Active</div>
                                <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Activity size={16} /> {activeUsers}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => { setRole(null); router.push('/'); }}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                        >
                            <LogOut size={16} /> Switch to Portal
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapse Toggle */}
            <button
                onClick={toggleSidebar}
                style={{
                    position: 'absolute', top: 28, right: -14, width: 28, height: 28,
                    borderRadius: '50%', background: 'var(--surface-card)',
                    border: '1px solid var(--border-default)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: 'var(--text-secondary)', boxShadow: 'var(--shadow-md)', zIndex: 60,
                }}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </motion.aside>
    );
}
