import { lazy, Suspense, useMemo, useState } from 'react';
import BottomDock from './components/BottomDock';
import AppIcon from './components/AppIcon';
import { MoreButton } from './components/ui';
import { ToastProvider, useToast } from './components/Toast';
import PickerScreen from './screens/PickerScreen';
import SimoneToday from './screens/SimoneToday';
import AdminHome from './screens/AdminHome';
import Catalogo from './screens/Catalogo';
import Historico from './screens/Historico';
import Preview from './screens/Preview';
import TaskSheet from './sheets/TaskSheet';
import SkipSheet from './sheets/SkipSheet';
import SettingsSheet from './sheets/SettingsSheet';
import { useAuth } from './hooks/useAuth';
import { useDueTasks } from './hooks/useDueTasks';
import { useTheme } from './hooks/useTheme';
import {
  createTask, deactivateTask, deleteCompletion, markCompletion, updateTask,
} from './lib/tasksApi';
import { isSameDay } from './lib/dates';
import { PEOPLE } from './lib/constants';

function isMocksRoute() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('mocks') === '1';
}

const MocksGallery = lazy(() => import('./mocks/MocksGallery'));

function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center surf-bg">
      <div className="animate-pulse">
        <AppIcon size={72} />
      </div>
    </div>
  );
}

