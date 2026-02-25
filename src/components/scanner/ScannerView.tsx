import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ScanSearch,
    RotateCcw,
    Upload,
    File,
    Terminal,
    Loader2,
    Download,
    FileCode,
    ShieldAlert,
    Sparkles
} from 'lucide-react';
import { ScanResult, Violation } from '../../lib/types';
import { performExpertScan } from '../../lib/ai';
import { ScannerFindingRow } from './ScannerFindingRow';

interface ScannerViewProps {
    onAddViolations: (newViolations: Violation[]) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onAddViolations }) => {
    const [scanUrl, setScanUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [scanModes, setScanModes] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanLogs, setScanLogs] = useState<string[]>([]);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

    const startScan = async () => {
        if (!scanUrl && !selectedFile) {
            console.warn("Intento de escaneo sin URL ni archivo.");
            return;
        }

        console.log("🚀 Iniciando proceso de escaneo...", { scanUrl, fileName: selectedFile?.name, modes: scanModes });

        setIsScanning(true);
        setScanProgress(5);
        setScanLogs(["🔄 Inicializando motor de auditoría..."]);
        setScanResult(null);

        // Progreso simulado para dar feedback constante
        const progressInterval = setInterval(() => {
            setScanProgress(prev => (prev < 90 ? prev + 1 : prev));
        }, 2000);

        try {
            let content = "";
            if (selectedFile) {
                const rawContent = await selectedFile.text();
                if (selectedFile.name.endsWith('.ipynb')) {
                    try {
                        const nb = JSON.parse(rawContent);
                        content = nb.cells
                            .filter((cell: any) => cell.cell_type === 'code')
                            .map((cell: any) => Array.isArray(cell.source) ? cell.source.join('') : cell.source)
                            .join('\n\n');

                        if (!content.trim()) {
                            throw new Error("El notebook no contiene celdas de código válidas.");
                        }
                        setScanLogs(prev => [...prev, "📝 Notebook detectado. Extrayendo celdas de código..."]);
                    } catch (e: any) {
                        setScanLogs(prev => [...prev, `⚠️ Error al procesar JSON del Notebook: ${e.message}`]);
                        content = rawContent;
                    }
                } else {
                    content = rawContent;
                }
            } else {
                content = `Análisis para la URL: ${scanUrl}`;
            }

            if (!content.trim()) {
                throw new Error("No se pudo extraer contenido para analizar.");
            }

            setScanLogs(prev => [...prev, "🔍 Conectando con Gemini AI para auditoría profunda..."]);

            const result = await performExpertScan(
                content,
                selectedFile?.name || scanUrl,
                scanModes,
                (p) => {
                    /* El progreso real de la IA suele ser binario (0 o 100), 
                       así que usamos el simulador para el medio */
                },
                (log) => setScanLogs(prev => [...prev, log])
            );

            setScanResult(result);
            setScanProgress(100);

            const newViolations: Violation[] = result.findings.map(f => ({
                id: `SCAN-${Math.floor(Math.random() * 9000) + 1000}`,
                name: selectedFile?.name || scanUrl,
                policy: f.policy,
                status: 'Marcada',
                risk: f.status,
                date: new Date().toISOString().split('T')[0],
                year: new Date().getFullYear(),
                month: 'Febrero',
                area: 'Escaneo Externo',
                details: {
                    location: `${f.file}:${f.line}`,
                    snippet: f.snippet,
                    explanation: f.analysis
                }
            }));

            onAddViolations(newViolations);
            setScanLogs(prev => [...prev, "✅ Auditoría completada con éxito."]);
        } catch (error: any) {
            console.error("Scan Error:", error);
            setScanLogs(prev => [...prev, `❌ Error en el escaneo: ${error.message}`]);
            if (error.message.includes("API key")) {
                setScanLogs(prev => [...prev, "💡 Tip: Verifica tu VITE_GEMINI_API_KEY en .env.local"]);
            }
        } finally {
            clearInterval(progressInterval);
            setIsScanning(false);
        }
    };

    const handleReset = () => {
        setScanUrl('');
        setSelectedFile(null);
        setScanModes([]);
        setScanResult(null);
        setScanLogs([]);
        setScanProgress(0);
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                        <ScanSearch className="text-blue-400" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Escáner de Cumplimiento</h2>
                    <p className="text-slate-400 max-w-md mx-auto">Realiza auditorías profundas de seguridad y políticas basadas en IA.</p>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                    <div className="relative group">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10`}>
                            {selectedFile ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                                    <File size={14} className="text-blue-400" />
                                    <span className="text-xs text-blue-400 font-bold max-w-[150px] truncate">{selectedFile.name}</span>
                                    <button onClick={() => setSelectedFile(null)} className="text-blue-400 hover:text-white ml-1">×</button>
                                </div>
                            ) : (
                                <ScanSearch className="text-slate-500" size={18} />
                            )}
                        </div>
                        <input
                            type="text"
                            value={scanUrl}
                            onChange={(e) => { setScanUrl(e.target.value); if (e.target.value) setSelectedFile(null); }}
                            placeholder={selectedFile ? "" : "https://github.com/usuario/mi-proyecto"}
                            className={`w-full glass-input rounded-2xl py-4 text-sm text-white pl-12 pr-48`}
                            disabled={isScanning}
                        />
                        <div className="absolute right-2 top-2 bottom-2 flex gap-2">
                            <button onClick={handleReset} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><RotateCcw size={18} /></button>
                            <input type="file" id="file-upload" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setSelectedFile(f); setScanUrl(''); } }} />
                            <label htmlFor="file-upload" className="flex items-center gap-2 px-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl cursor-pointer border border-white/5"><Upload size={16} /></label>
                            <button
                                onClick={startScan}
                                disabled={isScanning || (!scanUrl && !selectedFile)}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {isScanning ? <Loader2 className="animate-spin" size={20} /> : <Terminal size={20} />} Analizar
                            </button>
                        </div>
                    </div>
                </div>

                {!isScanning && !scanLogs.length && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: FileCode, title: 'Análisis de Código', desc: 'Evalúa vulnerabilidades en el código fuente (Java, Python, Notebooks).' },
                            { icon: ShieldAlert, title: 'Detección de Riesgos', desc: 'Identifica violaciones de políticas y sesgos de AI Studio.' },
                            { icon: Sparkles, title: 'Reporte con IA', desc: 'Genera sugerencias automáticas y planes de mitigación.' }
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (scanModes.includes(item.title)) {
                                        setScanModes(scanModes.filter(m => m !== item.title));
                                    } else {
                                        setScanModes([...scanModes, item.title]);
                                    }
                                }}
                                className={`glass-card p-4 rounded-2xl border-white/5 text-center transition-all ${scanModes.includes(item.title) ? 'ring-2 ring-blue-500 bg-blue-500/10 border-blue-500/30' : 'hover:border-white/20'
                                    }`}
                            >
                                <item.icon className={`mx-auto mb-3 ${scanModes.includes(item.title) ? 'text-blue-400' : 'text-slate-500'}`} size={20} />
                                <h4 className={`text-sm font-bold mb-1 ${scanModes.includes(item.title) ? 'text-white' : 'text-slate-300'}`}>{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </button>
                        ))}
                    </div>
                )}

                {(isScanning || (scanLogs.length > 0 && !scanResult)) && (
                    <div className="space-y-6 mb-8">
                        {isScanning && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold tracking-widest text-blue-400 uppercase">
                                    <span>Analizando Arquitectura y Seguridad</span>
                                    <span>{Math.round(scanProgress)}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="glass-card bg-black/40 rounded-2xl p-6 font-mono text-xs h-64 overflow-y-auto border-white/5 whitespace-pre-wrap shadow-inner relative">
                            <div className="absolute top-2 right-4 flex items-center gap-2 text-[10px] text-slate-600 uppercase tracking-widest">
                                <Terminal size={10} /> Consola de Auditoría
                            </div>
                            {scanLogs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`mb-1.5 ${log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-emerald-400' : 'text-slate-400'}`}
                                >
                                    <span className="text-slate-700 mr-2">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                    {log}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {scanResult && !isScanning && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{scanResult.appName || 'App Analizada'}</h3>
                                    <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 uppercase tracking-widest">{scanResult.classification}</span>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"><Download size={16} /> Exportar Reporte</button>
                            </div>

                            <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/10 mb-8">
                                <p className="text-sm text-slate-300 leading-relaxed italic">"{scanResult.description}"</p>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-white/5">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-500 text-xs uppercase tracking-widest">
                                        <tr><th className="px-6 py-4">Archivo</th><th className="px-6 py-4">Política</th><th className="px-6 py-4">Riesgo</th><th className="px-6 py-4"></th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {scanResult.findings.map((f, i) => <ScannerFindingRow key={i} finding={f} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
