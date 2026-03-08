"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api-client';
import { NewProjectModal } from '@/components/projects/new-project-modal';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProjects = () => {
        api.getProjects().then((res) => setProjects(res.data || [])).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) return <div className="flex h-full items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-[hsl(var(--primary))] border-[hsl(var(--muted))] animate-spin" /></div>;

    const statusColumns = ['planning', 'active', 'on_hold', 'completed'];

    return (
        <div className="flex flex-col h-full space-y-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="text-[hsl(var(--foreground))]">Projects</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 px-4 py-2 rounded-md font-medium text-sm transition-opacity"
                >
                    + New Project
                </button>
            </div>

            {/* Kanban Board */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statusColumns.length}, minmax(300px, 1fr))`, gap: 16, minHeight: 400, overflowX: 'auto', paddingBottom: 16 }}>
                {statusColumns.map((status) => (
                    <div key={status} style={{ background: 'hsl(var(--card))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', padding: 16 }} className="min-w-[300px]">
                        <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }} className="flex items-center">
                            {status.replace('_', ' ')}
                            <span style={{ marginLeft: 8, background: 'hsl(var(--primary)/0.1)', padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', color: 'hsl(var(--primary))' }}>
                                {projects.filter((p) => p.status === status).length}
                            </span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {projects.filter((p) => p.status === status).map((project) => (
                                <div key={project._id} style={{ padding: 14, cursor: 'pointer', background: 'hsl(var(--background))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }} className="hover:border-[hsl(var(--primary))] transition-colors shadow-sm">
                                    <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }} className="text-[hsl(var(--foreground))]">{project.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: 8 }}>
                                        {project.clientId?.companyName || 'No client'}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${project.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                            project.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                                'bg-green-500/10 text-green-500'
                                            }`}>{project.priority}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', fontWeight: 600 }}>
                                            {project.completionPercent}%
                                        </span>
                                    </div>
                                    {/* Progress bar */}
                                    <div style={{ marginTop: 8, height: 4, background: 'hsl(var(--primary)/0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${project.completionPercent}%`, background: 'hsl(var(--primary))', borderRadius: 2, transition: 'width 0.5s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <NewProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={fetchProjects}
            />
        </div>
    );
}
