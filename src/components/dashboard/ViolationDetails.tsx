import React from 'react';
import { motion } from 'motion/react';
import {
    ChevronRight,
    AlertTriangle,
    FileCode,
    CheckCircle,
    Ban,
    Clock,
    ShieldAlert
} from 'lucide-react';
import { Violation, Policy } from '../../lib/types';

interface ViolationDetailsProps {
    violation: Violation;
    policies: Policy[];
    onBack: () => void;
    onAction: (id: string, type: string) => void;
}

export const ViolationDetails: React.FC<ViolationDetailsProps> = ({
    violation,
    policies,
    onBack,
    onAction
}) => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-400 mb-6 group">
                <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Regresar al Tablero</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 rounded-[2.5rem]">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{violation.name}</h2>
                                <p className="text-xs text-slate-500 font-mono">{violation.id} • Detectado el {violation.date}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest border border-white/10 ${violation.status === 'Resuelta' ? 'text-emerald-400 bg-emerald-400/10' : 'text-blue-400 bg-blue-400/10'
                                }`}>{violation.status}</span>
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                <div className="flex gap-4 mb-4">
                                    <AlertTriangle className="text-amber-400 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{violation.policy}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            {policies.find(p => p.name === violation.policy)?.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 my-4" />
                                <p className="text-sm text-slate-300 italic">"{violation.details.explanation}"</p>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Evidencia Técnica</h4>
                                <div className="glass-card bg-black/40 rounded-2xl overflow-hidden border-white/5 font-mono text-xs">
                                    <div className="px-4 py-2 border-b border-white/5 text-slate-500">{violation.details.location}</div>
                                    <pre className="p-6 text-emerald-400 overflow-x-auto"><code>{violation.details.snippet}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl">
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Acciones de Protocolo</h4>
                        <div className="space-y-3">
                            <button onClick={() => onAction(violation.id, 'resolve')} className="w-full py-3 bg-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><CheckCircle size={16} /> Resolver</button>
                            <button onClick={() => onAction(violation.id, 'ban')} className="w-full py-3 bg-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><Ban size={16} /> Prohibir</button>
                            <button className="w-full py-3 glass-card text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><Clock size={16} /> Pendiente</button>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-3xl">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Riesgo Asociado</h4>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500"><ShieldAlert size={24} /></div>
                            <div><p className="text-xl font-bold text-white uppercase">{violation.risk}</p><p className="text-[10px] text-slate-500 tracking-tighter">PROTOCOLO DE RESPUESTA CRÍTICA</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
