import { useState } from 'react';
import { LogOut, Moon, Sun, X } from 'lucide-react';
import { PEOPLE } from '../lib/constants';

export default function SettingsSheet({ open, onClose, theme, onToggleTheme, role, onSwitchUser }) {
  const [confirmSwitch, setConfirmSwitch] = useState(false);

  if (!open) return null;
  const person = role ? PEOPLE[role] : null;

  async function handleSwitch() {
    try {
      await onSwitchUser();
    } catch (err) {
      console.error('switch user failed', err);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:w-[440px] sm:mb-6 surf-bg rounded-t-[28px] sm:rounded-[28px] sheet-up pb-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-3 border-b bd-hairline" style={{ borderBottomWidth: '0.5px' }}>
          <button
            onClick={onClose}
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
              className="w-full flex items-center gap-3 pl-4 pr-3 py-3.5 surf-hover transition"
            >
              <div className="w-9 h-9 rounded-full surf-section flex items-center justify-center shrink-0">
                {theme === 'dark' ? <Sun size={17} className="txt-primary" /> : <Moon size={17} className="txt-primary" />}
              </div>
              <div className="flex-1 text-left">
                <div className="text-[16px] txt-primary">
                  {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
                </div>
                <div className="text-[12.5px] txt-muted mt-0.5">
                  Atual: {theme === 'dark' ? 'escuro' : 'claro'}
                </div>
              </div>
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
      </div>
    </div>
  );
}
