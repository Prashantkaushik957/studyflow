'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore, seedSampleData } from '@/lib/store';
import { useEffect } from 'react';
import { Shield, User, Sparkles, ArrowRight, BarChart3, Users } from 'lucide-react';
import Image from 'next/image';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setRole, currentRole } = useStore();

  useEffect(() => {
    seedSampleData();
    // If already chose a role, redirect
    if (currentRole === 'user') router.replace('/user');
    if (currentRole === 'admin') router.replace('/admin');
  }, [currentRole, router]);

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
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Photorealistic Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/assets/bg_landing.png"
          alt="Cinematic Study Setup"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
        {/* Premium Dark Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,20,0.4), rgba(5,5,20,0.8))',
          backdropFilter: 'blur(2px)'
        }} />
      </div>

      {/* Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        style={{ textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            width: 72, height: 72, borderRadius: 18,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 32,
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Sparkles size={32} color="white" />
        </motion.div>
        <h1 style={{
          fontSize: 42, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
          background: 'linear-gradient(135deg, #c7d2fe, #e9d5ff, #fde68a)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          StudyFlow
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 400, marginBottom: 16, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          AI-Powered Productivity & Study Management System
        </p>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 20,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500,
          backdropFilter: 'blur(10px)',
        }}>
          Made by <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Prashant Kaushik</span>
        </div>
      </motion.div>

      {/* Role Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24, maxWidth: 700, width: '100%', position: 'relative', zIndex: 1,
      }}>
        {/* Admin Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selectRole('admin')}
          style={{
            cursor: 'pointer', borderRadius: 20, padding: 32,
            background: 'rgba(30,30,40,0.6)',
            border: '1px solid rgba(99,102,241,0.3)',
            backdropFilter: 'blur(24px)',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)',
          }} />
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            border: '1px solid rgba(99,102,241,0.3)',
          }}>
            <Shield size={28} color="#818cf8" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Portal
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Monitor all users, analyze platform metrics, manage devices and track engagement across the entire platform.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <span style={{
              padding: '4px 10px', borderRadius: 8, fontSize: 12,
              background: 'rgba(99,102,241,0.2)', color: '#c7d2fe', border: '1px solid rgba(99,102,241,0.3)'
            }}>
              <Users size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> User Management
            </span>
            <span style={{
              padding: '4px 10px', borderRadius: 8, fontSize: 12,
              background: 'rgba(139,92,246,0.2)', color: '#ddd6fe', border: '1px solid rgba(139,92,246,0.3)'
            }}>
              <BarChart3 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Analytics
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, color: '#818cf8', fontSize: 14, fontWeight: 600
          }}>
            Enter Admin Panel <ArrowRight size={16} />
          </div>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selectRole('user')}
          style={{
            cursor: 'pointer', borderRadius: 20, padding: 32,
            background: 'rgba(30,30,40,0.6)',
            border: '1px solid rgba(16,185,129,0.3)',
            backdropFilter: 'blur(24px)',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #10b981, #06b6d4, #3b82f6)',
          }} />
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.15))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            border: '1px solid rgba(16,185,129,0.3)',
          }}>
            <User size={28} color="#34d399" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
            User Portal
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Access your personalized dashboard, manage tasks, track habits, and supercharge your study sessions with AI insights.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{
              padding: '4px 10px', borderRadius: 8, fontSize: 12,
              background: 'rgba(16,185,129,0.2)', color: '#a7f3d0', border: '1px solid rgba(16,185,129,0.3)'
            }}>
              📋 Tasks & Kanban
            </span>
            <span style={{
              padding: '4px 10px', borderRadius: 8, fontSize: 12,
              background: 'rgba(6,182,212,0.2)', color: '#a5f3fc', border: '1px solid rgba(6,182,212,0.3)'
            }}>
              🎯 Pomodoro
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontSize: 14, fontWeight: 600
          }}>
            Open Dashboard <ArrowRight size={16} />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 48, position: 'relative', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
      >
        © 2026 StudyFlow. Built with ❤️ for productive students.
      </motion.p>
    </div>
  );
}
