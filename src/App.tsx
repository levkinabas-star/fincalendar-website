import { useState, useEffect, useMemo, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  Home, CreditCard, Calendar, BarChart2, Settings, Plus,
  TrendingUp, TrendingDown, X, Menu
} from 'lucide-react';
import './App.css';

// Types
type Currency = 'RUB' | 'USD' | 'EUR';
type TransactionType = 'income' | 'expense' | 'transfer';
type Language = 'ru' | 'en';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  color: string;
  icon: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  categoryId: string;
  description: string;
  date: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  isPreset: boolean;
}

// Store
interface StoreState {
  language: Language;
  defaultCurrency: Currency;
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  onboardingCompleted: boolean;
  setLanguage: (lang: Language) => void;
  setDefaultCurrency: (currency: Currency) => void;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  addCategory: (cat: Omit<Category, 'id' | 'isPreset'>) => void;
  setOnboardingCompleted: () => void;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = { RUB: '₽', USD: '$', EUR: '€' };

const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Продукты', nameEn: 'Food', icon: '🛒', type: 'expense', color: '#10B981', isPreset: true },
  { name: 'Транспорт', nameEn: 'Transport', icon: '🚗', type: 'expense', color: '#3B82F6', isPreset: true },
  { name: 'Развлечения', nameEn: 'Entertainment', icon: '🎬', type: 'expense', color: '#8B5CF6', isPreset: true },
  { name: 'Здоровье', nameEn: 'Health', icon: '💊', type: 'expense', color: '#EF4444', isPreset: true },
  { name: 'Зарплата', nameEn: 'Salary', icon: '💰', type: 'income', color: '#10B981', isPreset: true },
  { name: 'Фриланс', nameEn: 'Freelance', icon: '💻', type: 'income', color: '#6366F1', isPreset: true },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      language: 'ru',
      defaultCurrency: 'RUB',
      accounts: [],
      transactions: [],
      categories: DEFAULT_CATEGORIES.map((c, i) => ({ ...c, id: `cat-${i}` })),
      onboardingCompleted: false,
      setLanguage: (lang) => set({ language: lang }),
      setDefaultCurrency: (currency) => set({ defaultCurrency: currency }),
      addAccount: (account) => set((state) => ({
        accounts: [...state.accounts, { ...account, id: uuidv4(), createdAt: new Date().toISOString() }]
      })),
      addTransaction: (tx) => set((state) => {
        const newTx = { ...tx, id: uuidv4(), createdAt: new Date().toISOString() };
        const updatedAccounts = state.accounts.map(acc => {
          if (acc.id !== tx.accountId) return acc;
          const delta = tx.type === 'income' ? tx.amount : tx.type === 'expense' ? -tx.amount : 0;
          return { ...acc, balance: acc.balance + delta };
        });
        return { transactions: [...state.transactions, newTx], accounts: updatedAccounts };
      }),
      addCategory: (cat) => set((state) => ({
        categories: [...state.categories, { ...cat, id: uuidv4(), isPreset: false }]
      })),
      setOnboardingCompleted: () => set({ onboardingCompleted: true }),
    }),
    { name: 'fincalendar-storage' }
  )
);

// Translations
const t = {
  ru: {
    home: 'Главная', accounts: 'Счета', calendar: 'Календарь',
    statistics: 'Статистика', settings: 'Настройки',
    addExpense: 'Расход', addIncome: 'Доход', add: 'Добавить',
    totalBalance: 'Общий баланс', income: 'Доходы', expense: 'Расходы',
    recentTransactions: 'Последние операции', noTransactions: 'Нет операций',
    accountName: 'Название счёта', balance: 'Баланс', currency: 'Валюта',
    continue: 'Продолжить', welcome: 'Добро пожаловать в FinCalendar',
    welcomeDesc: 'Ваш личный трекер бюджета. Начните с создания счёта.',
    createAccount: 'Создать счёт', addFunds: 'Добавить средства',
    description: 'Описание', amount: 'Сумма', date: 'Дата', category: 'Категория',
    save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Редактировать'
  },
  en: {
    home: 'Home', accounts: 'Accounts', calendar: 'Calendar',
    statistics: 'Statistics', settings: 'Settings',
    addExpense: 'Expense', addIncome: 'Income', add: 'Add',
    totalBalance: 'Total Balance', income: 'Income', expense: 'Expenses',
    recentTransactions: 'Recent Transactions', noTransactions: 'No transactions',
    accountName: 'Account Name', balance: 'Balance', currency: 'Currency',
    continue: 'Continue', welcome: 'Welcome to FinCalendar',
    welcomeDesc: 'Your personal budget tracker. Start by creating an account.',
    createAccount: 'Create Account', addFunds: 'Add Funds',
    description: 'Description', amount: 'Amount', date: 'Date', category: 'Category',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit'
  }
};

