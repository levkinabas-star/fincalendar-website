import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Globe, Monitor } from 'lucide-react';
import { useStore } from '../store';
import { translations } from '../translations';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const language = useStore((s) => s.language);
  const t = translations[language];
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS or desktop - show instructions
      if (isMobile) {
        setShowIOSModal(true);
      }
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  useEffect(() => {
    if (localStorage.getItem('installPromptDismissed') === 'true') {
      setDismissed(true);
    }
  }, []);

  if (installed || dismissed) return null;

  const installTitle = language === 'ru' ? 'Установить приложение' : 'Install App';
  const installDesc = isMobile
    ? (language === 'ru' ? 'Добавить на главный экран' : 'Add to home screen')
    : (language === 'ru' ? 'Открыть как приложение' : 'Open as app');

  return (
    <>
      <div
        className="fixed top-4 left-4 right-4 z-50 rounded-2xl p-4 flex items-center gap-3 animate-slide-down"
        style={{
          background: 'linear-gradient(135deg, #1A2744 0%, #0E1929 100%)',
          border: '1px solid #1E3A5F',
          maxWidth: 440,
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(59,130,246,0.2)' }}
        >
          <Download size={18} color="#3B82F6" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100">{installTitle}</p>
          <p className="text-xs text-slate-400 mt-0.5">{installDesc}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white active-scale"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
          >
            {language === 'ru' ? 'Установить' : 'Install'}
          </button>
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg flex items-center justify-center active-scale"
            style={{ background: '#1E1E38' }}
          >
            <X size={13} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* iOS Installation Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full"
            style={{ background: '#131325', border: '1px solid #1E2A40' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{language === 'ru' ? 'Установка на iPhone' : 'Install on iPhone'}</h3>
              <button onClick={() => setShowIOSModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1E1E38' }}>
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#6366F122' }}>
                  <span className="text-lg">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{language === 'ru' ? 'Откройте Safari' : 'Open Safari'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ru' ? 'Перейдите на app.fincalendar.ru' : 'Go to app.fincalendar.ru'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#6366F122' }}>
                  <span className="text-lg">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{language === 'ru' ? 'Нажмите «Поделиться»' : 'Tap the Share button'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ru' ? 'Кнопка в нижней части экрана' : 'Button at the bottom of the screen'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#6366F122' }}>
                  <span className="text-lg">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{language === 'ru' ? 'Выберите «На главный экран»' : 'Select «Add to Home Screen»'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'ru' ? 'FinCalendar появится как приложение' : 'FinCalendar will appear as an app'}
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://app.fincalendar.ru"
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white text-center block"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}
            >
              {language === 'ru' ? 'Открыть веб-версию' : 'Open web version'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
