'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useStore, seedSampleData } from '@/lib/store';
import Image from 'next/image';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const collapsed = useStore((s) => s.sidebarCollapsed);
    const theme = useStore((s) => s.theme);
    const background = useStore((s) => s.background);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        seedSampleData();
    }, [theme]);

    return (
        <>
            {/* Photorealistic Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                {background.startsWith('/') ? (
                    <Image
                        src={background}
                        alt="App Background"
                        fill
                        style={{ objectFit: 'cover', transform: 'scale(1.05)' }}
                        quality={90}
                        priority
                    />
                ) : (
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                )}

                <div style={{
                    position: 'absolute', inset: 0,
                    // Richer, deeper gradient for "Cosmic Pro" look
                    background: theme === 'dark'
                        ? 'linear-gradient(to bottom, rgba(5,5,10,0.6), rgba(10,10,20,0.8))'
                        : 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(8px)' // Reduced blur for clarity
                }} />
            </div>

            <Sidebar />
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
