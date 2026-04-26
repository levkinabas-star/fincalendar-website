import { useState } from 'react';
import { Smartphone, Download, CheckCircle, ChevronRight, Apple, Share2, PlusSquare, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

const APK_URL = '/fincalendar.apk';

export default function DownloadPage() {
  const language = useStore((s) => s.language);
  const isRu = language === 'ru';
  const [tab, setTab] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin;

  const copyUrl = () => {
    navigator.clipboard.writeText(siteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const iosSteps = isRu
    ? [
        { icon: '🌐', title: 'Откройте Safari', desc: 'Перейдите по ссылке в браузере Safari на iPhone или iPad. Другие браузеры не поддерживают установку.' },
        { icon: '📤', title: 'Нажмите «Поделиться»', desc: 'Найдите значок Share (квадрат со стрелкой вверх) в нижней панели браузера.' },
        { icon: '📱', title: 'Выберите «На экран «Домой»', desc: 'В меню прокрутите вниз и нажмите «На экран "Домой"» (Add to Home Screen).' },
        { icon: '✅', title: 'Подтвердите установку', desc: 'Нажмите «Добавить» в правом верхнем углу. Значок приложения появится на экране.' },
      ]
    : [
        { icon: '🌐', title: 'Open Safari', desc: 'Navigate to the app URL in Safari on your iPhone or iPad. Other browsers don\'t support installation.' },
        { icon: '📤', title: 'Tap Share button', desc: 'Find the Share icon (square with upward arrow) in the bottom toolbar of Safari.' },
        { icon: '📱', title: 'Select "Add to Home Screen"', desc: 'Scroll down in the menu and tap "Add to Home Screen".' },
        { icon: '✅', title: 'Confirm installation', desc: 'Tap "Add" in the top right corner. The app icon will appear on your home screen.' },
      ];

  const androidSteps = isRu
    ? [
        { text: 'Скачайте APK-файл по кнопке ниже' },
        { text: 'Откройте файл в загрузках' },
        { text: 'Разрешите установку из неизвестных источников (Настройки → Безопасность)' },
        { text: 'Нажмите «Установить» и дождитесь завершения' },
      ]
    : [
        { text: 'Download the APK file using the button below' },
        { text: 'Open the file in your downloads' },
        { text: 'Allow installation from unknown sources (Settings → Security)' },
        { text: 'Tap "Install" and wait for completion' },
      ];

  return (
    <div className="page-enter pb-32 md:pb-10">
      {/* Header */}
      <div className="px-5 md:px-8 pt-6 pb-4 md:pt-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
            <Smartphone size={20} color="white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100">
              {isRu ? 'Установить на телефон' : 'Install on phone'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isRu ? 'FinCalendar всегда под рукой' : 'FinCalendar always at hand'}
            </p>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mx-5 mb-6 md:mx-8">
        <div className="flex rounded-2xl p-1 gap-1" style={{ background: '#0A0A1C' }}>
          <button
            onClick={() => setTab('android')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active-scale"
            style={{
              background: tab === 'android' ? 'linear-gradient(135deg, #3DDC84 0%, #00C853 100%)' : 'transparent',
              color: tab === 'android' ? '#0A0A1C' : '#64748B',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.34l1.23 2.13a.5.5 0 01-.86.5l-1.25-2.16a7.5 7.5 0 01-9.28 0L5.1 17.97a.5.5 0 01-.86-.5l1.23-2.13A7.47 7.47 0 013 9.5h18a7.47 7.47 0 01-3.477 5.84zM8.5 12a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2zM8.05 7.5l-1.5-2.6a.5.5 0 01.87-.5l1.52 2.64a8.5 8.5 0 016.12 0l1.52-2.64a.5.5 0 01.86.5l-1.5 2.6A7.5 7.5 0 018.05 7.5z"/>
            </svg>
            Android
          </button>
          <button
            onClick={() => setTab('ios')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active-scale"
            style={{
              background: tab === 'ios' ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' : 'transparent',
              color: tab === 'ios' ? 'white' : '#64748B',
            }}
          >
            <Apple size={16} />
            iPhone / iPad
          </button>
        </div>
      </div>

      {/* Android content */}
      {tab === 'android' && (
        <div className="mx-5 md:mx-8 space-y-4">
          {/* Download card */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D2818 0%, #0A1F12 100%)', border: '1px solid #3DDC8430' }}>
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3DDC84, transparent)' }} />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#3DDC8420' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#3DDC84">
                  <path d="M17.523 15.34l1.23 2.13a.5.5 0 01-.86.5l-1.25-2.16a7.5 7.5 0 01-9.28 0L5.1 17.97a.5.5 0 01-.86-.5l1.23-2.13A7.47 7.47 0 013 9.5h18a7.47 7.47 0 01-3.477 5.84zM8.5 12a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2zM8.05 7.5l-1.5-2.6a.5.5 0 01.87-.5l1.52 2.64a8.5 8.5 0 016.12 0l1.52-2.64a.5.5 0 01.86.5l-1.5 2.6A7.5 7.5 0 018.05 7.5z"/>
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-white">FinCalendar APK</p>
                <p className="text-sm text-slate-400">{isRu ? 'Для Android 7.0 и выше' : 'For Android 7.0 and above'}</p>
              </div>
            </div>
            <a
              href={APK_URL}
              download="fincalendar.apk"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm active-scale"
              style={{ background: 'linear-gradient(135deg, #3DDC84 0%, #00C853 100%)', color: '#0A0A1C' }}
            >
              <Download size={18} />
              {isRu ? 'Скачать APK' : 'Download APK'}
            </a>
          </div>

          {/* Install instructions */}
          <div className="rounded-2xl p-4" style={{ background: '#0E0E1C', border: '1px solid #1E2A40' }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              {isRu ? 'Инструкция по установке' : 'Installation instructions'}
            </p>
            <div className="space-y-3">
              {androidSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#3DDC8420', color: '#3DDC84', fontSize: 11, fontWeight: 700 }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: '#1C1200', border: '1px solid #F59E0B30' }}>
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 leading-relaxed">
              {isRu
                ? 'Для установки APK-файлов необходимо разрешить установку из неизвестных источников в настройках Android.'
                : 'To install APK files, you need to allow installation from unknown sources in Android settings.'}
            </p>
          </div>
        </div>
      )}

      {/* iOS content */}
      {tab === 'ios' && (
        <div className="mx-5 md:mx-8 space-y-4">
          {/* PWA badge */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A1035 0%, #110D2A 100%)', border: '1px solid #6366F130' }}>
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src="/icon-512.png" alt="FinCalendar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-base font-bold text-white">FinCalendar</p>
                <p className="text-sm text-slate-400">{isRu ? 'Веб-приложение (PWA)' : 'Web App (PWA)'}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-xs text-emerald-400">{isRu ? 'Работает офлайн' : 'Works offline'}</p>
                </div>
              </div>
            </div>

            {/* URL copy */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #2A2A4A' }}>
              <p className="flex-1 text-xs text-slate-400 truncate">{siteUrl}</p>
              <button
                onClick={copyUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium active-scale flex-shrink-0 transition-all"
                style={{
                  background: copied ? '#10B98120' : '#1E1E38',
                  color: copied ? '#10B981' : '#94A3B8',
                  border: `1px solid ${copied ? '#10B98140' : '#2A2A4A'}`,
                }}
              >
                {copied ? <CheckCircle size={12} /> : null}
                {copied ? (isRu ? 'Скопировано' : 'Copied!') : (isRu ? 'Копировать' : 'Copy')}
              </button>
            </div>
          </div>

          {/* Step-by-step */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1E2A40' }}>
            <div className="px-4 py-3" style={{ background: '#0A0A1C', borderBottom: '1px solid #1E2A40' }}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {isRu ? 'Пошаговая инструкция для Safari' : 'Step-by-step for Safari'}
              </p>
            </div>
            {iosSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 px-4 py-4" style={{ background: '#0E0E1C', borderBottom: i < iosSteps.length - 1 ? '1px solid #1E2A40' : 'none' }}>
                <div className="text-2xl flex-shrink-0 w-9 text-center">{step.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 mb-0.5">{step.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: '#6366F120', color: '#6366F1', fontSize: 11, fontWeight: 700 }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* iOS note */}
          <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: '#0D0D1C', border: '1px solid #6366F130' }}>
            <Apple size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRu
                ? 'Apple не разрешает устанавливать приложения вне App Store. PWA — это лучший способ получить приложение на iPhone без магазина. Оно работает как нативное: офлайн, иконка на рабочем столе, полноэкранный режим.'
                : 'Apple doesn\'t allow installing apps outside the App Store. PWA is the best way to get the app on iPhone without the store. It works like a native app: offline, home screen icon, fullscreen mode.'}
            </p>
          </div>

          {/* Features */}
          <div className="rounded-2xl p-4" style={{ background: '#0E0E1C', border: '1px solid #1E2A40' }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              {isRu ? 'Что вы получите' : 'What you get'}
            </p>
            <div className="space-y-2.5">
              {(isRu
                ? ['Иконка на рабочем столе', 'Полноэкранный режим без адресной строки', 'Работа без интернета', 'Быстрый запуск как у нативного приложения']
                : ['Home screen icon', 'Fullscreen mode without address bar', 'Offline functionality', 'Fast launch like a native app']
              ).map((feat) => (
                <div key={feat} className="flex items-center gap-2.5">
                  <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-slate-300">{feat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
