import React from 'react';
import {
    LayoutDashboard,
    ScanSearch,
    ShieldAlert,
    Settings,
    FileCode
} from 'lucide-react';

interface HeaderProps {
    activeView: string;
}

export const Header: React.FC<HeaderProps> = ({ activeView }) => {
    const getViewTitle = () => {
        switch (activeView) {
            case 'dashboard': return 'Tablero';
            case 'scanner': return 'Escáner';
            case 'policies': return 'Políticas';
            case 'settings': return 'Configuración';
            case 'details': return 'Detalles del Análisis';
            default: return activeView;
        }
    };

    const Icon = () => {
        const props = { className: "text-blue-400", size: 24 };
        switch (activeView) {
            case 'dashboard': return <LayoutDashboard {...props} />;
            case 'scanner': return <ScanSearch {...props} />;
            case 'policies': return <ShieldAlert {...props} />;
            case 'settings': return <Settings {...props} />;
            case 'details': return <FileCode {...props} />;
            default: return null;
        }
    };

    return (
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <Icon />
                    <h2 className="text-2xl font-bold text-white">{getViewTitle()}</h2>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    className={`p-2 glass-card rounded-xl transition-colors ${activeView === 'policies' ? 'text-blue-400 border-blue-500/30' : 'text-slate-400 hover:text-white'}`}
                >
                    <ShieldAlert size={18} />
                </button>
            </div>
        </header>
    );
};
