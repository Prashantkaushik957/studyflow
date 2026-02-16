'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore, seedSampleData } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Shield, User, Sparkles, ArrowRight, Layout, Database } from 'lucide-react';
import Image from 'next/image';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setRole, currentRole } = useStore();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    // Ensure data exists but don't auto-redirect to prevent loops
    const seed = () => {
      setIsSeeding(true);
      seedSampleData();
      setIsSeeding(false);
    };
    seed();
  }, []);

  const selectRole = (role: 'admin' | 'user') => {
    setRole(role);
    router.push(role === 'admin' ? '/admin' : '/user');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: '#000000', // True Black OLED
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif"
    }}>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#111', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layout size={24} color="white" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>StudyFlow</h1>
        </div>

        {/* Status */}
        {currentRole && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 32, padding: '12px 20px', background: '#111', borderRadius: 8, border: '1px solid #333', display: 'inline-block' }}
          >
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Current Session</div>
            <div style={{ fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              Active as <span style={{ textTransform: 'capitalize', color: 'white' }}>{currentRole}</span>
            </div>
            <button
              onClick={() => selectRole(currentRole)}
              style={{ marginTop: 12, width: '100%', padding: '8px', background: 'white', color: 'black', fontWeight: 600, fontSize: 13, borderRadius: 6, border: 'none', cursor: 'pointer' }}
            >
              Continue to Dashboard &rarr;
            </button>
          </motion.div>
        )}

        {/* Role Select */}
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Admin */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#111' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole('admin')}
            style={{
              display: 'flex', alignItems: 'center', gap: 20, padding: 24,
              background: '#050505', border: '1px solid #333', borderRadius: 12,
              cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>Admin Portal</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>System analytics & user management</div>
            </div>
            <ArrowRight size={16} color="#444" style={{ marginLeft: 'auto' }} />
          </motion.button>

          {/* User */}
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#111' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectRole('user')}
            style={{
              display: 'flex', alignItems: 'center', gap: 20, padding: 24,
              background: '#050505', border: '1px solid #333', borderRadius: 12,
              cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #333' }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>Student Portal</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Access your dashboard & tasks</div>
            </div>
            <ArrowRight size={16} color="#444" style={{ marginLeft: 'auto' }} />
          </motion.button>
        </div>

        <div style={{ marginTop: 48, fontSize: 12, color: '#444' }}>
          <p>Local Data Persistence Enabled</p>
        </div>

      </motion.div>
    </div>
  );
}
