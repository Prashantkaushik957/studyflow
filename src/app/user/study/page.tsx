'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, ChevronRight, ChevronDown, CheckCircle2, Circle, Target,
    Clock, AlertTriangle, Plus, GraduationCap, TrendingUp, Calendar,
} from 'lucide-react';

import { useStore } from '@/lib/store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const EXAM_TEMPLATES = [
    {
        name: 'UPSC CSE',
        icon: '🏛️',
        subjects: [
            { name: 'Indian Polity', chapters: ['Constitution', 'Parliament', 'Judiciary', 'State Government', 'Local Government', 'Fundamental Rights', 'DPSP'] },
            { name: 'Indian Economy', chapters: ['GDP & Growth', 'Banking', 'Fiscal Policy', 'Agriculture', 'Industry', 'External Sector'] },
            { name: 'Geography', chapters: ['Physical Geography', 'Indian Geography', 'Monsoons', 'Soil & Vegetation', 'Minerals', 'Population'] },
            { name: 'History', chapters: ['Ancient India', 'Medieval India', 'Modern India', 'Art & Culture', 'World History'] },
            { name: 'Science & Tech', chapters: ['Space Technology', 'Biotechnology', 'IT', 'Defence Tech', 'Health & Disease'] },
            { name: 'Environment', chapters: ['Ecology', 'Biodiversity', 'Climate Change', 'Environmental Laws', 'Pollution'] },
        ],
    },
    {
        name: 'JEE Main',
        icon: '⚡',
        subjects: [
            { name: 'Physics', chapters: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Magnetism', 'Optics', 'Modern Physics', 'Waves'] },
            { name: 'Chemistry', chapters: ['Organic', 'Inorganic', 'Physical Chemistry', 'Coordination Compounds', 'Polymers'] },
            { name: 'Mathematics', chapters: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Statistics', 'Probability'] },
        ],
    },
    {
        name: 'NEET',
        icon: '🩺',
        subjects: [
            { name: 'Biology', chapters: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Physiology', 'Evolution'] },
            { name: 'Physics', chapters: ['Mechanics', 'Electrodynamics', 'Optics', 'Modern Physics', 'Thermodynamics'] },
            { name: 'Chemistry', chapters: ['Organic', 'Inorganic', 'Physical Chemistry', 'Biomolecules'] },
        ],
    },
];

const scheduleTimeline = [
    { time: '6:00 AM', activity: 'Morning Revision', subject: 'Indian Polity', duration: 60, type: 'study' as const },
    { time: '7:00 AM', activity: 'Break + Exercise', subject: '', duration: 45, type: 'break' as const },
    { time: '7:45 AM', activity: 'Geography', subject: 'Monsoon Patterns', duration: 90, type: 'study' as const },
    { time: '9:15 AM', activity: 'Short Break', subject: '', duration: 15, type: 'break' as const },
    { time: '9:30 AM', activity: 'Economy', subject: 'Fiscal Policy', duration: 90, type: 'study' as const },
    { time: '11:00 AM', activity: 'Lunch Break', subject: '', duration: 60, type: 'break' as const },
    { time: '12:00 PM', activity: 'MCQ Practice', subject: 'Previous Year Papers', duration: 60, type: 'study' as const },
    { time: '1:00 PM', activity: 'Current Affairs', subject: 'Daily Newspaper', duration: 45, type: 'study' as const },
    { time: '1:45 PM', activity: 'Rest', subject: '', duration: 75, type: 'break' as const },
    { time: '3:00 PM', activity: 'History', subject: 'Modern India', duration: 90, type: 'study' as const },
    { time: '4:30 PM', activity: 'Break', subject: '', duration: 30, type: 'break' as const },
    { time: '5:00 PM', activity: 'Answer Writing', subject: 'Essay Practice', duration: 120, type: 'study' as const },
    { time: '7:00 PM', activity: 'Dinner + Relaxation', subject: '', duration: 90, type: 'break' as const },
    { time: '8:30 PM', activity: 'Revision & Notes', subject: 'Day Recap', duration: 60, type: 'study' as const },
    { time: '9:30 PM', activity: 'Optional Reading', subject: 'NCERT', duration: 45, type: 'study' as const },
];

function SubjectTree({ template }: { template: typeof EXAM_TEMPLATES[0] }) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [completed, setCompleted] = useState<Record<string, boolean>>({});

    const toggleExpand = (name: string) => setExpanded((p) => ({ ...p, [name]: !p[name] }));
    const toggleComplete = (key: string) => setCompleted((p) => ({ ...p, [key]: !p[key] }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {template.subjects.map((subj) => {
                const completedCount = subj.chapters.filter((c) => completed[`${subj.name}-${c}`]).length;
                const pct = Math.round((completedCount / subj.chapters.length) * 100);
                return (
                    <div key={subj.name}>
                        <motion.div
                            onClick={() => toggleExpand(subj.name)}
                            whileHover={{ x: 2 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                                borderRadius: 10, cursor: 'pointer', background: 'var(--surface-input)',
                                border: '1px solid var(--border-default)',
                            }}
                        >
                            {expanded[subj.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{subj.name}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completedCount}/{subj.chapters.length}</span>
                            <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--border-default)', overflow: 'hidden' }}>
                                <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', background: pct === 100 ? 'var(--accent-emerald)' : 'var(--primary-500)', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: pct === 100 ? 'var(--accent-emerald)' : 'var(--primary-400)', minWidth: 32 }}>{pct}%</span>
                        </motion.div>
                        <AnimatePresence>
                            {expanded[subj.name] && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    style={{ overflow: 'hidden', paddingLeft: 28 }}
                                >
                                    {subj.chapters.map((ch) => {
                                        const key = `${subj.name}-${ch}`;
                                        const done = completed[key];
                                        return (
                                            <motion.div
                                                key={ch}
                                                whileHover={{ x: 2 }}
                                                onClick={() => toggleComplete(key)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                                    cursor: 'pointer', borderRadius: 8, marginTop: 4,
                                                    color: done ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                                                }}
                                            >
                                                {done ? <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} /> : <Circle size={16} />}
                                                <span style={{ fontSize: 13, fontWeight: 500, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}>{ch}</span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

export default function StudyPage() {
    const [selectedTemplate, setSelectedTemplate] = useState(0);
    const tasks = useStore((s) => s.tasks);

    const backlogTasks = tasks.filter((t) => {
        const due = new Date(t.dueDate);
        return t.status !== 'done' && due < new Date();
    });

    return (
        
            <motion.div variants={container} initial="hidden" animate="show">
                {/* Header */}
                <motion.div variants={item} style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BookOpen size={28} style={{ color: 'var(--primary-500)' }} />
                        Study Planner
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Structured preparation with smart scheduling and tracking</p>
                </motion.div>

                {/* Backlog Alert */}
                {backlogTasks.length > 0 && (
                    <motion.div
                        variants={item}
                        style={{
                            padding: '16px 20px', borderRadius: 14, marginBottom: 24,
                            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}
                    >
                        <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#f59e0b' }}>Backlog Detected!</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                {backlogTasks.length} task(s) are past due. Consider rescheduling or prioritizing them today.
                            </div>
                        </div>
                    </motion.div>
                )}

                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {/* Left: Exam Template & Syllabus Tree */}
                    <div style={{ flex: 1.2, minWidth: 340 }}>
                        {/* Template Selector */}
                        <motion.div variants={item} style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <GraduationCap size={18} style={{ color: 'var(--primary-500)' }} />
                                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Goal Template</h3>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {EXAM_TEMPLATES.map((tmpl, i) => (
                                    <motion.button
                                        key={tmpl.name}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setSelectedTemplate(i)}
                                        style={{
                                            flex: 1, padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                                            border: selectedTemplate === i ? '2px solid var(--primary-500)' : '1px solid var(--border-default)',
                                            background: selectedTemplate === i ? 'rgba(99,102,241,0.1)' : 'var(--surface-card)',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                            color: 'var(--text-primary)',
                                        }}
                                    >
                                        <span style={{ fontSize: 24 }}>{tmpl.icon}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>{tmpl.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Subject Tree */}
                        <motion.div variants={item} className="glass-card-static" style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Syllabus Progress</h3>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{EXAM_TEMPLATES[selectedTemplate].subjects.length} subjects</span>
                            </div>
                            <SubjectTree template={EXAM_TEMPLATES[selectedTemplate]} />
                        </motion.div>
                    </div>

                    {/* Right: Smart Schedule */}
                    <div style={{ flex: 1, minWidth: 300 }}>
                        <motion.div variants={item} className="glass-card-static" style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Calendar size={18} style={{ color: 'var(--primary-500)' }} />
                                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>Today&apos;s Schedule</h3>
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--accent-emerald)', fontWeight: 600 }}>AI Optimized</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {scheduleTimeline.map((slot, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                                            borderRadius: 10,
                                            background: slot.type === 'break' ? 'rgba(16,185,129,0.05)' : 'transparent',
                                        }}
                                    >
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, minWidth: 60, fontVariantNumeric: 'tabular-nums' }}>
                                            {slot.time}
                                        </span>
                                        <div style={{
                                            width: 3, height: 24, borderRadius: 2,
                                            background: slot.type === 'break' ? 'var(--accent-emerald)' : 'var(--primary-500)',
                                        }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>{slot.activity}</div>
                                            {slot.subject && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{slot.subject}</div>}
                                        </div>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{slot.duration}min</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        
    );
}
