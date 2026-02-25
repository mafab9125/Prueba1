import React from 'react';
import { motion } from 'motion/react';
import { Settings, Moon, Bell, Globe, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="glass-card p-10 rounded-[2.5rem]">
                <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                    <Settings size={28} className="text-blue-400" />
                    Configuración del Sistema
                </h3>

                <div className="space-y-8">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-600/10 border border-blue-500/20">
                                <Moon size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white">Modo Oscuro Pro Max</h4>
                                <p className="text-sm text-slate-500">Optimizado para entornos de baja luminosidad.</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-600/10 border border-amber-500/20">
                                <Bell size={20} className="text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white">Alertas de Protocolo</h4>
                                <p className="text-sm text-slate-500">Notificaciones críticas en tiempo real.</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-slate-700 rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20">
                                <Globe size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white">Localización</h4>
                                <p className="text-sm text-slate-500">Idioma del sistema y métricas regionales.</p>
                            </div>
                        </div>
                        <select className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-blue-500/50 transition-colors">
                            <option>Español (Latam)</option>
                            <option>English (US)</option>
                        </select>
                    </div>
                </div>

                <div className="mt-12 flex justify-end gap-4">
                    <button className="px-8 py-3 glass-card rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">
                        Restablecer
                    </button>
                    <button className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                        <Save size={18} />
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
