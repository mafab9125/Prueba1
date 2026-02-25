export interface Violation {
    id: string;
    name: string;
    policy: string;
    status: string;
    risk: string;
    date: string;
    year: number;
    month: string;
    area: string;
    details: {
        location: string;
        snippet: string;
        explanation: string;
    };
}

export interface ChartDataItem {
    name: string;
    violaciones: number;
    escaneos: number;
}

export interface RiskDataItem {
    name: string;
    value: number;
    color: string;
}

export interface Policy {
    name: string;
    description: string;
}

export interface ScanFinding {
    file: string;
    policy: string;
    status: string;
    line: number;
    language: string;
    snippet: string;
    analysis: string;
}

export interface ScanResult {
    classification: string;
    architectureScore: number;
    dataSecurityScore: number;
    description: string;
    architectureDetails: any[];
    dataSecurityDetails: any[];
    findings: ScanFinding[];
    appName?: string;
}
