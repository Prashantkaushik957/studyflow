'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DragDropContext, Droppable, Draggable, DropResult,
} from '@hello-pangea/dnd';
import {
    Plus, Clock, CheckCircle2, Eye, ListTodo, X, Calendar, Tag,
    ChevronDown, Timer, Trash2, GripVertical,
} from 'lucide-react';

import { useStore, type Task, type TaskStatus, type Priority } from '@/lib/store';

const columns: { id: TaskStatus; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'todo', label: 'To Do', icon: ListTodo, color: '#94a3b8' },
    { id: 'in-progress', label: 'In Progress', icon: Clock, color: '#6366f1' },
    { id: 'review', label: 'Review', icon: Eye, color: '#f59e0b' },
    { id: 'done', label: 'Done', icon: CheckCircle2, color: '#10b981' },
];

const priorityColors: Record<Priority, string> = {
    P1: '#f43f5e',
    P2: '#f59e0b',
    P3: '#3b82f6',
    P4: '#94a3b8',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

function TaskCard({ task, index }: { task: Task; index: number }) {
    const deleteTask = useStore((s) => s.deleteTask);
    const updateTask = useStore((s) => s.updateTask);
    const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        ...provided.draggableProps.style,
                        marginBottom: 8,
                    }}
                >
                    <motion.div
                        layout
                        className={`priority-${task.priority.toLowerCase()}`}
                        style={{
                            padding: '14px 16px',
                            borderRadius: 12,
                            background: snapshot.isDragging ? 'var(--surface-card-hover)' : 'var(--surface-card)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--border-default)',
                            boxShadow: snapshot.isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                            cursor: 'grab',
                            transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div {...provided.dragHandleProps} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <GripVertical size={14} style={{ color: 'var(--text-muted)' }} />
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: 4,
                                        color: 'white',
                                        background: priorityColors[task.priority],
                                    }}
                                >
                                    {task.priority}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTask(task.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    padding: 2,
                                    borderRadius: 4,
                                    display: 'flex',
                                    opacity: 0.5,
                                }}
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>

                        {/* Title */}
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{task.title}</div>

                        {/* Subject Tag */}
                        {task.subject && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11,
                                color: 'var(--primary-400)',
                                background: 'rgba(99,102,241,0.1)',
                                padding: '3px 8px',
                                borderRadius: 6,
                                marginBottom: 8,
                                fontWeight: 500,
                            }}>
                                <Tag size={10} />
                                {task.subject}
                            </div>
                        )}

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)' }}>
                                    <Timer size={12} /> {task.estimatedMinutes}m
                                </span>
                                {task.subtasks.length > 0 && (
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                        {completedSubtasks}/{task.subtasks.length}
                                    </span>
                                )}
                            </div>
                            {task.dueDate && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)' }}>
                                    <Calendar size={11} /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </Draggable>
    );
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
    const addTask = useStore((s) => s.addTask);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('P2');
    const [subject, setSubject] = useState('');
    const [chapter, setChapter] = useState('');
    const [estimated, setEstimated] = useState(30);
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        addTask({
            title,
            description,
            status: 'todo',
            priority,
            subject,
            chapter,
            estimatedMinutes: estimated,
            subtasks: [],
            dueDate,
            tags: subject ? [subject] : [],
        });
        onClose();
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid var(--border-default)',
        background: 'var(--surface-input)',
        color: 'var(--text-primary)',
        fontSize: 14,
        outline: 'none',
        fontFamily: 'inherit',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: 520,
                    background: 'var(--surface-modal)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: 20,
                    border: '1px solid var(--border-default)',
                    padding: 32,
                    boxShadow: 'var(--shadow-lg)',
                }}
            >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Create New Task</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Task Title *</label>
                        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Indian Polity - Chapter 4" />
                    </div>

                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Description</label>
                        <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." />
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Subject</label>
                            <input style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Polity" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Chapter</label>
                            <input style={inputStyle} value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="e.g. Chapter 4" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Priority</label>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {(['P1', 'P2', 'P3', 'P4'] as Priority[]).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: 8,
                                            border: priority === p ? `2px solid ${priorityColors[p]}` : '1px solid var(--border-default)',
                                            background: priority === p ? `${priorityColors[p]}15` : 'var(--surface-input)',
                                            color: priority === p ? priorityColors[p] : 'var(--text-secondary)',
                                            fontWeight: 600,
                                            fontSize: 13,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Estimated Time (min)</label>
                            <input type="number" style={inputStyle} value={estimated} onChange={(e) => setEstimated(Number(e.target.value))} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Due Date</label>
                            <input type="date" style={inputStyle} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button onClick={handleSubmit} className="btn-gradient" style={{ flex: 1, padding: '12px', borderRadius: 12, fontSize: 14 }}>
                            Create Task
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function TasksPage() {
    const tasks = useStore((s) => s.tasks);
    const moveTask = useStore((s) => s.moveTask);
    const [showModal, setShowModal] = useState(false);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const newStatus = result.destination.droppableId as TaskStatus;
        moveTask(result.draggableId, newStatus);
    };

    return (
        
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Page Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Task Board</h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            {tasks.length} total tasks • {tasks.filter((t) => t.status === 'done').length} completed
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowModal(true)}
                        className="btn-gradient"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 14, fontSize: 14 }}
                    >
                        <Plus size={18} /> New Task
                    </motion.button>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 20 }}>
                        {columns.map((col) => {
                            const colTasks = tasks.filter((t) => t.status === col.id);
                            return (
                                <div key={col.id} style={{ flex: 1, minWidth: 260 }}>
                                    {/* Column Header */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginBottom: 14,
                                        padding: '10px 14px',
                                        borderRadius: 12,
                                        background: `${col.color}10`,
                                    }}>
                                        <col.icon size={16} style={{ color: col.color }} />
                                        <span style={{ fontSize: 14, fontWeight: 700, color: col.color }}>{col.label}</span>
                                        <span style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            padding: '2px 8px',
                                            borderRadius: 100,
                                            background: `${col.color}15`,
                                            color: col.color,
                                            marginLeft: 'auto',
                                        }}>
                                            {colTasks.length}
                                        </span>
                                    </div>

                                    {/* Drop Zone */}
                                    <Droppable droppableId={col.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                style={{
                                                    minHeight: 200,
                                                    padding: 4,
                                                    borderRadius: 14,
                                                    border: snapshot.isDraggingOver ? `2px dashed ${col.color}` : '2px dashed transparent',
                                                    background: snapshot.isDraggingOver ? `${col.color}08` : 'transparent',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {colTasks.map((task, index) => (
                                                    <TaskCard key={task.id} task={task} index={index} />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </DragDropContext>

                {/* Create Task Modal */}
                <AnimatePresence>
                    {showModal && <CreateTaskModal onClose={() => setShowModal(false)} />}
                </AnimatePresence>
            </motion.div>
        
    );
}
