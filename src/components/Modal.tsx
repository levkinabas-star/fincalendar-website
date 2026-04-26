import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  fullHeight?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, fullHeight }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

  if (isDesktop) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'modal-fade-out' : 'modal-fade-in'}`}
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      >
        <div
          className="rounded-2xl overflow-hidden w-full max-w-lg"
          style={{ background: '#0E0E1C', border: '1px solid #1E2A40', maxHeight: '85vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1E2A40' }}>
            <h2 className="text-lg font-semibold text-slate-100">{title || ''}</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center active-scale"
              style={{ background: '#1E1E38' }}
            >
              <X size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className={`overflow-y-auto ${fullHeight ? 'max-h-[75vh]' : 'max-h-[75vh]'}`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end ${isClosing ? 'modal-fade-out' : 'modal-fade-in'}`}
      style={{ maxWidth: 480, margin: '0 auto' }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />

      <div
        className={`relative w-full rounded-t-3xl overflow-hidden ${isClosing ? 'modal-slide-down' : 'modal-slide-up'}`}
        style={{ background: '#0E0E1C', border: '1px solid #1E2A40', borderBottom: 'none', maxHeight: '92vh' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#1E2A40' }} />
        </div>

        {title && (
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center active-scale"
              style={{ background: '#1E1E38' }}
            >
              <X size={16} className="text-slate-400" />
            </button>
          </div>
        )}

        <div className={`overflow-y-auto ${fullHeight ? 'max-h-[80vh]' : 'max-h-[80vh]'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
