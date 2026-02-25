import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Activity,
    PieChart as PieChartIcon,
    ShieldAlert,
    CheckCircle,
    Clock,
    Sparkles,
    Loader2,
    Trash2
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Violation, ChartDataItem, RiskDataItem, Policy } from '../../lib/types';
import { ActionMenu } from './ActionMenu';
import { generateAiSummary } from '../../lib/ai';

interface DashboardViewProps {
    violations: Violation[];
    setViolations: React.Dispatch<React.SetStateAction<Violation[]>>;
    chartData: ChartDataItem[];
    riskData: RiskDataItem[];
    policies: Policy[];
    onViewDetails: (violation: Violation) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    violations,
    setViolations,
    chartData,
    riskData,
    policies,
    onViewDetails
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showCriticalOnly, setShowCriticalOnly] = useState(false);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const [filters, setFilters] = useState({
        year: 'Todos',
        month: 'Todos',
        risk: 'Todos',
        policy: 'Todas',
        area: 'Todas',
        status: 'Todos'
    });
    const [appliedFilters, setAppliedFilters] = useState({ ...filters });

    const filteredViolations = violations.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.policy.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.id.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;
        if (showCriticalOnly && v.risk !== 'Crítico' && v.risk !== 'Alto') return false;

        if (appliedFilters.year !== 'Todos' && v.year !== parseInt(appliedFilters.year)) return false;
        if (appliedFilters.month !== 'Todos' && v.month !== appliedFilters.month) return false;
        if (appliedFilters.risk !== 'Todos' && v.risk !== appliedFilters.risk) return false;
        if (appliedFilters.policy !== 'Todas' && v.policy !== appliedFilters.policy) return false;
        if (appliedFilters.area !== 'Todas' && v.area !== appliedFilters.area) return false;
        if (appliedFilters.status !== 'Todos' && v.status !== appliedFilters.status) return false;

        return true;
    });

    const handleAiSummary = async () => {
        setIsGenerating(true);
        try {
            const summary = await generateAiSummary(filteredViolations);
            setAiSummary(summary);
        } catch (err: any) {
            setAiSummary(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAction = (id: string, type: string) => {
        if (type === 'view') {
            const violation = violations.find(v => v.id === id);
            if (violation) onViewDetails(violation);
        } else if (type === 'delete') {
            setViolations(prev => prev.filter(v => v.id !== id));
        } else if (type === 'resolve') {
            setViolations(prev => prev.map(v => v.id === id ? { ...v, status: 'Resuelta' } : v));
        } else if (type === 'ban') {
            setViolations(prev => prev.map(v => v.id === id ? { ...v, status: 'Prohibida' } : v));
        }
    };

    const filteredRiskData = riskData.map(r => ({
        ...r,
        value: filteredViolations.filter(v => v.risk === r.name).length
    }));

    const dynamicChartData = chartData.map(d => ({
        ...d,
        violaciones: filteredViolations.filter(v => v.month.toLowerCase().startsWith(d.name.toLowerCase())).length || d.violaciones
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            {/* Search & Filters */}
            <div className="flex justify-center mb-10">
                <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative">
                    <div className="flex items-center gap-4 w-full glass-card p-2 rounded-2xl border-white/10 shadow-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar aplicaciones, políticas o riesgos..."
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 pl-12 py-3 text-sm"
                            />
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${isFilterOpen ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Filter size={18} />
                            <span className="text-xs font-bold tracking-widest hidden sm:block">Filtros</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full mt-4 w-full glass-card rounded-3xl p-6 z-50 shadow-2xl border-white/10"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 tracking-widest">Año</label>
                                        <select
                                            value={filters.year}
                                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                                        >
                                            <option value="Todos">Todos</option>
                                            <option value="2026">2026</option>
                                            <option value="2025">2025</option>
                                        </select>
                                    </div>
                                    {/* ... other filters can be added here ... */}
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <button
                                        onClick={() => {
                                            const reset = { year: 'Todos', month: 'Todos', risk: 'Todos', policy: 'Todas', area: 'Todas', status: 'Todos' };
                                            setFilters(reset); setAppliedFilters(reset); setIsFilterOpen(false);
                                        }}
                                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold tracking-widest transition-all"
                                    >
                                        Limpiar
                                    </button>
                                    <button
                                        onClick={() => { setAppliedFilters({ ...filters }); setIsFilterOpen(false); }}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-widest transition-all"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Apps Analizadas', value: filteredViolations.length, icon: <Search className="text-blue-400" />, color: 'blue', trend: '+12.5%' },
                    { label: 'Críticos', value: filteredViolations.filter(v => v.risk === 'Crítico' || v.risk === 'Alto').length, icon: <ShieldAlert className="text-red-400" />, color: 'red', trend: '+4.3%' },
                    { label: 'Resueltos', value: filteredViolations.filter(v => v.status === 'Resuelta').length, icon: <CheckCircle className="text-emerald-400" />, color: 'emerald', trend: '+18.2%' },
                    { label: 'Respuesta', value: '2.4h', icon: <Clock className="text-amber-400" />, color: 'amber', trend: '-15%' },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className={`p-2 rounded-xl bg-white/5 border border-white/10`}>{stat.icon}</div>
                            <div className="text-emerald-400 text-sm font-bold">{stat.trend}</div>
                        </div>
                        <p className="text-slate-500 text-lg font-bold mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts & AI Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="text-blue-400" size={18} />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Actividad de Cumplimiento</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dynamicChartData}>
                                <defs>
                                    <linearGradient id="colorViolaciones" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="violaciones" stroke="#3b82f6" fill="url(#colorViolaciones)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChartIcon className="text-amber-400" size={18} />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Riesgo Global</h3>
                    </div>
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={filteredRiskData} dataKey="value" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                    {filteredRiskData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white">{filteredViolations.length}</span>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        {filteredRiskData.map(r => (
                            <div key={r.name} className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }} /> {r.name}</span>
                                <span className="font-bold">{r.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {aiSummary && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-6 rounded-2xl border-blue-500/20 mb-6">
                        <div className="flex items-center gap-2 mb-3 text-blue-400">
                            <Sparkles size={18} />
                            <h2 className="font-bold tracking-wider text-xs uppercase">Insight IA Pro Max</h2>
                            <button onClick={() => setAiSummary(null)} className="ml-auto text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed italic">"{aiSummary}"</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white tracking-widest">REGISTRO DE VIOLACIONES</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setShowCriticalOnly(!showCriticalOnly)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showCriticalOnly ? 'bg-red-600' : 'bg-white/5'}`}>Críticos</button>
                        <button onClick={handleAiSummary} disabled={isGenerating} className="px-3 py-1.5 bg-blue-600 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20">
                            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} IA Resumen
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">App</th>
                                <th className="px-6 py-4">Política</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Riesgo</th>
                                <th className="px-6 py-4 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {filteredViolations.map(v => (
                                <tr key={v.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4"><p className="font-bold text-white">{v.name}</p><p className="text-[10px] text-slate-500 font-mono">{v.id}</p></td>
                                    <td className="px-6 py-4 text-slate-400 truncate max-w-[150px]">{v.policy}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${v.status === 'Resuelta' ? 'text-emerald-400 bg-emerald-400/10' : 'text-blue-400 bg-blue-400/10'}`}>{v.status}</span></td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${v.risk === 'Crítico' ? 'bg-red-500' : 'bg-orange-500'}`} /> {v.risk}</div></td>
                                    <td className="px-6 py-4 text-right"><ActionMenu onAction={(t) => handleAction(v.id, t)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};
