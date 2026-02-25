import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreVertical, Eye, Check, Ban, Trash2 } from 'lucide-react';

interface ActionMenuProps {
    onAction: (type: string) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-500 hover:text-white p-1.5 hover:bg-slate-800 rounded-md transition-all"
            >
                <MoreVertical size={16} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-1 z-50 shadow-2xl"
                    >
                        <button onClick={() => { onAction('view'); setIsOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-colors">
                            <Eye size={14} /> Ver Detalles
                        </button>
                        <button onClick={() => { onAction('resolve'); setIsOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors">
                            <Check size={14} /> Resolver
                        </button>
                        <button onClick={() => { onAction('ban'); setIsOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <Ban size={14} /> Prohibir
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        <button onClick={() => { onAction('delete'); setIsOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                            <Trash2 size={14} /> Eliminar Registro
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
