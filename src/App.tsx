/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Clock,
  Ban,
  Sparkles,
  Loader2,
  LayoutDashboard,
  ScanSearch,
  Settings,
  Bell,
  User,
  ChevronRight,
  FileCode,
  Terminal,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Check,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Database,
  Download,
  Upload,
  File,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
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
  Cell,
  BarChart,
  Bar
} from 'recharts';

// --- Constants ---

const CHART_DATA = [
  { name: 'Ene', violaciones: 12, escaneos: 120 },
  { name: 'Feb', violaciones: 18, escaneos: 150 },
  { name: 'Mar', violaciones: 15, escaneos: 140 },
  { name: 'Abr', violaciones: 22, escaneos: 180 },
  { name: 'May', violaciones: 30, escaneos: 210 },
  { name: 'Jun', violaciones: 25, escaneos: 190 },
  { name: 'Jul', violaciones: 35, escaneos: 240 },
  { name: 'Ago', violaciones: 40, escaneos: 280 },
  { name: 'Sep', violaciones: 38, escaneos: 260 },
  { name: 'Oct', violaciones: 45, escaneos: 310 },
  { name: 'Nov', violaciones: 50, escaneos: 340 },
  { name: 'Dic', violaciones: 48, escaneos: 320 },
];

const RISK_DATA = [
  { name: 'Crítico', value: 400, color: '#ef4444' },
  { name: 'Alto', value: 300, color: '#f97316' },
  { name: 'Medio', value: 300, color: '#facc15' },
  { name: 'Bajo', value: 200, color: '#3b82f6' },
];

const POLICIES = [
  {
    name: "Malware, phishing o suplantación de identidad",
    description: "Contenido que intenta engañar a los usuarios para que compartan información confidencial o descarguen software malicioso."
  },
  {
    name: "Suplantación de identidad",
    description: "Contenido que se hace pasar por otra persona o entidad para engañar a los usuarios o causar daño."
  },
  {
    name: "Imágenes de abuso sexual infantil (CSAM)",
    description: "Cualquier contenido que represente o promueva el abuso sexual infantil. Tolerancia cero."
  },
  {
    name: "Acoso",
    description: "Contenido que promueve el acoso, la intimidación o el abuso de individuos o grupos."
  },
  {
    name: "Discurso de odio",
    description: "Contenido que promueve la violencia, incita al odio o discrimina por motivos de raza, religión, género, etc."
  },
  {
    name: "Trata de personas",
    description: "Contenido que facilita o promueve la explotación humana o el tráfico de personas."
  },
  {
    name: "Contenido sexualmente explícito",
    description: "Contenido que contiene desnudez o actos sexuales explícitos no educativos ni artísticos."
  },
  {
    name: "Violencia y sangre",
    description: "Contenido extremadamente violento o gráfico que no tiene un propósito informativo o documental."
  },
  {
    name: "Políticas dañinas o peligrosas",
    description: "Contenido que promueve actividades ilegales o peligrosas que pueden causar daño físico grave."
  }
];

const INITIAL_VIOLATIONS = [
  {
    id: 'APP-882',
    name: 'NeuralGen Pro',
    policy: 'Contenido sexualmente explícito',
    status: 'Marcada',
    risk: 'Alto',
    date: '2026-02-22',
    year: 2026,
    month: 'Febrero',
    area: 'Generación de Contenido',
    details: {
      location: 'src/components/ImageGenerator.tsx:142',
      snippet: 'const generatePrompt = (input) => { return `NSFW ${input}`; };',
      explanation: 'El sistema detectó un prefijo que fuerza la generación de contenido no apto para todo público.'
    }
  },
  {
    id: 'APP-441',
    name: 'ChatBot-X',
    policy: 'Discurso de odio',
    status: 'En Revisión',
    risk: 'Medio',
    date: '2026-02-21',
    year: 2026,
    month: 'Febrero',
    area: 'Comunicación',
    details: {
      location: 'src/api/chat.ts:88',
      snippet: 'if (user.isMinor) { allowUnfilteredChat = true; }',
      explanation: 'Se detectó una lógica que desactiva los filtros de seguridad para usuarios menores de edad.'
    }
  },
  {
    id: 'APP-102',
    name: 'EasyScraper',
    policy: 'Malware, phishing o suplantación de identidad',
    status: 'Prohibida',
    risk: 'Crítico',
    date: '2026-01-20',
    year: 2026,
    month: 'Enero',
    area: 'Herramientas de Datos',
    details: {
      location: 'public/index.html:12',
      snippet: '<script src="https://evil-cdn.com/stealer.js"></script>',
      explanation: 'Inyección de script externo malicioso detectada en el punto de entrada de la aplicación.'
    }
  },
  {
    id: 'APP-993',
    name: 'SocialConnect',
    policy: 'Acoso',
    status: 'Resuelta',
    risk: 'Bajo',
    date: '2025-12-19',
    year: 2025,
    month: 'Diciembre',
    area: 'Redes Sociales',
    details: {
      location: 'src/utils/notifications.ts:45',
      snippet: 'sendSpam(user.contacts);',
      explanation: 'Función que permite el envío masivo de mensajes no solicitados a contactos del usuario.'
    }
  },
  {
    id: 'APP-555',
    name: 'DeepFake Studio',
    policy: 'Suplantación de identidad',
    status: 'Apelación',
    risk: 'Alto',
    date: '2025-11-18',
    year: 2025,
    month: 'Noviembre',
    area: 'Multimedia',
    details: {
      location: 'src/utils/face_swap.py:22',
      snippet: 'def swap_identity(target, source): ...',
      explanation: 'Modelo de IA optimizado para la creación de deepfakes sin marcas de agua de seguridad.'
    }
  },
];

