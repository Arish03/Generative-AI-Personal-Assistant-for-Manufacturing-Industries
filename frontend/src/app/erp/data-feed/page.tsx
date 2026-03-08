"use client";

import { useState, useEffect, useMemo } from 'react';
import { Users, Building2, ListTodo, Clock, AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react';
import api from '@/lib/api-client';

const TABS = [
    { key: 'clients', label: 'Clients', icon: Building2 },
    { key: 'tasks', label: 'Tasks', icon: ListTodo },
    { key: 'teams', label: 'Teams', icon: Users },
    { key: 'timesheets', label: 'Timesheets', icon: Clock },
];

const priorityColors: Record<string, string> = { critical: 'hsl(var(--foreground))', high: 'hsl(var(--foreground))', medium: 'hsl(var(--muted-foreground))', low: 'hsl(var(--muted-foreground))' };
const statusColors: Record<string, string> = { done: 'hsl(var(--foreground))', in_progress: 'hsl(var(--muted-foreground))', todo: 'hsl(var(--muted-foreground))', active: 'hsl(var(--foreground))', overdue: 'hsl(var(--foreground))', inactive: 'hsl(var(--muted-foreground))' };

export default function ERPDataPage() {
    const [tab, setTab] = useState('clients');
    const [data, setData] = useState({ clients: [] as any[], tasks: [] as any[], teams: [] as any[], timesheets: [] as any[] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [clientsResult, tasksResult, teamsResult] = await Promise.all([
                    api.get('/erp/clients'),
                    api.get('/erp/tasks/my'),
                    api.get('/erp/teams'),
                ]);

                // Assuming api.get handles bad responses and gives array directly or handles it
                const clients = Array.isArray(clientsResult) ? clientsResult : clientsResult.data || [];
                const tasks = Array.isArray(tasksResult) ? tasksResult : tasksResult.data || [];
                const teams = Array.isArray(teamsResult) ? teamsResult : teamsResult.data || [];

                setData({ clients, tasks, teams, timesheets: [] });
            } catch (e) { console.error('ERP load error:', e); }
            setLoading(false);
        }
        load();
    }, []);

    const stats = useMemo(() => ({
        totalClients: data.clients.length,
        activeClients: data.clients.filter(c => c.billingStatus === 'active').length,
        overdueClients: data.clients.filter(c => c.billingStatus === 'overdue').length,
        totalTasks: data.tasks.length,
        completedTasks: data.tasks.filter(t => t.status === 'done').length,
        inProgressTasks: data.tasks.filter(t => t.status === 'in_progress').length,
    }), [data]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ color: 'hsl(var(--foreground))', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>📊 ERP Data Feed</h2>
            </div>

            {/* KPI Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Total Clients', value: stats.totalClients, icon: Building2, color: 'hsl(var(--foreground))' },
                    { label: 'Active Clients', value: stats.activeClients, icon: CheckCircle2, color: 'hsl(var(--muted-foreground))' },
                    { label: 'Overdue', value: stats.overdueClients, icon: AlertCircle, color: 'hsl(var(--foreground))' },
                    { label: 'Tasks Done', value: `${stats.completedTasks}/${stats.totalTasks}`, icon: ListTodo, color: 'hsl(var(--foreground))' },
                ].map(kpi => (
                    <div key={kpi.label} style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, background: 'hsl(var(--card))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
                        <kpi.icon size={28} style={{ color: kpi.color, flexShrink: 0 }} />
                        <div>
                            <div style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: 1 }}>{kpi.label}</div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'hsl(var(--foreground))' }}>{kpi.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'hsl(var(--secondary))', borderRadius: 'var(--radius)', padding: 4 }} className="overflow-x-auto">
                {TABS.map(t => {
                    const Icon = t.icon;
                    return (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            style={{
                                flex: '1 0 auto', padding: '10px 16px', border: 'none', borderRadius: 'var(--radius)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                fontSize: 13, fontWeight: 600, transition: 'all 0.2s ease',
                                background: tab === t.key ? 'hsl(var(--background))' : 'transparent',
                                color: tab === t.key ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            }}>
                            <Icon size={16} />{t.label}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }} className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 rounded-full border-4 border-t-[hsl(var(--primary))] border-[hsl(var(--muted))] animate-spin" />
                </div>
            ) : (
                <div style={{ overflow: 'hidden', background: 'hsl(var(--card))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}>
                    {tab === 'clients' && <ClientsTable data={data.clients} />}
                    {tab === 'tasks' && <TasksTable data={data.tasks} />}
                    {tab === 'teams' && <TeamsTable data={data.teams} />}
                    {tab === 'timesheets' && <TimesheetsView />}
                </div>
            )}
        </div>
    );
}

function ClientsTable({ data }: { data: any[] }) {
    if (!data.length) return <EmptyState text="No clients found" />;
    return (
        <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'hsl(var(--secondary))', borderBottom: '1px solid hsl(var(--border))' }}>
                        {['Company', 'Contact', 'Email', 'Phone', 'Billing Status', 'Due Date'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(c => (
                        <tr key={c._id} style={{ borderBottom: '1px solid hsl(var(--border))' }} className="hover:bg-[hsl(var(--secondary)/0.5)] transition-colors">
                            <td style={cellStyle}><strong>{c.companyName}</strong></td>
                            <td style={cellStyle}>{c.contactName || '—'}</td>
                            <td style={cellStyle}><span style={{ color: 'hsl(var(--primary))' }}>{c.email || '—'}</span></td>
                            <td style={cellStyle}>{c.phone || '—'}</td>
                            <td style={cellStyle}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--secondary))',
                                    color: 'hsl(var(--foreground))',
                                }}>
                                    {c.billingStatus?.toUpperCase()}
                                </span>
                            </td>
                            <td style={cellStyle}>{c.billingDueDate ? new Date(c.billingDueDate).toLocaleDateString() : '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TasksTable({ data }: { data: any[] }) {
    if (!data.length) return <EmptyState text="No tasks assigned to you" />;
    return (
        <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'hsl(var(--secondary))', borderBottom: '1px solid hsl(var(--border))' }}>
                        {['Task', 'Project', 'Status', 'Priority', 'Est. Hours', 'Actual', 'Completed'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(t => (
                        <tr key={t._id} style={{ borderBottom: '1px solid hsl(var(--border))' }} className="hover:bg-[hsl(var(--secondary)/0.5)] transition-colors">
                            <td style={cellStyle}><strong>{t.title}</strong></td>
                            <td style={cellStyle}>{t.projectId?.name || '—'}</td>
                            <td style={cellStyle}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                                    border: '1px solid hsl(var(--border))',
                                    background: 'hsl(var(--secondary))',
                                    color: 'hsl(var(--foreground))',
                                }}>
                                    {t.status?.replace('_', ' ').toUpperCase()}
                                </span>
                            </td>
                            <td style={cellStyle}>
                                <span style={{ color: priorityColors[t.priority] || 'hsl(var(--muted-foreground))', fontWeight: 600, fontSize: 12 }}>
                                    {t.priority?.toUpperCase()}
                                </span>
                            </td>
                            <td style={cellStyle}>{t.estimatedHours || '—'}h</td>
                            <td style={cellStyle}>{t.actualHours || '—'}h</td>
                            <td style={cellStyle}>{t.completedAt ? new Date(t.completedAt).toLocaleDateString() : '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TeamsTable({ data }: { data: any[] }) {
    if (!data.length) return <EmptyState text="No teams found" />;
    return (
        <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'hsl(var(--secondary))', borderBottom: '1px solid hsl(var(--border))' }}>
                        {['Team Name', 'Description', 'Lead', 'Members'].map(h => (
                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(t => (
                        <tr key={t._id} style={{ borderBottom: '1px solid hsl(var(--border))' }} className="hover:bg-[hsl(var(--secondary)/0.5)] transition-colors">
                            <td style={cellStyle}><strong>{t.name}</strong></td>
                            <td style={cellStyle}>{t.description || '—'}</td>
                            <td style={cellStyle}>{t.leadUserId?.fullName || t.leadUserId || '—'}</td>
                            <td style={cellStyle}>{t.memberIds?.length || 0} members</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TimesheetsView() {
    return (
        <div style={{ padding: 40, textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
            <Clock size={48} style={{ marginBottom: 16, opacity: 0.4, margin: '0 auto' }} />
            <p style={{ fontSize: 16, marginBottom: 8 }} className="font-semibold text-[hsl(var(--foreground))]">Timesheet Booking</p>
            <p style={{ fontSize: 13 }}>Log time against projects and tasks. Timesheets appear here once logged.</p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return <div style={{ padding: 60, textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>{text}</div>;
}

const cellStyle = { padding: '12px 16px', fontSize: 13, color: 'hsl(var(--foreground))' };
