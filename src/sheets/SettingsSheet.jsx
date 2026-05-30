import { useState } from 'react';
import { LogOut, Moon, Sun, X } from 'lucide-react';
import { PEOPLE } from '../lib/constants';

export default function SettingsSheet({ open, onClose, theme, onToggleTheme, role, onSwitchUser }) {
  const [confirmSwitch, setConfirmSwitch] = useState(false);

  if (!open) return null;
  const person = role ? PEOPLE[role] : null;
  const isDark = theme === 'dark';

  async function handleSwitch() {
    try {
      await onSwitchUser();
    } catch (err) {
      console.error('switch user failed', err);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="backdrop-in absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:w-[480px] surf-bg rounded-t-[28px] md:rounded-[28px] sheet-up pb-4"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
          boxShadow: '0 30px 80px -20px rgba(0,0,0,0.35)',
        }}
      >
        <div className="md:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-9 h-1 rounded-full" style={{ background: 'var(--text-subtle)' }} />
        </div>
        <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b bd-hairline" style={{ borderBottomWidth: '0.5px' }}>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 rounded-full surf-section flex items-center justify-center"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
          <h2 className="text-[16px] font-semibold txt-primary">Configurações</h2>
          <span className="w-9" />
        </div>

        {person && (
          <div className="px-4 pt-4">
            <div className="surf-card rounded-xl flex items-center gap-3 px-4 py-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[16px] shrink-0"
                style={{ background: person.bg, color: person.textColor }}
              >
                {person.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold txt-primary truncate">
                  {person.name}
                </div>
                <div className="text-[12.5px] txt-muted truncate">
                  {person.role}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 pt-4">
          <div className="surf-card rounded-xl overflow-hidden">
            <button
              onClick={onToggleTheme}
              aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              className="w-full flex items-center gap-3 pl-4 pr-3 py-3.5 surf-hover transition"
            >
              <div className="w-9 h-9 rounded-full surf-section flex items-center justify-center shrink-0">
                {isDark ? <Moon size={17} className="txt-primary" /> : <Sun size={17} className="txt-primary" />}
              </div>
              <div className="flex-1 text-left">
                <div className="text-[16px] txt-primary">
                  Tema
                </div>
                <div className="text-[12.5px] txt-muted mt-0.5">
                  {isDark ? 'Escuro' : 'Claro'}
                </div>
              </div>
              <ToggleSwitch on={isDark} />
            </button>
          </div>
        </div>

        <div className="px-4 pt-3">
          <div className="surf-card rounded-xl overflow-hidden">
            {!confirmSwitch ? (
              <button
                onClick={() => setConfirmSwitch(true)}
                className="w-full flex items-center gap-3 pl-4 pr-3 py-3.5 surf-hover transition"
              >
                <div className="w-9 h-9 rounded-full surf-section flex items-center justify-center shrink-0">
                  <LogOut size={17} className="txt-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[16px] txt-primary">
                    Trocar usuário
                  </div>
                  <div className="text-[12.5px] txt-muted mt-0.5">
                    Volta pra tela "Quem é você?"
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-4">
                <p className="text-[14px] txt-primary mb-3">
                  Quer mesmo trocar de usuário neste aparelho?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmSwitch(false)}
                    className="flex-1 h-10 rounded-full surf-section txt-primary text-[14px] font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSwitch}
                    className="flex-1 h-10 rounded-full surf-accent text-white text-[14px] font-semibold"
                  >
                    Trocar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] txt-muted mt-5 px-6">
          Lumen · build {typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'}
        </p>
      </div>
    </div>
  );
}

function ToggleSwitch({ on }) {
  return (
    <span
      aria-hidden
      className="relative inline-block w-[44px] h-[26px] rounded-full transition"
      style={{ background: on ? 'var(--accent)' : 'var(--text-subtle)' }}
    >
      <span
        className="absolute top-0.5 w-[22px] h-[22px] rounded-full bg-white transition-all"
        style={{
          left: on ? 20 : 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </span>
  );
}
