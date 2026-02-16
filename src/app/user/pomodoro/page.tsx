'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX, CheckCircle2, SkipForward } from 'lucide-react';
import { useStore } from '@/lib/store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const AMBIENT_SOUNDS = [
    { name: 'Silence', icon: '🔇', file: null },
    { name: 'Rain', icon: '🌧️', file: '/sounds/rain.ogg' },
    { name: 'Forest', icon: '🌲', file: '/sounds/forest.ogg' },
    { name: 'Café', icon: '☕', file: '/sounds/cafe.ogg' },
];

const getAssetPath = (path: string) => {
    // Basic detection for GitHub Pages or production build
    const prefix = process.env.NODE_ENV === 'production' ? '/studyflow' : '';
    return `${prefix}${path}`;
};

export default function PomodoroPage() {
    const settings = useStore((s) => s.pomodoroSettings);
    const addSession = useStore((s) => s.addPomodoroSession);
    const sessions = useStore((s) => s.pomodoroSessions);
    const logActivity = useStore((s) => s.logActivity);

    const [mode, setMode] = useState<'focus' | 'break' | 'long-break'>('focus');
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(settings.focusDuration * 60);
    const [sessionCount, setSessionCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Audio State
    const [selectedSound, setSelectedSound] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const totalSeconds = mode === 'focus' ? settings.focusDuration * 60 : mode === 'break' ? settings.breakDuration * 60 : settings.longBreakDuration * 60;
    const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

    const resetTimer = useCallback((newMode: 'focus' | 'break' | 'long-break') => {
        setIsRunning(false);
        setMode(newMode);
        const dur = newMode === 'focus' ? settings.focusDuration : newMode === 'break' ? settings.breakDuration : settings.longBreakDuration;
        setSeconds(dur * 60);
    }, [settings]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        // Session complete
                        addSession({ type: mode, duration: mode === 'focus' ? settings.focusDuration : mode === 'break' ? settings.breakDuration : settings.longBreakDuration, completedAt: new Date().toISOString() });
                        logActivity('Pomodoro Complete', `${mode} session finished`);

                        if (mode === 'focus') {
                            const newCount = sessionCount + 1;
                            setSessionCount(newCount);
                            if (newCount % settings.sessionsBeforeLongBreak === 0) {
                                resetTimer('long-break');
                            } else {
                                resetTimer('break');
                            }
                        } else {
                            resetTimer('focus');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, mode, sessionCount, settings, addSession, logActivity, resetTimer]);

    // Audio Effect
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }

        const audio = audioRef.current;
        audio.volume = volume;

        const sound = AMBIENT_SOUNDS[selectedSound];

        if (sound.file) {
            const path = getAssetPath(sound.file);
            if (!audio.src.endsWith(path)) {
                audio.src = path;
            }
            audio.play().catch(e => console.warn("Audio autoplay blocked or failed:", e));
        } else {
            audio.pause();
        }

        return () => {
            // We don't pause on unmount of effect unless component unmounts
        };
    }, [selectedSound]);

    // Volume Effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const todaySessions = sessions.filter((s) => s.completedAt.startsWith(new Date().toISOString().split('T')[0]));
    const todayFocusMinutes = todaySessions.filter((s) => s.type === 'focus').reduce((sum, s) => sum + s.duration, 0);

    const modeColors = {
        focus: { bg: 'rgba(99, 102, 241, 0.1)', stroke: '#6366f1', label: 'Focus Time' },
        break: { bg: 'rgba(16, 185, 129, 0.1)', stroke: '#10b981', label: 'Short Break' },
        'long-break': { bg: 'rgba(6, 182, 212, 0.1)', stroke: '#06b6d4', label: 'Long Break' },
    };

    const r = 140;
    const circ = 2 * Math.PI * r;
    const strokeOffset = circ - (progress / 100) * circ;

    return (
        <motion.div variants={container} initial="hidden" animate="show">
            {/* Header */}
            <motion.div variants={item} style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Timer size={28} style={{ color: 'var(--primary-500)' }} />
                    Pomodoro Timer
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Stay focused with timed study sessions and smart breaks</p>
            </motion.div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Timer Section */}
                <motion.div variants={item} style={{ flex: 1, minWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Mode Tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 32, padding: 4, borderRadius: 14, background: 'var(--surface-input)', border: '1px solid var(--border-default)' }}>
                        {[
                            { key: 'focus' as const, icon: Brain, label: 'Focus' },
                            { key: 'break' as const, icon: Coffee, label: 'Break' },
                            { key: 'long-break' as const, icon: Coffee, label: 'Long Break' },
                        ].map((tab) => (
                            <motion.button
                                key={tab.key}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => resetTimer(tab.key)}
                                style={{
                                    padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                    background: mode === tab.key ? modeColors[tab.key].stroke : 'transparent',
                                    color: mode === tab.key ? 'white' : 'var(--text-secondary)',
                                    fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <tab.icon size={15} /> {tab.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Timer Circle */}
                    <motion.div
                        style={{ position: 'relative', width: 320, height: 320, marginBottom: 32 }}
                        animate={{ scale: isRunning ? [1, 1.01, 1] : 1 }}
                        transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
                    >
                        <svg width={320} height={320} style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx={160} cy={160} r={r} fill="none" stroke="var(--border-default)" strokeWidth={8} />
                            <motion.circle
                                cx={160}
                                cy={160}
                                r={r}
                                fill="none"
                                stroke={modeColors[mode].stroke}
                                strokeWidth={8}
                                strokeLinecap="round"
                                strokeDasharray={circ}
                                animate={{ strokeDashoffset: strokeOffset }}
                                transition={{ duration: 0.5 }}
                                style={{ filter: `drop-shadow(0 0 12px ${modeColors[mode].stroke}50)` }}
                            />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: modeColors[mode].stroke, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                                {modeColors[mode].label}
                            </div>
                            <div style={{ fontSize: 64, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: -2, lineHeight: 1 }}>
                                {formatTime(seconds)}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                                Session {sessionCount + 1} of {settings.sessionsBeforeLongBreak}
                            </div>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => resetTimer(mode)}
                            style={{
                                width: 48, height: 48, borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                                cursor: 'pointer', color: 'var(--text-secondary)',
                            }}
                        >
                            <RotateCcw size={20} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsRunning(!isRunning)}
                            style={{
                                width: 72, height: 72, borderRadius: 22,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: modeColors[mode].stroke, border: 'none',
                                cursor: 'pointer', color: 'white',
                                boxShadow: `0 4px 24px ${modeColors[mode].stroke}40`,
                            }}
                        >
                            {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                addSession({ type: mode, duration: Math.round((totalSeconds - seconds) / 60), completedAt: new Date().toISOString() });
                                if (mode === 'focus') {
                                    const newCount = sessionCount + 1;
                                    setSessionCount(newCount);
                                    resetTimer(newCount % settings.sessionsBeforeLongBreak === 0 ? 'long-break' : 'break');
                                } else {
                                    resetTimer('focus');
                                }
                            }}
                            style={{
                                width: 48, height: 48, borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                                cursor: 'pointer', color: 'var(--text-secondary)',
                            }}
                        >
                            <SkipForward size={20} />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Right Panel */}
                <div style={{ flex: 0.8, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Ambient Sounds */}
                    <motion.div variants={item} className="glass-card-static" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {selectedSound > 0 ? <Volume2 size={16} style={{ color: 'var(--primary-400)' }} /> : <VolumeX size={16} style={{ color: 'var(--text-muted)' }} />}
                                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Ambient Sounds</h3>
                            </div>
                            {selectedSound > 0 && (
                                <input
                                    type="range"
                                    min="0" max="1" step="0.05"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    style={{ width: 80, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                                />
                            )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                            {AMBIENT_SOUNDS.map((sound, i) => (
                                <motion.button
                                    key={sound.name}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedSound(i)}
                                    style={{
                                        padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                                        border: selectedSound === i ? '2px solid var(--primary-500)' : '1px solid var(--border-default)',
                                        background: selectedSound === i ? 'rgba(99,102,241,0.1)' : 'var(--surface-input)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                        color: 'var(--text-primary)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span style={{ fontSize: 24 }}>{sound.icon}</span>
                                    <span style={{ fontSize: 12, fontWeight: 500 }}>{sound.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Today's Stats */}
                    <motion.div variants={item} className="glass-card-static" style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Today&apos;s Sessions</h3>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                            <div style={{ flex: 1, padding: 14, borderRadius: 12, background: 'var(--surface-input)', textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary-500)' }}>{todaySessions.filter((s) => s.type === 'focus').length}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Sessions</div>
                            </div>
                            <div style={{ flex: 1, padding: 14, borderRadius: 12, background: 'var(--surface-input)', textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-emerald)' }}>{todayFocusMinutes}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Minutes</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {todaySessions.slice(-5).reverse().map((sess) => (
                                <div key={sess.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: 'var(--surface-input)' }}>
                                    <CheckCircle2 size={14} style={{ color: sess.type === 'focus' ? 'var(--primary-400)' : 'var(--accent-emerald)' }} />
                                    <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{sess.type === 'focus' ? 'Focus' : 'Break'}</span>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sess.duration}min</span>
                                </div>
                            ))}
                            {todaySessions.length === 0 && (
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>No sessions yet today</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
