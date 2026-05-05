import { useState } from 'react';
import VariantA from './VariantA_Editorial';
import VariantB from './VariantB_Bento';
import VariantC from './VariantC_Linear';
import VariantD from './VariantD_Japandi';
import VariantE from './VariantE_iOS';
import VariantF from './VariantF_iOSNubank';

const VARIANTS = [
  { key: 'A', label: 'A · Editorial Calm',    desc: 'Serif title, sage accent, whitespace generoso',         Comp: VariantA },
  { key: 'B', label: 'B · Bento Color',       desc: 'Cards coloridos por área, accent peach',                Comp: VariantB },
  { key: 'C', label: 'C · Mono Linear',       desc: 'Dark-first denso, mono pra números, accent neon',       Comp: VariantC },
  { key: 'D', label: 'D · Japandi',           desc: 'Creme + terracota, serif suave, anel de progresso',     Comp: VariantD },
  { key: 'E', label: 'E · iOS 18 Native',     desc: 'Inset rounded sections, blue accent, SF Pro',           Comp: VariantE },
  { key: 'F', label: 'F · iOS + Nubank purple', desc: 'Mesma estrutura da E, com roxo do Nubank no lugar do azul', Comp: VariantF },
];

export default function MocksGallery() {
  const [active, setActive] = useState('A');
  const variant = VARIANTS.find((v) => v.key === active);
  const { Comp, label, desc } = variant;

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="max-w-[1280px] mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
              Mockups Diarista
            </span>
            <span className="text-[11px] text-neutral-400">/ pickeable design directions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {VARIANTS.map((v) => (
              <button
                key={v.key}
                onClick={() => setActive(v.key)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition ${
                  active === v.key
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] text-neutral-500">{desc}</p>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PhonePreview label="Light">
            <Comp theme="light" />
          </PhonePreview>
          <PhonePreview label="Dark">
            <Comp theme="dark" />
          </PhonePreview>
        </div>
      </main>
    </div>
  );
}

function PhonePreview({ label, children }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
        {label}
      </div>
      <div
        className="w-full max-w-[420px] h-[820px] rounded-[40px] overflow-hidden border border-neutral-300 shadow-xl"
        style={{ background: '#fff' }}
      >
        <div className="h-full overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