// Onboarding
function Onboarding() {
  const { setOnboardingCompleted, addAccount, defaultCurrency } = useStore();
  const [name, setName] = useState('');
  const lang = useStore(s => s.language);
  const tx = t[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAccount({ name: name.trim(), balance: 0, currency: defaultCurrency, color: '#6366F1', icon: '💳' });
    setOnboardingCompleted();
  };

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="onboarding-logo">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="16" fill="url(#grad)" />
            <path d="M16 32C16 23.16 23.16 16 32 16C40.84 16 48 23.16 48 32" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M32 24V32L40 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="32" cy="48" r="4" fill="white"/>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1"/><stop offset="1" stopColor="#4F46E5"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1>{tx.welcome}</h1>
        <p>{tx.welcomeDesc}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={tx.accountName}
            className="onboarding-input"
            autoFocus
          />
          <button type="submit" className="btn-primary" disabled={!name.trim()}>
            {tx.createAccount}
          </button>
        </form>
      </div>
    </div>
  );
}

// Add Transaction Modal
function AddTransactionModal({ isOpen, onClose, initialType = 'expense' }: { isOpen: boolean; onClose: () => void; initialType?: TransactionType }) {
  const { accounts, categories, addTransaction, language } = useStore();
  const tx = t[language];
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredCategories = categories.filter(c => c.type === type || c.type === 'both');

  useEffect(() => {
    if (filteredCategories.length > 0 && !categoryId) setCategoryId(filteredCategories[0].id);
  }, [type, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountId || !categoryId) return;
    addTransaction({
      accountId, type, amount: parseFloat(amount),
      currency: accounts.find(a => a.id === accountId)?.currency || 'RUB',
      categoryId, description, date
    });
    onClose();
    setAmount(''); setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{type === 'expense' ? tx.addExpense : tx.addIncome}</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="type-tabs">
          <button className={type === 'expense' ? 'active' : ''} onClick={() => setType('expense')}>
            <TrendingDown size={16} /> {tx.expense}
          </button>
          <button className={type === 'income' ? 'active' : ''} onClick={() => setType('income')}>
            <TrendingUp size={16} /> {tx.income}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder={tx.amount} className="form-input" autoFocus step="0.01" />
          <input type="text" value={description} onChange={e => setDescription(e.target.value)}
            placeholder={tx.description} className="form-input" />
          <select value={accountId} onChange={e => setAccountId(e.target.value)} className="form-select">
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="form-select">
            {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">{tx.cancel}</button>
            <button type="submit" className="btn-primary">{tx.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Bottom Navigation
function BottomNav({ onAdd }: { onAdd: () => void }) {
  const { language } = useStore();
  const tx = t[language];
  const navItems = [
    { path: '/', icon: Home, label: tx.home },
    { path: '/accounts', icon: CreditCard, label: tx.accounts },
    { path: '/calendar', icon: Calendar, label: tx.calendar },
    { path: '/statistics', icon: BarChart2, label: tx.statistics },
    { path: '/settings', icon: Settings, label: tx.settings },
  ];
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button key={item.path} onClick={() => navigate(item.path)}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
          <item.icon size={20} />
          <span>{item.label}</span>
        </button>
      ))}
      <button onClick={onAdd} className="nav-add">
        <Plus size={24} />
      </button>
    </nav>
  );
}

// Desktop Sidebar
function DesktopSidebar() {
  const { language } = useStore();
  const tx = t[language];
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: tx.home },
    { path: '/accounts', icon: CreditCard, label: tx.accounts },
    { path: '/calendar', icon: Calendar, label: tx.calendar },
    { path: '/statistics', icon: BarChart2, label: tx.statistics },
    { path: '/settings', icon: Settings, label: tx.settings },
  ];

  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-header">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="10" fill="url(#sg)" />
          <path d="M9 18C9 12.5 13.5 8 18 8C22.5 8 27 12.5 27 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M18 13V18L21.5 21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="18" cy="25" r="2.5" fill="white"/>
          <defs><linearGradient id="sg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#4F46E5"/></linearGradient></defs>
        </svg>
        <span>FinCalendar</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}>
            <item.icon size={20} /><span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

