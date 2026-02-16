'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Download, Mail, Smartphone, Globe, Clock, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function AdminUsersPage() {
    const registeredUsers = useStore((s) => s.registeredUsers);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro'>('all');

    const filtered = registeredUsers.filter((u) => {
        if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter !== 'all' && u.status !== statusFilter) return false;
        if (planFilter !== 'all' && u.plan !== planFilter) return false;
        return true;
    });

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Users size={28} style={{ color: '#6366f1' }} />
                    User Management
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>View and manage all registered users and their devices</p>
            </motion.div>

            {/* Filters */}
            <motion.div variants={item} style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        style={{
                            width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10,
                            border: '1px solid var(--border-default)', background: 'var(--surface-input)',
                            color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {(['all', 'active', 'inactive'] as const).map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)} style={{
                            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            border: '1px solid', cursor: 'pointer',
                            background: statusFilter === s ? (s === 'active' ? 'rgba(16,185,129,0.12)' : s === 'inactive' ? 'rgba(244,63,94,0.12)' : 'rgba(99,102,241,0.12)') : 'transparent',
                            borderColor: statusFilter === s ? (s === 'active' ? 'rgba(16,185,129,0.3)' : s === 'inactive' ? 'rgba(244,63,94,0.3)' : 'rgba(99,102,241,0.3)') : 'var(--border-default)',
                            color: statusFilter === s ? (s === 'active' ? '#10b981' : s === 'inactive' ? '#f43f5e' : '#6366f1') : 'var(--text-secondary)',
                        }}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {(['all', 'free', 'pro'] as const).map((p) => (
                        <button key={p} onClick={() => setPlanFilter(p)} style={{
                            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            border: '1px solid', cursor: 'pointer',
                            background: planFilter === p ? 'rgba(139,92,246,0.12)' : 'transparent',
                            borderColor: planFilter === p ? 'rgba(139,92,246,0.3)' : 'var(--border-default)',
                            color: planFilter === p ? '#a78bfa' : 'var(--text-secondary)',
                        }}>{p === 'all' ? 'All Plans' : p.toUpperCase()}</button>
                    ))}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                    Showing {filtered.length} of {registeredUsers.length} users
                </span>
            </motion.div>

            {/* User Table */}
            <motion.div variants={item} className="glass-card-static" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                        <thead>
                            <tr style={{ background: 'var(--surface-card)' }}>
                                {['User', 'Email', 'Device / OS', 'Browser', 'Location', 'Tasks', 'Focus Hours', 'Streak', 'Plan', 'Status', 'Last Active'].map((h) => (
                                    <th key={h} style={{ padding: '12px 14px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, idx) => (
                                <tr
                                    key={u.id}
                                    style={{
                                        borderBottom: '1px solid var(--border-default)',
                                        background: idx % 2 === 0 ? 'transparent' : 'rgba(99,102,241,0.02)',
                                    }}
                                >
                                    <td style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 24 }}>{u.avatar}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                                    </td>
                                    <td style={{ padding: '14px', fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Mail size={12} /> {u.email}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px', fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Smartphone size={12} /> {u.device}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{u.os}</div>
                                    </td>
                                    <td style={{ padding: '14px', fontSize: 12, color: 'var(--text-secondary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Globe size={12} /> {u.browser}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px', fontSize: 12, color: 'var(--text-secondary)' }}>{u.location}</td>
                                    <td style={{ padding: '14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircle2 size={13} style={{ color: '#10b981' }} /> {u.tasksCompleted}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={13} style={{ color: '#8b5cf6' }} /> {(u.totalFocusMinutes / 60).toFixed(0)}h
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px', fontSize: 13, fontWeight: 600 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}>
                                            <Flame size={13} /> {u.streak}d
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                                            background: u.plan === 'pro' ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))' : 'rgba(148,163,184,0.1)',
                                            color: u.plan === 'pro' ? '#a78bfa' : 'var(--text-muted)',
                                            border: u.plan === 'pro' ? '1px solid rgba(139,92,246,0.3)' : '1px solid var(--border-default)',
                                        }}>{u.plan === 'pro' ? '⭐ PRO' : 'FREE'}</span>
                                    </td>
                                    <td style={{ padding: '14px' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                                            background: u.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                                            color: u.status === 'active' ? '#10b981' : '#f43f5e',
                                        }}>
                                            {u.status === 'active' ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                            {u.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px', fontSize: 12, color: 'var(--text-muted)' }}>
                                        {format(new Date(u.lastActive), 'MMM d, h:mm a')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}
