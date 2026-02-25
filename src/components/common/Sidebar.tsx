import React from 'react';
import { motion } from 'motion/react';
import {
    ShieldCheck,
    LayoutDashboard,
    ScanSearch,
    ShieldAlert,
    Settings,
    User
} from 'lucide-react';

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active
            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
        {active && (
            <motion.div
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
            />
        )}
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    return (
        <aside className="w-64 glass-sidebar hidden lg:flex flex-col p-6 fixed h-full z-40">
            <div className="flex items-center gap-3 mb-10 px-2">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20"
                >
                    <ShieldCheck className="text-white" size={24} />
                </motion.div>
                <div>
                    <h1 className="text-sm font-bold text-white leading-tight">PolicyGuard AI</h1>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <SidebarItem
                    icon={LayoutDashboard}
                    label="Tablero"
                    active={activeView === 'dashboard'}
                    onClick={() => setActiveView('dashboard')}
                />
                <SidebarItem
                    icon={ScanSearch}
                    label="Escáner"
                    active={activeView === 'scanner'}
                    onClick={() => setActiveView('scanner')}
                />
                <SidebarItem
                    icon={ShieldAlert}
                    label="Políticas"
                    active={activeView === 'policies'}
                    onClick={() => setActiveView('policies')}
                />
                <SidebarItem
                    icon={Settings}
                    label="Configuración"
                    active={activeView === 'settings'}
                    onClick={() => setActiveView('settings')}
                />
            </nav>

            <div className="mt-auto glass-card p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                        <User size={20} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Admin User</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Protocol Lead</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
