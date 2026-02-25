import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { ScanFinding } from '../../lib/types';

interface ScannerFindingRowProps {
    finding: ScanFinding;
}

export const ScannerFindingRow: React.FC<ScannerFindingRowProps> = ({ finding }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <tr
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-white/5 transition-colors cursor-pointer group"
            >
                <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{finding.file}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{finding.language}</span>
                        <span>Línea {finding.line}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">{finding.policy}</div>
                </td>
                <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${finding.status === 'Crítico' ? 'text-red-400' :
                        finding.status === 'Alto' ? 'text-orange-400' :
                            'text-blue-400'
                        }`}>
                        {finding.status}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                    <ChevronRight size={16} className={`text-slate-600 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-blue-400' : ''}`} />
                </td>
            </tr>
            <AnimatePresence mode="wait">
                {isExpanded && (
                    <tr key="expanded">
                        <td colSpan={4} className="px-6 py-0">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="py-6 space-y-4">
                                    <div className="glass-card bg-black/40 rounded-2xl overflow-hidden border-white/5">
                                        <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                            <span className="text-xs font-mono text-slate-400">Código Fuente Detectado</span>
                                            <span className="text-xs text-slate-600 uppercase tracking-widest">Vulnerabilidad de {finding.policy}</span>
                                        </div>
                                        <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                                            <pre className="text-red-400/80">
                                                <code>{finding.snippet || "/* Fragmento de código no disponible para este hallazgo */"}</code>
                                            </pre>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10">
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            <strong className="text-blue-400 mr-2">Análisis del Experto:</strong>
                                            {finding.analysis || "Análisis técnico en preparación para este ítem específico."}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    );
};