// Dashboard Page
function DashboardPage() {
  const { accounts, transactions, categories, language, defaultCurrency } = useStore();
  const tx = t[language];
  const [showAdd, setShowAdd] = useState(false);
  const symbol = CURRENCY_SYMBOLS[defaultCurrency];

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const recentTx = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{tx.home}</h1>
      </div>
      <div className="balance-card">
        <span className="balance-label">{tx.totalBalance}</span>
        <span className="balance-value">{symbol} {totalBalance.toLocaleString()}</span>
        <div className="balance-row">
          <div className="balance-mini income">
            <TrendingUp size={16} /><span>{tx.income}</span><strong>+{symbol}{totalIncome.toLocaleString()}</strong>
          </div>
          <div className="balance-mini expense">
            <TrendingDown size={16} /><span>{tx.expense}</span><strong>-{symbol}{totalExpense.toLocaleString()}</strong>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-header">
          <h2>{tx.recentTransactions}</h2>
        </div>
        {recentTx.length === 0 ? (
          <p className="empty-state">{tx.noTransactions}</p>
        ) : (
          <div className="transactions-list">
            {recentTx.map(t => {
              const cat = getCategory(t.categoryId);
              return (
                <div key={t.id} className="transaction-item">
                  <div className="tx-icon">{cat?.icon || '💳'}</div>
                  <div className="tx-info">
                    <span>{t.description || cat?.name}</span>
                    <small>{new Date(t.date).toLocaleDateString()}</small>
                  </div>
                  <span className={`tx-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}{symbol}{t.amount.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AddTransactionModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}

// Accounts Page
function AccountsPage() {
  const { accounts, addAccount, language, defaultCurrency } = useStore();
  const tx = t[language];
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAccount({ name: name.trim(), balance: 0, currency: defaultCurrency, color: '#6366F1', icon: '💳' });
    setName('');
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>{tx.accounts}</h1>
        <button className="btn-primary btn-sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> {tx.add}
        </button>
      </div>
      <div className="accounts-grid">
        {accounts.map(acc => (
          <div key={acc.id} className="account-card" style={{ borderColor: acc.color }}>
            <div className="account-icon">{acc.icon}</div>
            <div className="account-info">
              <span className="account-name">{acc.name}</span>
              <span className="account-balance">{CURRENCY_SYMBOLS[acc.currency]} {acc.balance.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{tx.createAccount}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={tx.accountName} className="form-input" autoFocus />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{tx.cancel}</button>
                <button type="submit" className="btn-primary">{tx.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Calendar Page
function CalendarPage() {
  const { transactions, language } = useStore();
  const tx = t[language];
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const txByDate = useMemo(() => {
    const map: Record<string, typeof transactions> = {};
    transactions.forEach(t => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, [transactions]);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="page">
      <div className="page-header">
        <h1>{tx.calendar}</h1>
        <div className="calendar-nav">
          <button onClick={prevMonth}>&lt;</button>
          <span>{currentMonth.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' })}</span>
          <button onClick={nextMonth}>&gt;</button>
        </div>
      </div>
      <div className="calendar-grid">
        {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="calendar-day empty" />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTx = txByDate[dateStr] || [];
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          return (
            <div key={day} className={`calendar-day ${isToday ? 'today' : ''} ${dayTx.length > 0 ? 'has-events' : ''}`}>
              <span>{day}</span>
              {dayTx.length > 0 && <div className="day-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Statistics Page
function StatisticsPage() {
  const { transactions, categories, language, defaultCurrency } = useStore();
  const tx = t[language];
  const symbol = CURRENCY_SYMBOLS[defaultCurrency];

  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
    });
    return Object.entries(byCategory)
      .map(([catId, amount]) => ({ category: categories.find(c => c.id === catId), amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  const total = stats.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{tx.statistics}</h1>
      </div>
      {stats.length === 0 ? (
        <p className="empty-state">{tx.noTransactions}</p>
      ) : (
        <div className="stats-list">
          {stats.map(s => (
            <div key={s.category?.id} className="stat-item">
              <div className="stat-icon">{s.category?.icon}</div>
              <div className="stat-info">
                <span>{s.category?.name}</span>
                <div className="stat-bar" style={{ width: `${(s.amount / total) * 100}%`, background: s.category?.color }} />
              </div>
              <span className="stat-amount">{symbol}{s.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Page
function SettingsPage() {
  const { language, setLanguage, defaultCurrency, setDefaultCurrency } = useStore();
  const tx = t[language];

  return (
    <div className="page">
      <div className="page-header">
        <h1>{tx.settings}</h1>
      </div>
      <div className="settings-list">
        <div className="setting-item">
          <span>Язык</span>
          <select value={language} onChange={e => setLanguage(e.target.value as Language)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="setting-item">
          <span>{tx.currency}</span>
          <select value={defaultCurrency} onChange={e => setDefaultCurrency(e.target.value as Currency)}>
            <option value="RUB">₽ RUB</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
      </div>
      <div className="app-version">FinCalendar v1.0.0</div>
    </div>
  );
}

// Main App
export default function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const onboardingCompleted = useStore(s => s.onboardingCompleted);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!onboardingCompleted) return <Onboarding />;

  return (
    <BrowserRouter>
      <div className={`app-shell ${isDesktop ? 'desktop' : 'mobile'}`}>
        {isDesktop && <DesktopSidebar />}
        {!isDesktop && (
          <header className="mobile-header">
            <div className="mobile-header-content">
              <span>FinCalendar</span>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={24} />
              </button>
            </div>
          </header>
        )}
        <main className={`app-main ${isDesktop ? 'desktop' : 'mobile'}`}>
          <Suspense fallback={<div className="loading">Загрузка...</div>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </main>
        {!isDesktop && <BottomNav onAdd={() => setShowAdd(true)} />}
        {isDesktop && (
          <button className="desktop-fab" onClick={() => setShowAdd(true)}>
            <Plus size={24} />
          </button>
        )}
        <AddTransactionModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
      </div>
    </BrowserRouter>
  );
}
