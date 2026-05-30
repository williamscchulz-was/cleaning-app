import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

// useToast().show({ message, actionLabel?, onAction?, duration? })
// Returns a dismiss fn.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setToast(null);
  }, []);

  const show = useCallback((opts) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const duration = opts.duration ?? (opts.actionLabel ? 5000 : 2500);
    setToast({ ...opts, id: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), duration);
    return dismiss;
  }, [dismiss]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastRoot toast={toast} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

function ToastRoot({ toast, onDismiss }) {
  if (!toast) return null;

  function handleAction() {
    try {
      toast.onAction?.();
    } finally {
      onDismiss();
    }
  }

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[420px] pointer-events-none"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 86px)' }}
    >
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="toast-in pointer-events-auto surf-card rounded-2xl shadow-lg-token flex items-center gap-3 pl-4 pr-2 py-3"
      >
        {toast.icon && <span className="shrink-0">{toast.icon}</span>}
        <span className="flex-1 text-[14.5px] txt-primary leading-snug">
          {toast.message}
        </span>
        {toast.actionLabel && (
          <button
            onClick={handleAction}
            className="pressable shrink-0 px-3 h-9 rounded-full surf-accent-soft txt-accent text-[13.5px] font-semibold"
          >
            {toast.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
