import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, User, Settings, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
    onLogin: (isLoggedIn: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Obtener credenciales de variables de entorno (Vite)
        const validUser = import.meta.env.VITE_ADMIN_USER || 'admin';
        const validPass = import.meta.env.VITE_ADMIN_PASS || '123456';

        if (loginData.username === validUser && loginData.password === validPass) {
            onLogin(true);
            setLoginError('');
        } else {
            setLoginError('Credenciales incorrectas. Intente con los valores configurados en su entorno.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="cyber-bg">
                <div className="cyber-grid" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-card rounded-[2.5rem] relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/40"
                    >
                        <ShieldCheck className="text-white" size={40} />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-white mb-2">Sistema de Cumplimiento</h1>
                    <p className="text-slate-400 text-sm">Versión Pro Max • Acceso Seguro</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 tracking-widest">USUARIO</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                placeholder="admin"
                                className="w-full glass-input rounded-2xl pl-12 pr-4 py-4 text-sm text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 tracking-widest">CONTRASEÑA</label>
                        <div className="relative">
                            <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full glass-input rounded-2xl pl-12 pr-12 py-4 text-sm text-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {loginError && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-red-400 text-xs text-center font-medium"
                        >
                            {loginError}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] text-slate-600 tracking-[0.2em]">Socio-Technical Mediation Protocol</p>
                </div>
            </motion.div>
        </div>
    );
};
