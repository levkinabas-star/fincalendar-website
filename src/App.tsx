import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Monitor, Download, ArrowRight, CheckCircle, Wallet,
  Calendar, TrendingUp, Shield, Bell, PieChart, Repeat,
  ChevronDown, X, Menu
} from 'lucide-react';
import './App.css';

const APK_URL = 'https://github.com/fincalendar/budget-tracker/releases/download/v1.0.0/BudgetTracker-release.apk';

const features = [
  { icon: <Wallet size={28} />, title: 'Счета и баланс', desc: 'Управляйте несколькими счетами в разных валютах' },
  { icon: <TrendingUp size={28} />, title: 'Доходы и расходы', desc: 'Отслеживайте каждую транзакцию с детальной статистикой' },
  { icon: <Calendar size={28} />, title: 'Календарь', desc: 'Планируйте расходы и не забудьте о важных датах' },
  { icon: <PieChart size={28} />, title: 'Статистика', desc: 'Визуальные графики помогут понять структуру расходов' },
  { icon: <Repeat size={28} />, title: 'Автоплатежи', desc: 'Настройте повторяющиеся платежи и никогда не забывайте' },
  { icon: <Bell size={28} />, title: 'Умные уведомления', desc: 'Получайте напоминания о предстоящих и просроченных платежах' },
  { icon: <Shield size={28} />, title: 'Приватность', desc: 'Все данные хранятся локально на вашем устройстве' },
  { icon: <Smartphone size={28} />, title: 'Виджет', desc: 'Держите баланс под рукой с домашнего экрана' },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIphoneModal, setShowIphoneModal] = useState(false);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      document.body.classList.add('mobile-device');
    }
  }, []);

  const scrollToDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />

      <main>
        <Hero onGetApp={scrollToDownload} />

        <FeaturesSection />

        <ScreenshotsSection />

        <DownloadSection onShowIphone={() => setShowIphoneModal(true)} />

        <DesktopSection />

        <Footer />
      </main>

      <AnimatePresence>
        {showIphoneModal && (
          <IphoneModal onClose={() => setShowIphoneModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({ onMenuToggle, mobileMenuOpen }: { onMenuToggle: () => void; mobileMenuOpen: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#grad)" />
            <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 12V16L19 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="22" r="2" fill="white" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </svg>
          <span>FinCalendar</span>
        </div>

        <nav className="desktop-nav">
          <a href="#features">Возможности</a>
          <a href="#screenshots">Скриншоты</a>
          <a href="#download">Скачать</a>
          <a href="#desktop">ПК версия</a>
        </nav>

        <a href="https://github.com/fincalendar/budget-tracker" target="_blank" rel="noopener" className="github-btn desktop-only">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>GitHub</span>
        </a>

        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <a href="#features" onClick={onMenuToggle}>Возможности</a>
            <a href="#screenshots" onClick={onMenuToggle}>Скриншоты</a>
            <a href="#download" onClick={onMenuToggle}>Скачать</a>
            <a href="#desktop" onClick={onMenuToggle}>ПК версия</a>
            <a href="https://github.com/fincalendar/budget-tracker" target="_blank" rel="noopener">GitHub</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onGetApp }: { onGetApp: () => void }) {
  return (
    <section className="hero-section">
      <div className="hero-bg-gradient" />
      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="badge-dot" />
          Version 1.0.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Ваш личный<br />трекер бюджета
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Счета, расходы, доходы, планирование — всё в одном приложении.
          Доступно для Android, iPhone и ПК.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button className="btn-primary" onClick={onGetApp}>
            <Download size={20} />
            Скачать приложение
          </button>
          <a href="#desktop" className="btn-secondary">
            <Monitor size={20} />
            Открыть в браузере
          </a>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="stat">
            <span className="stat-value">100K+</span>
            <span className="stat-label">Пользователей</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">4.8</span>
            <span className="stat-label">Рейтинг</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Приватность</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero-phone-mockup"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="phone-frame">
          <div className="phone-screen">
            <div className="phone-header">
              <span>FinCalendar</span>
            </div>
            <div className="phone-balance">
              <span>Общий баланс</span>
              <strong>₽ 127 450</strong>
            </div>
            <div className="phone-cards">
              <div className="phone-card green">
                <span>Доходы</span>
                <strong>+₽ 85 000</strong>
              </div>
              <div className="phone-card red">
                <span>Расходы</span>
                <strong>-₽ 42 500</strong>
              </div>
            </div>
            <div className="phone-transactions">
              <div className="phone-tx-header">Последние операции</div>
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="phone-tx">
                  <div className="tx-icon">🛒</div>
                  <div className="tx-info">
                    <span>Продукты</span>
                    <small>Сегодня</small>
                  </div>
                  <strong>-₽ 2 350</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <h2>Всё, что нужно для контроля финансов</h2>
        <p>Мощные функции в простом и понятном интерфейсе</p>
      </div>

      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ScreenshotsSection() {
  return (
    <section id="screenshots" className="screenshots-section">
      <div className="section-header">
        <h2>Скриншоты приложения</h2>
        <p>Посмотрите, как выглядит FinCalendar</p>
      </div>

      <div className="screenshots-showcase">
        <div className="screenshot-phone">
          <div className="screenshot-screen">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=600&fit=crop" alt="Dashboard" />
          </div>
          <span>Главная</span>
        </div>
        <div className="screenshot-phone">
          <div className="screenshot-screen">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=600&fit=crop" alt="Statistics" />
          </div>
          <span>Статистика</span>
        </div>
        <div className="screenshot-phone">
          <div className="screenshot-screen">
            <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&h=600&fit=crop" alt="Calendar" />
          </div>
          <span>Календарь</span>
        </div>
      </div>
    </section>
  );
}

function DownloadSection({ onShowIphone }: { onShowIphone: () => void }) {
  return (
    <section id="download" className="download-section">
      <div className="section-header">
        <h2>Скачать FinCalendar</h2>
        <p>Выберите версию для вашего устройства</p>
      </div>

      <div className="download-cards">
        <motion.div
          className="download-card android"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="download-icon">📱</div>
          <h3>Android</h3>
          <p>Установите APK файл на своё устройство</p>
          <ul className="download-features">
            <li><CheckCircle size={16} /> Виджет на рабочем столе</li>
            <li><CheckCircle size={16} /> Умные уведомления</li>
            <li><CheckCircle size={16} /> Офлайн режим</li>
          </ul>
          <a href={APK_URL} download="FinCalendar-v1.0.0.apk" className="btn-download">
            <Download size={20} />
            Скачать APK (3.9 MB)
          </a>
          <span className="download-note">Android 6.0+</span>
        </motion.div>

        <motion.div
          className="download-card iphone"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="download-icon">🍎</div>
          <h3>iPhone / iPad</h3>
          <p>Установка через TestFlight или PWA</p>
          <ul className="download-features">
            <li><CheckCircle size={16} /> Установка без компьютера</li>
            <li><CheckCircle size={16} /> PWA — как приложение</li>
            <li><CheckCircle size={16} /> Обновления через браузер</li>
          </ul>
          <button onClick={onShowIphone} className="btn-download">
            <Smartphone size={20} />
            Инструкция по установке
          </button>
          <span className="download-note">iOS 14+</span>
        </motion.div>

        <motion.div
          className="download-card web"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="download-icon">💻</div>
          <h3>Веб-версия</h3>
          <p>Используйте прямо в браузере</p>
          <ul className="download-features">
            <li><CheckCircle size={16} /> Работает везде</li>
            <li><CheckCircle size={16} /> Нет установки</li>
            <li><CheckCircle size={16} /> Синхронизация данных</li>
          </ul>
          <a href="https://app.fincalendar.ru" className="btn-download">
            <ArrowRight size={20} />
            Открыть веб-версию
          </a>
          <span className="download-note">Все браузеры</span>
        </motion.div>
      </div>
    </section>
  );
}

function DesktopSection() {
  return (
    <section id="desktop" className="desktop-section">
      <div className="desktop-content">
        <div className="desktop-text">
          <span className="desktop-label">Для ПК</span>
          <h2>Полноценная версия для компьютера</h2>
          <p>
            Откройте FinCalendar в браузере на Windows, Mac или Linux.
            Оптимизированный интерфейс для больших экранов с удобной навигацией.
          </p>
          <ul className="desktop-features">
            <li><CheckCircle size={20} /> Адаптивный интерфейс для широких экранов</li>
            <li><CheckCircle size={20} /> Быстрая навигация с боковым меню</li>
            <li><CheckCircle size={20} /> Все функции мобильной версии</li>
            <li><CheckCircle size={20} /> Горячие клавиши для быстрого доступа</li>
          </ul>
          <a href="https://app.fincalendar.ru" target="_blank" rel="noopener" className="btn-primary">
            <Monitor size={20} />
            Открыть в новой вкладке
          </a>
        </div>
        <motion.div
          className="desktop-mockup"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="browser-frame">
            <div className="browser-header">
              <div className="browser-dots">
                <span /><span /><span />
              </div>
              <div className="browser-url">app.fincalendar.ru</div>
            </div>
            <div className="browser-content">
              <div className="browser-sidebar">
                <div className="sidebar-item active">Главная</div>
                <div className="sidebar-item">Счета</div>
                <div className="sidebar-item">Календарь</div>
                <div className="sidebar-item">Статистика</div>
                <div className="sidebar-item">Настройки</div>
              </div>
              <div className="browser-main">
                <div className="desktop-card-header">Общий баланс</div>
                <div className="desktop-big-num">₽ 127 450</div>
                <div className="desktop-cards-row">
                  <div className="desktop-mini-card green">+₽ 85 000</div>
                  <div className="desktop-mini-card red">-₽ 42 500</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function IphoneModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h2>Установка на iPhone / iPad</h2>
        <p className="modal-subtitle">Для установки FinCalendar на iOS используйте веб-версию (PWA)</p>

        <div className="install-steps">
          <div className="step">
            <span className="step-num">1</span>
            <div>
              <strong>Откройте веб-версию</strong>
              <p>Перейдите на <a href="https://app.fincalendar.ru" target="_blank" rel="noopener">app.fincalendar.ru</a> в Safari</p>
            </div>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <div>
              <strong>Добавьте на главный экран</strong>
              <p>Нажмите кнопку «Поделиться» → «На главный экран»</p>
            </div>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <div>
              <strong>Готово!</strong>
              <p>FinCalendar появится как приложение на вашем Home Screen</p>
            </div>
          </div>
        </div>

        <div className="ios-note">
          <strong>Важно:</strong> Используйте Safari для установки. Chrome и другие браузеры iOS не поддерживают добавление на главный экран.
        </div>

        <a href="https://app.fincalendar.ru" target="_blank" rel="noopener" className="btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
          <ArrowRight size={20} />
          Открыть веб-версию
        </a>
      </motion.div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#grad-footer)" />
              <path d="M8 16C8 11.58 11.58 8 16 8C20.42 8 24 11.58 24 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 12V16L19 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="22" r="2" fill="white" />
              <defs>
                <linearGradient id="grad-footer" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
            <span>FinCalendar</span>
          </div>
          <p>Личный трекер бюджета. Все данные хранятся локально на вашем устройстве.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Приложение</h4>
            <a href="#download">Скачать</a>
            <a href="#features">Возможности</a>
            <a href="#desktop">Веб-версия</a>
          </div>
          <div className="footer-col">
            <h4>Поддержка</h4>
            <a href="mailto:support@fincalendar.ru">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
            <a href="https://github.com/fincalendar/budget-tracker" target="_blank" rel="noopener">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
          <div className="footer-col">
            <h4>Документы</h4>
            <a href="/privacy">Политика конфиденциальности</a>
            <a href="/terms">Пользовательское соглашение</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 FinCalendar. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default App;