// --- Components ---

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
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
  </button>
);

const ActionMenu = ({ onAction }: { onAction: (type: string) => void }) => {
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

interface ScannerFindingRowProps {
  finding: any;
  key?: any;
}

const ScannerFindingRow = ({ finding }: ScannerFindingRowProps) => {
  const f = finding;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setIsExpanded(!isExpanded)}
        className="hover:bg-white/5 transition-colors cursor-pointer group"
      >
        <td className="px-6 py-4">
          <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{f.file}</div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{f.language}</span>
            <span>Línea {f.line}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-slate-300">{f.policy}</div>
        </td>
        <td className="px-6 py-4">
          <span className={`text-sm font-bold ${f.status === 'Crítico' ? 'text-red-400' :
            f.status === 'Alto' ? 'text-orange-400' :
              'text-blue-400'
            }`}>
            {f.status}
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
                      <span className="text-xs text-slate-600 uppercase tracking-widest">Vulnerabilidad de {f.policy}</span>
                    </div>
                    <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                      <pre className="text-red-400/80">
                        <code>{f.snippet || "/* Fragmento de código no disponible para este hallazgo */"}</code>
                      </pre>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10">
                    <p className="text-sm text-slate-400 leading-relaxed">
                      <strong className="text-blue-400 mr-2">Análisis del Experto:</strong>
                      {f.analysis || "Análisis técnico en preparación para este ítem específico."}
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

// --- Main View ---


const ComplianceDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('pendientes');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [violations, setViolations] = useState(INITIAL_VIOLATIONS);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  // Advanced Filters State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    year: 'Todos',
    month: 'Todos',
    risk: 'Todos',
    policy: 'Todas',
    area: 'Todas',
    status: 'Todos'
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  // Login State
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === '123456') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. Intente con admin/123456');
    }
  };

  // Scanner State
  const [scanUrl, setScanUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanModes, setScanModes] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const generateAiSummary = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      setAiSummary("Error: GEMINI_API_KEY no configurada. Por favor, configura la variable de entorno en el panel de Vercel.");
      return;
    }

    setIsGenerating(true);
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const response = await genAI.models.generateContent({
        model: "gemini-flash-latest",
        contents: [{
          parts: [{
            text: `Como experto en seguridad de aplicaciones, resume brevemente el estado de estas violaciones detectadas: ${JSON.stringify(violations)}. Proporciona una recomendación de prioridad en español.`
          }]
        }],
      });
      setAiSummary(response.text || "No se pudo generar el resumen.");
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setAiSummary("Error al conectar con la IA. Verifica tu API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startScan = async () => {
    if (!scanUrl && !selectedFile) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "tu_llave_aqui" || apiKey === "MY_GEMINI_API_KEY") {
      setScanLogs(["❌ Error: GEMINI_API_KEY no configurada. Agrega tu clave válida de Google AI Studio en el archivo .env y reinicia el servidor."]);
      setScanProgress(0);
      return;
    }
    if (!apiKey.startsWith('AIzaSy')) {
      setScanLogs([`❌ Error: La API key '${apiKey.substring(0, 15)}...' no tiene el formato correcto. Las llaves de Gemini empiezan con 'AIzaSy...'. Obtenla en https://aistudio.google.com/app/apikey`]);
      setScanProgress(0);
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);

    let fileContent = "";
    if (selectedFile) {
      setScanLogs(prev => [...prev, `📂 Preparando archivo: ${selectedFile.name}...`]);
      fileContent = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || "");
        reader.readAsText(selectedFile);
      });
    }

    const genAI = new GoogleGenAI({ apiKey });
    setScanProgress(10);
    setScanLogs(prev => [...prev, "🚀 Iniciando Auditoría de Experto Nivel 300..."]);

    const prompt = `Actúa como un Auditor de Ciberseguridad de Élite y Arquitecto de Sistemas Principal. Tu tarea es realizar un análisis de profundidad "Nivel 300" sobre el código o contexto proporcionado.
      
      CONTENIDO A ANALIZAR: 
      Nombre: ${selectedFile?.name || scanUrl}
      Contenido: ${fileContent.substring(0, 20000)} ${fileContent.length > 20000 ? "...(truncado)" : ""}
      
      MODOS SELECCIONADOS: ${scanModes.length > 0 ? scanModes.join(', ') : 'Auditoría Integral'}
      
      INSTRUCCIONES DE PUNTUACIÓN (ESTRICTO):
      - Inicia con 100 puntos en Arquitectura y Seguridad.
      - DEBES RESTAR entre 10 y 25 puntos por cada hallazgo "Crítico" o "Alto".
      - Si hay un Riesgo Crítico general, los puntajes NO PUEDEN ser 100/100.
      
      DIMENSIONES DE ANÁLISIS REQUERIDAS:
      1. ARQUITECTURA DE DATOS Y FLUJO: Analiza patrones de diseño, acoplamiento, cohesión, gestión de estado y eficiencia.
      2. SEGURIDAD DE DATOS DE ALTA RIGOR: Identifica falta de saneamiento, exposición de PII, gestión insegura de secretos, y riesgos de inyección (SQL, Prompt Injection, XSS) según OWASP y NIST CSF.
      
      FORMATO DE SALIDA (JSON ESTRICTO):
      {
        "classification": "Riesgo Crítico|Alto|Medio|Bajo",
        "architectureScore": 60,
        "dataSecurityScore": 45,
        "description": "Análisis ejecutivo detallado.",
        "architectureDetails": [{"failure": "string", "impact": "Crítico|Alto|Medio", "location": "string", "snippet": "string"}],
        "dataSecurityDetails": [{"failure": "string", "impact": "Crítico|Alto|Medio", "location": "string", "snippet": "string"}],
        "findings": [{"file": "string", "policy": "string", "status": "Crítico|Alto|Medio|Informativo", "line": 0, "language": "string", "snippet": "string", "analysis": "string"}]
      }`;

    const runAiWithRetry = async (retryCount = 0): Promise<any> => {
      try {
        setScanLogs(prev => [...prev, `🔍 Analizando vulnerabilidades y arquitectura [Fase ${retryCount + 1}]...`]);
        const response = await genAI.models.generateContent({
          model: "gemini-flash-latest",
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                classification: { type: Type.STRING },
                architectureScore: { type: Type.NUMBER },
                dataSecurityScore: { type: Type.NUMBER },
                description: { type: Type.STRING },
                architectureDetails: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      failure: { type: Type.STRING },
                      impact: { type: Type.STRING },
                      location: { type: Type.STRING },
                      snippet: { type: Type.STRING }
                    }
                  }
                },
                dataSecurityDetails: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      failure: { type: Type.STRING },
                      impact: { type: Type.STRING },
                      location: { type: Type.STRING },
                      snippet: { type: Type.STRING }
                    }
                  }
                },
                findings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      file: { type: Type.STRING },
                      policy: { type: Type.STRING },
                      status: { type: Type.STRING },
                      line: { type: Type.NUMBER },
                      language: { type: Type.STRING },
                      snippet: { type: Type.STRING },
                      analysis: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        });
        return JSON.parse(response.text || "{}");
      } catch (error: any) {
        const msg = (error?.message || "").toLowerCase();
        const is503 = msg.includes("503") || msg.includes("high demand") || msg.includes("unavailable");
        if (is503 && retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 3000;
          setScanLogs(prev => [...prev, `⚠️ [!] Alta demanda en Gemini (503). Reintentando en ${delay / 1000}s...`]);
          await new Promise(r => setTimeout(r, delay));
          return runAiWithRetry(retryCount + 1);
        }
        throw error;
      }
    };

    try {
      setScanProgress(40);
      const result = await runAiWithRetry();

      // Sanitizar resultados y asegurar puntajes coherentes
      result.architectureScore = Number(result.architectureScore) || 0;
      result.dataSecurityScore = Number(result.dataSecurityScore) || 0;

      // Forzar que si hay hallazgos críticos los scores no sean 100
      const hasCritical = result.findings?.some((f: any) => f.status === 'Crítico' || f.status === 'Alto');
      if (hasCritical) {
        if (result.architectureScore > 80) result.architectureScore = 75;
        if (result.dataSecurityScore > 80) result.dataSecurityScore = 70;
      }

      // Asegurar que cada finding tenga explicación para la UI
      result.findings = result.findings?.map((f: any) => ({
        ...f,
        snippet: f.snippet || "/* Ver análisis del experto para más detalles */",
        analysis: f.analysis || "Se detectó una vulnerabilidad potencial que requiere revisión manual."
      })) || [];

      result.appName = selectedFile ? selectedFile.name : (scanUrl.replace('https://', '').split('/')[0] || 'App Escaneada');

      setScanProgress(100);
      setScanLogs(prev => [...prev, "✅ Análisis de profundidad completado."]);

      setScanResult(result);
      setIsScanning(false);

      // Mapear hallazgos asegurando visibilidad de snippets y análisis
      const newViolations = result.findings?.map((f: any) => ({
        id: `SCAN-${Math.floor(Math.random() * 9000) + 1000}`,
        name: result.appName,
        policy: f.policy || 'Política General',
        status: 'Marcada',
        risk: f.status || 'Medio',
        date: new Date().toISOString().split('T')[0],
        year: new Date().getFullYear(),
        month: (() => {
          const m = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
          return m.charAt(0).toUpperCase() + m.slice(1);
        })(),
        area: 'Escaneo Externo',
        details: {
          location: (f.file || 'General') + (f.line ? ':' + f.line : ''),
          snippet: f.snippet || "Snippet no disponible.",
          explanation: f.analysis || "Sin detalles técnicos adicionales."
        }
      })) || [];

      setViolations(prev => [...newViolations, ...prev]);

    } catch (error: any) {
      console.error("Error in expert scan:", error);
      const errorMsg = error?.message || error?.toString() || "Error desconocido";
      setScanLogs(prev => [...prev, `❌ Error de API Gemini: ${errorMsg}`]);
      setScanLogs(prev => [...prev, "💡 Sugerencia: Verifica que tu API key sea válida y que el modelo 'gemini-2.0-flash' esté disponible en tu cuenta."]);
      setIsScanning(false);
    }
  };

  const handleResetScanner = () => {
    setScanUrl('');
    setSelectedFile(null);
    setScanModes([]);
    setScanResult(null);
    setScanLogs([]);
    setScanProgress(0);
  };

  const filteredViolations = violations.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.policy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (showCriticalOnly && v.risk !== 'Crítico' && v.risk !== 'Alto') return false;

    // Advanced Filters (using appliedFilters)
    if (appliedFilters.year !== 'Todos' && v.year !== parseInt(appliedFilters.year)) return false;
    if (appliedFilters.month !== 'Todos' && v.month !== appliedFilters.month) return false;
    if (appliedFilters.risk !== 'Todos' && v.risk !== appliedFilters.risk) return false;
    if (appliedFilters.policy !== 'Todas' && v.policy !== appliedFilters.policy) return false;
    if (appliedFilters.area !== 'Todas' && v.area !== appliedFilters.area) return false;
    if (appliedFilters.status !== 'Todos' && v.status !== appliedFilters.status) return false;

    return true;
  });

  // Derived data for charts based on filtered violations
  const filteredRiskData = RISK_DATA.map(r => {
    const count = filteredViolations.filter(v => v.risk === r.name).length;
    return { ...r, value: count || 0 };
  });

  // For activity chart, we'll simulate dynamic data based on filtered counts
  const dynamicChartData = CHART_DATA.map(d => {
    const monthViolations = filteredViolations.filter(v => v.month.toLowerCase().startsWith(d.name.toLowerCase())).length;
    return { ...d, violaciones: monthViolations || d.violaciones };
  });

  const handleAction = (id: string, type: string) => {
    const violation = violations.find(v => v.id === id);
    if (type === 'view' && violation) {
      setSelectedViolation(violation);
      setActiveView('details');
    } else if (type === 'delete') {
      setViolations(prev => prev.filter(v => v.id !== id));
    } else if (type === 'resolve') {
      setViolations(prev => prev.map(v => v.id === id ? { ...v, status: 'Resuelta' } : v));
    } else if (type === 'ban') {
      setViolations(prev => prev.map(v => v.id === id ? { ...v, status: 'Prohibida' } : v));
    }
  };

  if (!isLoggedIn) {
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
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/40">
              <ShieldCheck className="text-white" size={40} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Sistema de Cumplimiento</h1>
            <p className="text-slate-400 text-sm">Ingrese sus credenciales para acceder al panel de seguridad</p>
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
              <p className="text-red-400 text-xs text-center font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600 tracking-[0.2em]">Ciberseguridad & Ciencia de Datos</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 glass-sidebar hidden lg:flex flex-col p-6 fixed h-full z-40">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Sistema de cumplimiento de Políticas</h1>
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
              <p className="text-[10px] text-slate-500">Security Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {activeView === 'dashboard' && <LayoutDashboard className="text-blue-400" size={24} />}
              {activeView === 'scanner' && <ScanSearch className="text-blue-400" size={24} />}
              {activeView === 'policies' && <ShieldAlert className="text-blue-400" size={24} />}
              {activeView === 'settings' && <Settings className="text-blue-400" size={24} />}
              {activeView === 'details' && <FileCode className="text-blue-400" size={24} />}
              <h2 className="text-2xl font-bold text-white">
                {activeView === 'dashboard' ? 'Tablero' :
                  activeView === 'scanner' ? 'Escáner' :
                    activeView === 'policies' ? 'Políticas' :
                      activeView === 'settings' ? 'Configuración' :
                        activeView === 'details' ? 'Detalles del Análisis' : activeView}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('policies')}
              className={`p-2 glass-card rounded-xl transition-colors ${activeView === 'policies' ? 'text-blue-400 border-blue-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              <ShieldAlert size={18} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Centered Filter Bar */}
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
                      <span className="text-xs font-bold tracking-widest hidden sm:block">
                        Filtros
                      </span>
                    </button>
                  </div>

                  {/* Advanced Filters Popover */}
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
                              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none appearance-none"
                            >
                              <option value="Todos" className="bg-slate-800 text-white">Todos</option>
                              <option value="2026" className="bg-slate-800 text-white">2026</option>
                              <option value="2025" className="bg-slate-800 text-white">2025</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 tracking-widest">Mes</label>
                            <select
                              value={filters.month}
                              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none appearance-none"
                            >
                              <option value="Todos" className="bg-slate-800 text-white">Todos</option>
                              <option value="Enero" className="bg-slate-800 text-white">Enero</option>
                              <option value="Febrero" className="bg-slate-800 text-white">Febrero</option>
                              <option value="Diciembre" className="bg-slate-800 text-white">Diciembre</option>
                              <option value="Noviembre" className="bg-slate-800 text-white">Noviembre</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 tracking-widest">Riesgo</label>
                            <select
                              value={filters.risk}
                              onChange={(e) => setFilters({ ...filters, risk: e.target.value })}
                              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none appearance-none"
                            >
                              <option value="Todos" className="bg-slate-800 text-white">Todos</option>
                              <option value="Crítico" className="bg-slate-800 text-white">Crítico</option>
                              <option value="Alto" className="bg-slate-800 text-white">Alto</option>
                              <option value="Medio" className="bg-slate-800 text-white">Medio</option>
                              <option value="Bajo" className="bg-slate-800 text-white">Bajo</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 tracking-widest">Política</label>
                            <select
                              value={filters.policy}
                              onChange={(e) => setFilters({ ...filters, policy: e.target.value })}
                              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none appearance-none"
                            >
                              <option value="Todas" className="bg-slate-800 text-white">Todas</option>
                              {POLICIES.map(p => <option key={p.name} value={p.name} className="bg-slate-800 text-white">{p.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 tracking-widest">Estado</label>
                            <select
                              value={filters.status}
                              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none appearance-none"
                            >
                              <option value="Todos" className="bg-slate-800 text-white">Todos</option>
                              <option value="Marcada" className="bg-slate-800 text-white">Marcada</option>
                              <option value="En Revisión" className="bg-slate-800 text-white">En Revisión</option>
                              <option value="Resuelta" className="bg-slate-800 text-white">Resuelta</option>
                              <option value="Prohibida" className="bg-slate-800 text-white">Prohibida</option>
                              <option value="Apelación" className="bg-slate-800 text-white">Apelación</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 tracking-widest">Área Temática</label>
                            <select
                              value={filters.area}
                              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none appearance-none"
                            >
                              <option value="Todas" className="bg-slate-800 text-white">Todas</option>
                              <option value="Generación de Contenido" className="bg-slate-800 text-white">Generación de Contenido</option>
                              <option value="Comunicación" className="bg-slate-800 text-white">Comunicación</option>
                              <option value="Herramientas de Datos" className="bg-slate-800 text-white">Herramientas de Datos</option>
                              <option value="Redes Sociales" className="bg-slate-800 text-white">Redes Sociales</option>
                              <option value="Multimedia" className="bg-slate-800 text-white">Multimedia</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                          <button
                            onClick={() => {
                              const reset = { year: 'Todos', month: 'Todos', risk: 'Todos', policy: 'Todas', area: 'Todas', status: 'Todos' };
                              setFilters(reset);
                              setAppliedFilters(reset);
                              setIsFilterOpen(false);
                            }}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-bold tracking-widest transition-all"
                          >
                            Limpiar Filtros
                          </button>
                          <button
                            onClick={() => {
                              setAppliedFilters({ ...filters });
                              setIsFilterOpen(false);
                            }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-widest transition-all shadow-lg shadow-blue-600/20"
                          >
                            Aplicar Filtros
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Filters Display */}
                  {(showCriticalOnly || Object.values(appliedFilters).some(v => v !== 'Todos' && v !== 'Todas')) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2 justify-center"
                    >
                      {showCriticalOnly && (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold flex items-center gap-2">
                          Solo Críticos
                          <button onClick={() => setShowCriticalOnly(false)} className="hover:text-white">×</button>
                        </span>
                      )}
                      {Object.entries(appliedFilters).map(([key, value]) => value !== 'Todos' && value !== 'Todas' && (
                        <span key={key} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-bold flex items-center gap-2">
                          {value}
                          <button onClick={() => {
                            const newFilters = { ...appliedFilters, [key]: key === 'policy' || key === 'area' ? 'Todas' : 'Todos' };
                            setFilters(newFilters);
                            setAppliedFilters(newFilters);
                          }} className="hover:text-white">×</button>
                        </span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Apps Analizadas', value: filteredViolations.length.toLocaleString(), icon: <Search className="text-blue-400" />, color: 'blue', trend: '+12.5%', trendUp: true, description: 'Total de aplicaciones que coinciden con los filtros actuales.' },
                  { label: 'Violaciones Críticas', value: filteredViolations.filter(v => v.risk === 'Crítico' || v.risk === 'Alto').length.toLocaleString(), icon: <ShieldAlert className="text-red-400" />, color: 'red', trend: '+4.3%', trendUp: false, description: 'Casos de alto riesgo detectados en el set actual.' },
                  { label: 'Casos Resueltos', value: filteredViolations.filter(v => v.status === 'Resuelta').length.toLocaleString(), icon: <CheckCircle className="text-emerald-400" />, color: 'emerald', trend: '+18.2%', trendUp: true, description: 'Incidentes mitigados exitosamente en esta vista.' },
                  { label: 'Tiempo de Respuesta', value: '2.4h', icon: <Clock className="text-amber-400" />, color: 'amber', trend: '-15%', trendUp: true, description: 'Promedio de tiempo para la primera acción sobre un reporte.' },
                ].map((stat) => (
                  <div key={stat.label} className="group relative">
                    <div className="glass-card p-6 rounded-2xl transition-all duration-300 hover:border-blue-500/30">
                      <div className="flex justify-between items-center mb-4">
                        <div className={`p-2 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                          {stat.icon}
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {stat.trend}
                        </div>
                      </div>
                      <p className="text-slate-500 text-lg font-bold mb-2">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute inset-0 bg-slate-900/95 p-6 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                      <p className="text-xs text-slate-300 text-center leading-relaxed">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Activity className="text-blue-400" size={18} />
                      <h3 className="text-sm font-bold text-white tracking-wide">Actividad</h3>
                    </div>
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
                        <XAxis
                          dataKey="name"
                          stroke="#64748b"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '12px', color: '#1e293b' }}
                          itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="violaciones"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorViolaciones)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChartIcon className="text-amber-400" size={18} />
                    <h3 className="text-sm font-bold text-white tracking-wide">Distribución de Riesgo</h3>
                  </div>
                  <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={filteredRiskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {filteredRiskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '12px', color: '#1e293b' }}
                          itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-white">{filteredViolations.length}</span>
                      <span className="text-xs text-slate-500 text-center">Casos Filtrados</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {filteredRiskData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-slate-400">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Summary & Actions */}
              <div className="flex flex-col gap-6 mb-8">
                <div className="w-full">
                  <AnimatePresence>
                    {aiSummary && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-6 rounded-2xl border-blue-500/20 relative overflow-hidden group mb-6"
                      >
                        <div className="flex items-center gap-2 mb-3 text-blue-400">
                          <Sparkles size={18} />
                          <h2 className="font-bold tracking-wider text-xs">Reporte de Insight IA</h2>
                          <button onClick={() => setAiSummary(null)} className="ml-auto text-slate-600 hover:text-slate-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed italic">"{aiSummary}"</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Table Section */}
                  <div className="glass-card rounded-3xl overflow-hidden w-full">
                    <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Activity className="text-blue-400" size={18} />
                        <h3 className="text-sm font-bold text-white tracking-wide">Resultados del Análisis</h3>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => setShowCriticalOnly(!showCriticalOnly)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${showCriticalOnly
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                            : 'glass-card text-slate-400 hover:text-white'
                            }`}
                        >
                          <ShieldAlert size={14} />
                          Críticos
                        </button>
                        <button
                          onClick={generateAiSummary}
                          disabled={isGenerating}
                          className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-xs font-medium text-blue-400 hover:text-blue-300 transition-all disabled:opacity-50"
                        >
                          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          Resumir
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-slate-500 text-xs tracking-widest">
                          <tr>
                            <th className="px-6 py-4 font-bold">Aplicación</th>
                            <th className="px-6 py-4 font-bold">Política</th>
                            <th className="px-6 py-4 font-bold">Estado</th>
                            <th className="px-6 py-4 font-bold">Riesgo</th>
                            <th className="px-6 py-4 font-bold text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredViolations.map((item) => (
                            <motion.tr
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={item.id}
                              className="hover:bg-white/5 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <div className="font-bold text-white text-base">{item.name}</div>
                                <div className="text-xs text-slate-500 font-mono mt-1">{item.id} • {item.date}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-slate-400 block max-w-[200px] truncate">{item.policy}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight border ${item.status === 'Prohibida' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                  item.status === 'Resuelta' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    item.status === 'Apelación' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className={`h-1.5 w-1.5 rounded-full ${item.risk === 'Crítico' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                    item.risk === 'Alto' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' :
                                      'bg-amber-400'
                                    }`} />
                                  <span className="text-xs font-medium text-slate-300">{item.risk}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <ActionMenu onAction={(type) => handleAction(item.id, type)} />
                              </td>
                            </motion.tr>
                          ))}
                          {filteredViolations.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm italic">
                                No se encontraron registros que coincidan con los filtros.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeView === 'scanner' ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-[1400px] mx-auto"
            >
              <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />

                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                    <ScanSearch className="text-blue-400" size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Escáner de Cumplimiento</h2>
                  <p className="text-slate-400 max-w-md mx-auto">Inserta la URL del proyecto o documentación para realizar una auditoría profunda de seguridad y políticas.</p>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                      {selectedFile ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-xl"
                        >
                          <File size={14} className="text-blue-400" />
                          <span className="text-xs text-blue-400 font-bold max-w-[150px] truncate">{selectedFile.name}</span>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="text-blue-400 hover:text-white ml-1 text-lg leading-none"
                          >
                            ×
                          </button>
                        </motion.div>
                      ) : (
                        <ScanSearch className="text-slate-500" size={18} />
                      )}
                    </div>
                    <input
                      type="text"
                      value={scanUrl}
                      onChange={(e) => {
                        setScanUrl(e.target.value);
                        if (e.target.value) setSelectedFile(null);
                      }}
                      placeholder={
                        selectedFile ? "" :
                          scanModes.includes('Análisis de Código') ? "https://github.com/usuario/notebook.ipynb o repo" :
                            scanModes.length === 0 ? "https://github.com/usuario/proyecto-ia (Análisis Profundo)" :
                              "https://github.com/usuario/proyecto-ia"
                      }
                      className={`w-full glass-input rounded-2xl py-4 text-sm text-white placeholder:text-slate-600 pr-48 transition-all ${selectedFile ? 'pl-[180px]' : 'pl-12'}`}
                      disabled={isScanning}
                    />
                    <div className="absolute right-2 top-2 bottom-2 flex gap-2">
                      <button
                        onClick={handleResetScanner}
                        title="Restablecer escáner"
                        className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setScanUrl('');
                          }
                        }}
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center gap-2 px-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl cursor-pointer transition-all border border-white/5"
                      >
                        <Upload size={16} />
                        <span className="text-xs font-bold hidden sm:block">Subir</span>
                      </label>
                      <button
                        onClick={() => {
                          setScanResult(null);
                          startScan();
                        }}
                        disabled={isScanning || (!scanUrl && !selectedFile)}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl font-bold text-base transition-all flex items-center gap-3 shadow-lg shadow-blue-600/20"
                      >
                        {isScanning ? <Loader2 className="animate-spin" size={20} /> : <Terminal size={20} />}
                        {isScanning ? 'Analizando...' : 'Analizar'}
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

                {scanResult && !isScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{scanResult.appName}</h3>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold border border-red-500/20 uppercase tracking-wider">
                              {scanResult.classification}
                            </span>
                            <span className="text-sm text-slate-500">Auditoría de Arquitectura v2.0 • {new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              alert('Generando reporte PDF... Por favor espere.');
                              setTimeout(() => window.print(), 1000);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
                          >
                            <Download size={18} />
                            Exportar PDF
                          </button>
                        </div>
                      </div>

                      {/* Score cards removed by user request for better experience */}

                      <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/10 mb-8">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                          <Sparkles size={16} className="text-blue-400" />
                          Resumen Ejecutivo del Experto
                        </h4>
                        <p className="text-base text-slate-300 leading-relaxed italic">
                          "{scanResult.description}"
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Hallazgos Detallados por Archivo</h4>
                        <div className="overflow-hidden rounded-2xl border border-white/5">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 text-slate-500 text-xs tracking-widest">
                              <tr>
                                <th className="px-6 py-4 font-bold">Archivo y Lenguaje</th>
                                <th className="px-6 py-4 font-bold">Política / Riesgo</th>
                                <th className="px-6 py-4 font-bold">Estado</th>
                                <th className="px-6 py-4 font-bold text-right">Acción</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {scanResult.findings?.map((f: any, i: number) => (
                                <ScannerFindingRow key={i} finding={f} />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(isScanning || scanLogs.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {isScanning && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold tracking-widest text-blue-400">
                          <span>Progreso del Análisis</span>
                          <span>{Math.round(scanProgress)}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${scanProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="glass-card bg-black/40 rounded-2xl p-6 font-mono text-sm h-64 overflow-y-auto border-white/5">
                      <div className="flex items-center gap-2 text-emerald-400 mb-4">
                        <Terminal size={14} />
                        <span className="font-bold">Security Engine v2.4.0</span>
                      </div>
                      <div className="space-y-1">
                        {scanLogs.map((log, i) => (
                          <div key={i} className={log.startsWith('❌') ? 'text-red-400' : log.includes('[!]') ? 'text-amber-400' : 'text-slate-400'}>
                            <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            {log}
                          </div>
                        ))}
                        {isScanning && (
                          <div className="flex items-center gap-2 text-blue-400 mt-2">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Procesando: {currentFile}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isScanning && !scanLogs.length && (
                  <div className="hidden">
                    {/* Placeholder for old buttons location */}
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeView === 'policies' ? (
            <motion.div
              key="policies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <ShieldAlert className="text-blue-400" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Políticas de Seguridad</h2>
                <p className="text-slate-400 max-w-md mx-auto">Marco normativo y directrices para el desarrollo seguro de aplicaciones con IA.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {POLICIES.map((policy, i) => (
                  <div key={i} className="glass-card p-6 rounded-3xl border-white/5 hover:border-blue-500/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{policy.name}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{policy.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 glass-card p-8 rounded-[2.5rem] bg-emerald-600/5 border-emerald-500/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Estándares de Google AI Studio</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Nuestras políticas están alineadas con las directrices de seguridad de Google AI Studio, garantizando que las aplicaciones construidas con modelos de lenguaje sean seguras, éticas y respeten la privacidad del usuario.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Monitoreo en tiempo real
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Filtrado de contenido sensible
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Protección de datos PII
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Auditoría de sesgos algorítmicos
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeView === 'settings' ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="glass-card p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                  <User size={20} className="text-blue-400" />
                  Perfil de Usuario
                </h3>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-blue-500/30 flex items-center justify-center relative group">
                    <User size={48} className="text-slate-600" />
                    <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white">Cambiar</button>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Admin User</h4>
                    <p className="text-base text-slate-500">security-lead@policyguard.ai</p>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 tracking-widest">Administrador</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 tracking-widest uppercase">Nombre Completo</label>
                    <input type="text" defaultValue="Admin User" className="w-full glass-input rounded-xl px-4 py-4 text-base text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 tracking-widest uppercase">Correo Electrónico</label>
                    <input type="email" defaultValue="security-lead@policyguard.ai" className="w-full glass-input rounded-xl px-4 py-4 text-base text-white" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                  <Settings size={20} className="text-blue-400" />
                  Preferencias del Sistema
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <h4 className="text-base font-bold text-white">Tema Oscuro</h4>
                      <p className="text-sm text-slate-500">Cambiar entre modo claro y oscuro.</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <h4 className="text-base font-bold text-white">Notificaciones de Escritorio</h4>
                      <p className="text-sm text-slate-500">Recibir alertas críticas en tiempo real.</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-700 rounded-full relative p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div>
                      <h4 className="text-base font-bold text-white">Idioma</h4>
                      <p className="text-sm text-slate-500">Seleccionar el idioma de la interfaz.</p>
                    </div>
                    <select className="bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none">
                      <option>Español</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button className="px-6 py-3 glass-card rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all">Cancelar</button>
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20">Guardar Cambios</button>
              </div>
            </motion.div>
          ) : activeView === 'details' && selectedViolation ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto"
            >
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors mb-6 group"
              >
                <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold tracking-widest">Volver al Tablero</span>
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card p-8 rounded-[2.5rem]">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedViolation.name}</h2>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                          <span>{selectedViolation.id}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span>Detectado el {selectedViolation.date}</span>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest border ${selectedViolation.status === 'Prohibida' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        selectedViolation.status === 'Resuelta' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                        {selectedViolation.status}
                      </span>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xs font-bold text-slate-500 tracking-widest mb-4">Política vulnerada</h3>
                        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                          <div className="flex items-start gap-4 mb-4">
                            <AlertTriangle className="text-amber-400 mt-1" size={24} />
                            <div>
                              <p className="text-lg font-bold text-white mb-1">{selectedViolation.policy}</p>
                              <p className="text-sm text-slate-400 leading-relaxed">
                                {POLICIES.find(p => p.name === selectedViolation.policy)?.description || "Descripción detallada de la política no disponible en el registro actual."}
                              </p>
                            </div>
                          </div>
                          <div className="h-px bg-white/5 my-4" />
                          <div>
                            <p className="text-xs font-bold text-slate-500 tracking-widest mb-2">Argumentación del incumplimiento</p>
                            <p className="text-sm text-slate-300 leading-relaxed italic">
                              "{selectedViolation.details.explanation}"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-500 tracking-widest mb-4">Evidencia en código fuente</h3>
                        <div className="glass-card bg-black/40 rounded-2xl overflow-hidden border-white/5">
                          <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileCode size={14} className="text-blue-400" />
                              <span className="text-[10px] font-mono text-slate-400">{selectedViolation.details.location}</span>
                            </div>
                            <button className="text-[10px] text-slate-500 hover:text-white transition-colors">Copiar</button>
                          </div>
                          <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto">
                            <pre className="text-emerald-400">
                              <code>{selectedViolation.details.snippet}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-3xl">
                    <h3 className="text-sm font-bold text-white mb-6">Acciones de Respuesta</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAction(selectedViolation.id, 'resolve')}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} /> Resolver Caso
                      </button>
                      <button
                        onClick={() => handleAction(selectedViolation.id, 'ban')}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Ban size={16} /> Prohibir Aplicación
                      </button>
                      <button className="w-full py-3 glass-card text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                        <Clock size={16} /> Solicitar Más Info
                      </button>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-3xl border-blue-500/20">
                    <h3 className="text-sm font-bold text-white mb-4">Nivel de Riesgo</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedViolation.risk === 'Crítico' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">{selectedViolation.risk}</p>
                        <p className="text-[10px] text-slate-500 tracking-widest">Prioridad de Atención</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${selectedViolation.risk === 'Crítico' ? 'w-full bg-red-500' : 'w-3/4 bg-orange-500'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-600">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Módulo en Desarrollo</h3>
              <p className="text-slate-500 max-w-xs">Esta sección estará disponible en la próxima actualización del sistema de gobernanza.</p>
              <button
                onClick={() => setActiveView('dashboard')}
                className="mt-6 text-blue-400 text-sm font-bold hover:underline"
              >
                Volver al Tablero
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Nav Overlay (Simplified) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 glass-card rounded-2xl p-2 flex justify-around z-50 shadow-2xl border-white/10">
        <button onClick={() => setActiveView('dashboard')} className={`p-3 rounded-xl ${activeView === 'dashboard' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500'}`}>
          <LayoutDashboard size={20} />
        </button>
        <button onClick={() => setActiveView('scanner')} className={`p-3 rounded-xl ${activeView === 'scanner' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500'}`}>
          <ScanSearch size={20} />
        </button>
        <button onClick={() => setActiveView('policies')} className={`p-3 rounded-xl ${activeView === 'policies' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500'}`}>
          <ShieldAlert size={20} />
        </button>
        <button onClick={() => setActiveView('settings')} className={`p-3 rounded-xl ${activeView === 'settings' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500'}`}>
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return <ComplianceDashboard />;
}
