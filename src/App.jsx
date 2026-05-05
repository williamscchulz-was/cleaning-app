import { Sprout } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#820AD1] text-white shadow-lg">
          <Sprout size={32} />
        </div>
        <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
          Diarista
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Tarefas da semana — em construção
        </p>
      </div>
    </div>
  );
}
