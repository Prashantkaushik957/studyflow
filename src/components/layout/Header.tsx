'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, User } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function Header() {
    const theme = useStore((s) => s.theme);
    const toggleTheme = useStore((s) => s.toggleTheme);
    const collapsed = useStore((s) => s.sidebarCollapsed);

    return (
        <motion.header
            animate={{ paddingLeft: collapsed ? 88 : 276 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 64,
                background: 'var(--surface-header)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: 24,
                zIndex: 40,
            }}
        >
            {/* Search */}
            <div style={{ position: 'relative', width: 340, maxWidth: '40%' }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search tasks, subjects, notes..."
                    style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        borderRadius: 12,
                        border: '1px solid var(--border-default)',
                        background: 'var(--surface-input)',
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Theme Toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-default)',
                        background: 'var(--surface-card)',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                    }}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>

                {/* Notifications */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-default)',
                        background: 'var(--surface-card)',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        position: 'relative',
                    }}
                >
                    <Bell size={18} />
                    <span
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'var(--accent-rose)',
                            border: '2px solid var(--surface-header)',
                        }}
                    />
                </motion.button>

                {/* Profile */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'white',
                    }}
                >
                    <User size={18} />
                </motion.button>
            </div>
        </motion.header>
    );
}
