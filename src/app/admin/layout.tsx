'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Header from '@/components/layout/Header';
import { useStore, seedSampleData } from '@/lib/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const collapsed = useStore((s) => s.sidebarCollapsed);
    const theme = useStore((s) => s.theme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        seedSampleData();
    }, [theme]);

    return (
        <>
            <AdminSidebar />
            <Header />
            <motion.main
                animate={{ marginLeft: collapsed ? 72 : 260 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ marginTop: 64, minHeight: 'calc(100vh - 64px)', padding: '28px 32px' }}
            >
                {children}
            </motion.main>
        </>
    );
}
