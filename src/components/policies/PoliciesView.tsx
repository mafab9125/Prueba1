import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, BookOpen, Info, CheckCircle2 } from 'lucide-react';
import { Policy } from '../../lib/types';

interface PoliciesViewProps {
    policies: Policy[];
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ policies }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1400px] mx-auto"
        >
            <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <ShieldAlert className="text-blue-400" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Catálogo de Políticas</h2>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Marco de gobernanza y cumplimiento para el desarrollo de sistemas de IA seguros y éticos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy, index) => (
                    <motion.div
                        key={policy.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card p-6 rounded-3xl border-white/5 hover:border-blue-500/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-colors">
                                <BookOpen size={24} className="text-blue-400" />
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                                Activa
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                            {policy.name}
                        </h3>

                        <p className="text-sm text-slate-400 leading-relaxed mb-6 h-20 overflow-hidden line-clamp-4">
                            {policy.description}
                        </p>

                        <div className="pt-6 border-t border-white/5 space-y-3">
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span>Validación Automatizada</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                <Info size={14} className="text-blue-500" />
                                <span>Protocolo NIST / OWASP</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
