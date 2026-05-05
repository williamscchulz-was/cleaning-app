import { Sprout } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import PickerScreen from './screens/PickerScreen';

function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#820AD1] text-white shadow-lg animate-pulse">
        <Sprout size={32} />
      </div>
    </div>
  );
}

function RolePlaceholder({ role }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-6">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#820AD1] text-white shadow-lg">
          <Sprout size={32} />
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          Olá, {role}!
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Auth + Firestore funcionando. As telas reais chegam na próxima parte.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { role, loading, pickRole } = useAuth();

  if (loading) return <Splash />;
  if (!role) return <PickerScreen onPick={pickRole} />;
  return <RolePlaceholder role={role} />;
}