// Fills the viewport (dvh handles iOS URL-bar collapse). Centered phone
// column on desktop. Children render the screen content; the parent App
// is responsible for placing scrollable areas vs fixed chrome (BottomDock).
function Shell({ children, onOpenSettings, hideSettings }) {
  return (
    <div className="h-[100dvh] w-full surf-bg overflow-hidden">
      <div
        className="relative max-w-[440px] mx-auto h-full flex flex-col"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {!hideSettings && onOpenSettings && (
          <div className="absolute top-[max(env(safe-area-inset-top),8px)] right-3 z-30">
            <MoreButton onClick={onOpenSettings} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  if (isMocksRoute()) {
    return (
      <Suspense fallback={<Splash />}>
        <MocksGallery />
      </Suspense>
    );
  }
  return (
    <ToastProvider>
      <RealApp theme={theme} toggleTheme={toggleTheme} />
    </ToastProvider>
  );
}

function RealApp({ theme, toggleTheme }) {
  const { uid, role, loading: authLoading, pickRole, clearRole } = useAuth();
  const { items, completions, tasks, loading: dataLoading } = useDueTasks();
  const { show: showToast } = useToast();

  const [tab, setTab] = useState('home');
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Optimistic toggle/skip overlays. Keyed by taskId → 'done' | 'undone' | 'skipped'.
  // The snapshot is the source of truth; this just bridges the network gap so taps
  // feel instant. Cleared when the snapshot catches up (or on error).
  const [pending, setPending] = useState({});

  // Items with optimistic state applied on top.
  const effectiveItems = useMemo(() => items.map((it) => {
    const p = pending[it.task.id];
    if (!p) return it;
    if (p === 'done')    return { ...it, doneToday: true,  skippedToday: false };
    if (p === 'undone')  return { ...it, doneToday: false, skippedToday: false };
    if (p === 'skipped') return { ...it, doneToday: false, skippedToday: true  };
    return it;
  }), [items, pending]);

  function setPendingFor(taskId, kind) {
    setPending((p) => ({ ...p, [taskId]: kind }));
    // Auto-clear after 4s as a safety net (snapshot usually arrives in <500ms).
    setTimeout(() => {
      setPending((p) => {
        if (p[taskId] !== kind) return p;
        const { [taskId]: _, ...rest } = p;
        return rest;
      });
    }, 4000);
  }

  if (authLoading) return <Splash />;

  if (!role) {
    return (
      <Shell hideSettings>
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <PickerScreen onPick={pickRole} />
        </main>
      </Shell>
    );
  }

  const isAdmin = role === 'flavia' || role === 'william';

  async function handleToggleDone(taskId) {
    const item = effectiveItems.find((it) => it.task.id === taskId);
    if (!item) return;
    const undoing = item.doneToday && item.last && isSameDay(item.last.performedAt, new Date());
    setPendingFor(taskId, undoing ? 'undone' : 'done');
    try {
      if (undoing) {
        await deleteCompletion(item.last.id);
      } else {
        await markCompletion({ taskId, status: 'done', uid });
      }
    } catch (err) {
      console.error('toggle failed', err);
      setPending((p) => { const { [taskId]: _, ...rest } = p; return rest; });
      showToast({ message: 'Não consegui salvar — tenta de novo.' });
    }
  }

  function handleSkipRequest(task) {
    setSkipTarget(task);
  }

  async function handleSkipConfirm() {
    if (!skipTarget) return;
    const target = skipTarget;
    setSkipTarget(null);
    setPendingFor(target.id, 'skipped');
    try {
      const ref = await markCompletion({ taskId: target.id, status: 'skipped', uid });
      showToast({
        message: 'Tarefa adiada pra próximo ciclo.',
        actionLabel: 'Desfazer',
        onAction: async () => {
          try {
            await deleteCompletion(ref.id);
            setPending((p) => { const { [target.id]: _, ...rest } = p; return rest; });
          } catch (err) {
            console.error('undo skip failed', err);
            showToast({ message: 'Não consegui desfazer.' });
          }
        },
      });
    } catch (err) {
      console.error('skip failed', err);
      setPending((p) => { const { [target.id]: _, ...rest } = p; return rest; });
      showToast({ message: 'Não consegui adiar — tenta de novo.' });
    }
  }

  function handleAddTask() {
    setEditingTask(null);
    setTaskSheetOpen(true);
  }
  function handleEditTask(task) {
    setEditingTask(task);
    setTaskSheetOpen(true);
  }
  function handleCloseSheet() {
    setTaskSheetOpen(false);
    setEditingTask(null);
  }

  async function handleSaveTask(data) {
    try {
      if (data.id) {
        await updateTask(data.id, data);
        showToast({ message: 'Tarefa atualizada.' });
      } else {
        const ref = await createTask({ ...data, uid });
        if (data.seedDate) {
          await markCompletion({
            taskId: ref.id,
            status: 'done',
            uid,
            performedAt: data.seedDate,
          });
        }
        showToast({ message: 'Tarefa criada.' });
      }
      handleCloseSheet();
    } catch (err) {
      console.error('save task failed', err);
      showToast({ message: 'Não consegui salvar — tenta de novo.' });
      throw err;
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deactivateTask(taskId);
      showToast({ message: 'Tarefa excluída.' });
      handleCloseSheet();
    } catch (err) {
      console.error('delete task failed', err);
      showToast({ message: 'Não consegui excluir — tenta de novo.' });
      throw err;
    }
  }

  async function handleSwitchUser() {
    setSettingsOpen(false);
    setTab('home');
    setPending({});
    await clearRole();
  }

  const adminPerson = role === 'flavia' ? PEOPLE.flavia : PEOPLE.william;

  return (
    <Shell onOpenSettings={() => setSettingsOpen(true)}>
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {role === 'simone' && (
            <SimoneToday
              items={effectiveItems}
              onToggle={handleToggleDone}
              onSkipRequest={handleSkipRequest}
            />
          )}

          {isAdmin && (
            <>
              {tab === 'home' && (
                <AdminHome
                  person={adminPerson}
                  items={effectiveItems}
                  onAddTask={handleAddTask}
                  goTo={setTab}
                />
              )}
              {tab === 'tarefas' && (
                <Catalogo
                  tasks={tasks}
                  onAdd={handleAddTask}
                  onEdit={handleEditTask}
                  onBack={() => setTab('home')}
                />
              )}
              {tab === 'historico' && (
                <Historico
                  completions={completions}
                  tasks={tasks}
                  onBack={() => setTab('home')}
                />
              )}
              {tab === 'preview' && (
                <Preview items={effectiveItems} onBack={() => setTab('home')} />
              )}
            </>
          )}
        </main>

        {isAdmin && tab !== 'preview' && <BottomDock tab={tab} setTab={setTab} />}
      </div>

      <TaskSheet
        open={taskSheetOpen}
        task={editingTask}
        onClose={handleCloseSheet}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
      <SkipSheet
        open={!!skipTarget}
        task={skipTarget}
        onClose={() => setSkipTarget(null)}
        onConfirm={handleSkipConfirm}
      />
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        role={role}
        onSwitchUser={handleSwitchUser}
      />
    </Shell>
  );
}
