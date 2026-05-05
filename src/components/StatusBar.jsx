import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 pt-2 pb-1 text-[12px] font-bold tnum txt-primary">
      <span>{time || '09:14'}</span>
      <div className="flex items-center gap-1.5 opacity-95">
        <span className="text-[10px]">100%</span>
        <span className="w-5 h-2.5 rounded-[3px] relative border bd-primary">
          <span className="absolute inset-0.5 rounded-[1px] surf-invert opacity-85" />
        </span>
      </div>
    </div>
  );
}
