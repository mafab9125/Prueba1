import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { LoginForm } from './components/auth/LoginForm';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScannerView } from './components/scanner/ScannerView';
import { ViolationDetails } from './components/dashboard/ViolationDetails';
import { PoliciesView } from './components/policies/PoliciesView';
import { SettingsView } from './components/settings/SettingsView';
import { INITIAL_VIOLATIONS, CHART_DATA, RISK_DATA, POLICIES } from './lib/constants';
import { Violation } from './lib/types';
import { ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [violations, setViolations] = useState<Violation[]>(INITIAL_VIOLATIONS);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  if (!isLoggedIn) {
    return <LoginForm onLogin={setIsLoggedIn} />;
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <Header activeView={activeView} />

        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <DashboardView
              key="dashboard"
              violations={violations}
              setViolations={setViolations}
              chartData={CHART_DATA}
              riskData={RISK_DATA}
              policies={POLICIES}
              onViewDetails={(v) => {
                setSelectedViolation(v);
                setActiveView('details');
              }}
            />
          )}

          {activeView === 'scanner' && (
            <ScannerView
              key="scanner"
              onAddViolations={(newVs) => setViolations(prev => [...newVs, ...prev])}
            />
          )}

          {activeView === 'details' && selectedViolation && (
            <ViolationDetails
              key="details"
              violation={selectedViolation}
              policies={POLICIES}
              onBack={() => setActiveView('dashboard')}
              onAction={(id, type) => {
                if (type === 'resolve') {
                  setViolations(prev => prev.map(v => v.id === id ? { ...v, status: 'Resuelta' } : v));
                  setActiveView('dashboard');
                } else if (type === 'ban') {
                  setViolations(prev => prev.map(v => v.id === id ? { ...v, status: 'Prohibida' } : v));
                  setActiveView('dashboard');
                }
              }}
            />
          )}

          {activeView === 'policies' && (
            <PoliciesView
              key="policies"
              policies={POLICIES}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView key="settings" />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
