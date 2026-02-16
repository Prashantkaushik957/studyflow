'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Users, UserPlus, TrendingUp, DollarSign, Activity, Globe, ArrowUpRight, Shield, Smartphone, Monitor } from 'lucide-react';
import { useStore, seedSampleData } from '@/lib/store';
import { useEffect } from 'react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function StatCard({ icon: Icon, label, value, trend, color }: { icon: React.ElementType; label: string; value: string; trend: string; color: string }) {
    return (
        <motion.div variants={item} className="glass-card" style={{ flex: 1, minWidth: 200, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} style={{ color }} />
                </div>
                <span style={{
                    display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600,
                    color: '#10b981', padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)',
                }}>
                    <ArrowUpRight size={13} />{trend}
                </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
        </motion.div>
    );
}

export default function AdminDashboardPage() {
    const registeredUsers = useStore((s) => s.registeredUsers);

    useEffect(() => { seedSampleData(); }, []);

    const activeUsers = registeredUsers.filter((u) => u.status === 'active').length;
    const proUsers = registeredUsers.filter((u) => u.plan === 'pro').length;
    const totalRevenue = proUsers * 9.99;

    // User growth over time (simulated)
    const growthData = useMemo(() => {
        const data = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            data.push({
                day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                users: Math.max(5, registeredUsers.length - Math.floor(i * 0.4) + Math.floor(Math.random() * 3)),
                active: Math.max(3, activeUsers - Math.floor(i * 0.3) + Math.floor(Math.random() * 2)),
            });
        }
        return data;
    }, [registeredUsers, activeUsers]);

    // Device distribution
    const deviceData = useMemo(() => {
        const map: Record<string, number> = {};
        registeredUsers.forEach((u) => {
            const type = u.device.includes('iPhone') || u.device.includes('Galaxy') || u.device.includes('Pixel') || u.device.includes('OnePlus') ? 'Mobile' : u.device.includes('iPad') ? 'Tablet' : 'Desktop';
            map[type] = (map[type] || 0) + 1;
        });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [registeredUsers]);

    const COLORS = ['#6366f1', '#f59e0b', '#10b981'];

    // Recent users
    const recentUsers = [...registeredUsers].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).slice(0, 6);

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Shield size={28} style={{ color: '#ef4444' }} />
                    Admin Dashboard
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Platform overview and user management</p>
            </motion.div>

            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <StatCard icon={Users} label="Total Users" value={`${registeredUsers.length}`} trend="+12%" color="#6366f1" />
                <StatCard icon={Activity} label="Active Users" value={`${activeUsers}`} trend="+8%" color="#10b981" />
                <StatCard icon={UserPlus} label="New This Week" value={`${Math.floor(registeredUsers.length * 0.2)}`} trend="+24%" color="#8b5cf6" />
                <StatCard icon={DollarSign} label="Monthly Revenue" value={`$${totalRevenue.toFixed(0)}`} trend="+15%" color="#f59e0b" />
            </div>

            {/* Charts */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
                {/* User Growth */}
                <motion.div variants={item} className="glass-card-static" style={{ flex: 1.5, padding: 24, minWidth: 400 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>User Growth</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Total and active users over 30 days</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={growthData}>
                            <defs>
                                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#userGrad)" strokeWidth={2} name="Total" />
                            <Area type="monotone" dataKey="active" stroke="#10b981" fill="url(#activeGrad)" strokeWidth={2} name="Active" />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Device Distribution */}
                <motion.div variants={item} className="glass-card-static" style={{ flex: 1, padding: 24, minWidth: 260 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Device Distribution</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Platform usage by device type</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={deviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                                {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
                        {deviceData.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                                {d.name === 'Mobile' ? <Smartphone size={13} /> : d.name === 'Tablet' ? <Globe size={13} /> : <Monitor size={13} />}
                                {d.name} ({d.value})
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Users */}
            <motion.div variants={item} className="glass-card-static" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recently Joined Users</h3>
                    <span style={{ fontSize: 12, color: 'var(--primary-400)', cursor: 'pointer', fontWeight: 600 }}>View All →</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                                {['User', 'Email', 'Device', 'Location', 'Plan', 'Status'].map((h) => (
                                    <th key={h} style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((u) => (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                                    <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 22 }}>{u.avatar}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</span>
                                    </td>
                                    <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                                    <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.device}</td>
                                    <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.location}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                                            background: u.plan === 'pro' ? 'rgba(139,92,246,0.12)' : 'rgba(148,163,184,0.12)',
                                            color: u.plan === 'pro' ? '#a78bfa' : 'var(--text-muted)',
                                        }}>{u.plan.toUpperCase()}</span>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{
                                            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                                            background: u.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                                            color: u.status === 'active' ? '#10b981' : '#f43f5e',
                                        }}>{u.status === 'active' ? '● Active' : '● Inactive'}</span>
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
