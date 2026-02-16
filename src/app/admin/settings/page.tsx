'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Database, Download, Trash2, Globe, Mail, Save, AlertTriangle } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <motion.div
            onClick={onChange}
            animate={{ background: checked ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(148,163,184,0.2)' }}
            style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', position: 'relative', padding: 2 }}
        >
            <motion.div
                animate={{ x: checked ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            />
        </motion.div>
    );
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'StudyFlow',
        maintenanceMode: false,
        newRegistrations: true,
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        autoBackup: true,
        analyticsTracking: true,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings((s) => ({ ...s, [key]: !s[key] }));
    };

    return (
        <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: 800 }}>
            <motion.div variants={item} style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Settings size={28} style={{ color: '#f59e0b' }} />
                    Platform Settings
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Configure platform-wide settings and preferences</p>
            </motion.div>

            {/* General */}
            <motion.div variants={item} className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Globe size={18} style={{ color: '#6366f1' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>General</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' }}>Platform Name</label>
                        <input
                            value={settings.siteName}
                            onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
                            style={{
                                width: '100%', maxWidth: 360, padding: '10px 14px', borderRadius: 10,
                                border: '1px solid var(--border-default)', background: 'var(--surface-input)',
                                color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>Maintenance Mode</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Temporarily disable access for users</div>
                        </div>
                        <Toggle checked={settings.maintenanceMode} onChange={() => toggle('maintenanceMode')} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>New Registrations</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Allow new users to sign up</div>
                        </div>
                        <Toggle checked={settings.newRegistrations} onChange={() => toggle('newRegistrations')} />
                    </div>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={item} className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Bell size={18} style={{ color: '#8b5cf6' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Notifications</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                        { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Send alerts via email to admin', icon: Mail },
                        { key: 'pushNotifications' as const, label: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
                        { key: 'weeklyReports' as const, label: 'Weekly Reports', desc: 'Automated platform summary every Monday', icon: Database },
                    ].map((n) => (
                        <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <n.icon size={16} style={{ color: 'var(--text-muted)' }} />
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>{n.label}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.desc}</div>
                                </div>
                            </div>
                            <Toggle checked={settings[n.key] as boolean} onChange={() => toggle(n.key)} />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Data Management */}
            <motion.div variants={item} className="glass-card-static" style={{ padding: 24, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Database size={18} style={{ color: '#06b6d4' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Data Management</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>Automatic Backups</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Daily automated data backups</div>
                        </div>
                        <Toggle checked={settings.autoBackup} onChange={() => toggle('autoBackup')} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>Analytics Tracking</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Collect usage analytics across platform</div>
                        </div>
                        <Toggle checked={settings.analyticsTracking} onChange={() => toggle('analyticsTracking')} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        <button style={{
                            padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <Download size={15} /> Export All Data
                        </button>
                        <button style={{
                            padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', color: '#f43f5e',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <Trash2 size={15} /> Reset Platform Data
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Save */}
            <motion.div variants={item} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none',
                        color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                    }}
                >
                    <Save size={16} /> Save Settings
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
