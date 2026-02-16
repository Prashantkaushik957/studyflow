'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Header from '@/components/layout/Header';
import { useStore, seedSampleData } from '@/lib/store';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const collapsed = useStore((s) => s.sidebarCollapsed);
    const theme = useStore((s) => s.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        seedSampleData();
    }, [theme]);

    return (
        <>
            {/* Photorealistic Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <Image
                    src="/assets/bg_app.png"
                    alt="App Background"
                    fill
                    style={{ objectFit: 'cover', transform: 'scale(1.05)' }}
                    quality={90}
                    priority
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: theme === 'dark' ? 'rgba(15,5,10,0.8)' : 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(12px)'
                }} />
            </div>

            <AdminSidebar />
            <Header />
            <motion.main
                animate={{ marginLeft: collapsed ? 72 : 260 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    marginTop: 64,
                    minHeight: 'calc(100vh - 64px)',
                    padding: '28px 32px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {children}
            </motion.main>
        </>
    );
}
