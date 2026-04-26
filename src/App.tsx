import { useState, lazy, Suspense, useMemo, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Modal from './components/Modal';
import TransactionForm from './components/TransactionForm';
import TransferForm from './components/TransferForm';
import DebtForm from './components/DebtForm';
import InstallPrompt from './components/InstallPrompt';
import Onboarding from './components/Onboarding';
import ToastContainer from './components/Toast';
import { useSmartNotifications } from './hooks/useSmartNotifications';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { useStore } from './store';
import { translations } from './translations';
import { ArrowLeftRight, TrendingUp, TrendingDown, Coins, Receipt, Home, CreditCard, Calendar, BarChart2, Plus, Settings } from 'lucide-react';
import { AddTransactionContext } from './contexts/AddTransactionContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Accounts = lazy(() => import('./pages/Accounts'));
const CalendarPage = lazy(() => import('./pages/Calendar'));
const Statistics = lazy(() => import('./pages/Statistics'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const Widgets = lazy(() => import('./pages/Widgets'));
const Pricing = lazy(() => import('./pages/Pricing'));
const UserAgreement = lazy(() => import('./pages/UserAgreement'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const PaymentReturn = lazy(() => import('./pages/PaymentReturn'));
const Seed = lazy(() => import('./pages/Seed'));
const ScreenshotFrame = lazy(() => import('./pages/ScreenshotFrame'));

type AddMode = 'expense' | 'income' | 'transfer';
type EntityType = 'transaction' | 'debt';

export default function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [entityType, setEntityType] = useState<EntityType>('transaction');
  const [addMode, setAddMode] = useState<AddMode>('expense');
  const [initialDate, setInitialDate] = useState<string | undefined>();
  const language = useStore((s) => s.language);
  const t = translations[language];
  const onboardingCompleted = useStore((s) => s.onboardingCompleted);

  const openAdd = useCallback((mode: AddMode = 'expense', date?: string) => {
    setEntityType('transaction');
    setAddMode(mode);
    setInitialDate(date);
    setShowAdd(true);
  }, []);

  const TABS = useMemo<{ mode: AddMode; label: string; icon: React.ReactNode; color: string }[]>(() => [
    { mode: 'expense', label: t.addExpense, icon: <TrendingDown size={14} />, color: '#EF4444' },
    { mode: 'income', label: t.addIncome, icon: <TrendingUp size={14} />, color: '#10B981' },
    { mode: 'transfer', label: language === 'ru' ? 'Перевод' : 'Transfer', icon: <ArrowLeftRight size={14} />, color: '#3B82F6' },
  ], [language, t]);

  const ENTITY_TABS = useMemo<{ type: EntityType; label: string; icon: React.ReactNode }[]>(() => [
    { type: 'transaction', label: language === 'ru' ? 'Операция' : 'Transaction', icon: <Receipt size={14} /> },
    { type: 'debt', label: language === 'ru' ? 'Долг' : 'Debt', icon: <Coins size={14} /> },
  ], [language]);

  const { toasts, dismissToast } = useSmartNotifications();
  useSupabaseSync();

  if (!onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <BrowserRouter>
      <AddTransactionContext.Provider value={{ openAdd }}>
        <AppShell openAdd={openAdd} showAdd={showAdd} setShowAdd={setShowAdd} entityType={entityType} setEntityType={setEntityType} addMode={addMode} setAddMode={setAddMode} initialDate={initialDate} TABS={TABS} ENTITY_TABS={ENTITY_TABS} language={language} t={t} toasts={toasts} dismissToast={dismissToast}>
          <Suspense fallback={<div style={{ height: '100vh', background: '#07070F' }} />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/widgets" element={<Widgets />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/legal" element={<UserAgreement />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/payment-return" element={<PaymentReturn />} />
              <Route path="/seed" element={<Seed />} />
              <Route path="/screenshot-frame" element={<ScreenshotFrame />} />
            </Routes>
          </Suspense>
        </AppShell>
      </AddTransactionContext.Provider>
    </BrowserRouter>
  );
}

type AppShellProps = {
  children: React.ReactNode;
  openAdd: (mode: 'expense' | 'income' | 'transfer', date?: string) => void;
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  entityType: EntityType;
  setEntityType: (v: EntityType) => void;
  addMode: AddMode;
  setAddMode: (v: AddMode) => void;
  initialDate?: string;
  TABS: { mode: AddMode; label: string; icon: React.ReactNode; color: string }[];
  ENTITY_TABS: { type: EntityType; label: string; icon: React.ReactNode }[];
  language: string;
  t: any;
  toasts: any[];
  dismissToast: (id: string) => void;
};

function AppShell({ children, openAdd, showAdd, setShowAdd, entityType, setEntityType, addMode, setAddMode, initialDate, TABS, ENTITY_TABS, language, t, toasts, dismissToast }: AppShellProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      document.body.classList.toggle('mobile-mode', !desktop);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: t.home },
    { path: '/accounts', icon: CreditCard, label: t.accounts },
    { path: '/calendar', icon: Calendar, label: t.calendar },
    { path: '/statistics', icon: BarChart2, label: t.statistics },
    { path: '/settings', icon: Settings, label: t.settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <InstallPrompt />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className={isDesktop ? 'app-shell-desktop' : 'app-shell-mobile'}>
        {isDesktop && (
          <DesktopSidebar navItems={navItems} isActive={isActive} onNavigate={navigate} />
        )}

        <main className={isDesktop ? 'app-main-desktop' : 'app-main-mobile'}>
          {isDesktop ? <div className="desktop-page-container">{children}</div> : children}
        </main>

        {!isDesktop && (
          <BottomNav onAddTransaction={() => openAdd('expense')} />
        )}
      </div>

      {isDesktop && (
        <button
          className="desktop-fab"
          onClick={() => openAdd('expense')}
        >
          <Plus size={24} />
        </button>
      )}

      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title=" "
        fullHeight
      >
        <div className="px-5 -mt-2 mb-3">
          <div className="flex rounded-2xl p-1 gap-1" style={{ background: '#0A0A1C' }}>
            {ENTITY_TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setEntityType(tab.type)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all active-scale"
                style={{
                  background: entityType === tab.type
                    ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
                    : 'transparent',
                  color: entityType === tab.type ? 'white' : '#64748B',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {entityType === 'debt' ? (
          <DebtForm onClose={() => setShowAdd(false)} />
        ) : (
          <>
            <div className="px-5 mb-4">
              <div className="flex rounded-2xl p-1 gap-1" style={{ background: '#131325' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.mode}
                    onClick={() => setAddMode(tab.mode)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all active-scale"
                    style={{
                      background: addMode === tab.mode ? tab.color : 'transparent',
                      color: addMode === tab.mode ? 'white' : '#64748B',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {addMode === 'transfer' ? (
              <TransferForm onClose={() => setShowAdd(false)} />
            ) : (
              <TransactionForm
                key={addMode + (initialDate ?? '')}
                initialType={addMode as 'income' | 'expense'}
                initialDate={initialDate}
                onClose={() => setShowAdd(false)}
              />
            )}
          </>
        )}
      </Modal>
    </>
  );
}

function DesktopSidebar({
  navItems,
  isActive,
  onNavigate,
}: {
  navItems: { path: string; icon: any; label: string }[];
  isActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
}) {
  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/icon-512.png" alt="FinCalendar" width="36" height="36" style={{ borderRadius: 10, objectFit: 'cover' }} />
          <span>FinCalendar</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
