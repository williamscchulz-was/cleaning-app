import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import BottomDock from './components/BottomDock';
import Sidebar from './components/Sidebar';
import AppIcon from './components/AppIcon';
import TodaySkeleton from './components/Skeleton';
import SplashScreen from './components/SplashScreen';
import { ToastProvider, useToast } from './components/Toast';
import PickerScreen from './screens/PickerScreen';
import TodayScreen from './screens/TodayScreen';
import AdminHome from './screens/AdminHome';
import Catalogo from './screens/Catalogo';
import Historico from './screens/Historico';
import Preview from './screens/Preview';
import TaskSheet from './sheets/TaskSheet';
import SkipSheet from './sheets/SkipSheet';
import SettingsSheet from './sheets/SettingsSheet';
import ExportSheet from './sheets/ExportSheet';
import { useAuth } from './hooks/useAuth';
import { useDueTasks } from './hooks/useDueTasks';
import { useTheme } from './hooks/useTheme';
import {
  createTask, deactivateTask, deleteCompletion, markCompletion, updateTask,
} from './lib/tasksApi';
import { isSameDay } from './lib/dates';
import { PEOPLE } from './lib/constants';
import { haptics } from './lib/haptics';

function isMocksRoute() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('mocks') === '1';
}

function isPdfMockRoute() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('pdf') === '1';
}

const MocksGallery = lazy(() => import('./mocks/MocksGallery'));
const PdfMock = lazy(() => import('./mocks/PdfMock'));

function Splash() {
  return (
    <div className="h-[100dvh] flex items-center justify-center surf-bg">
      <div className="soft-pulse">
        <AppIcon size={72} />
      </div>
    </div>
  );
}

// Fills the viewport (dvh handles iOS URL-bar collapse). On phones the
// content sits in a centered 440px column with a floating dock. On
// tablet+ we switch to a two-column layout: persistent sidebar on the
// left and a wider content area on the right. No outer safe-area
// padding — content extends edge to edge; screens and chrome apply their
// own safe-area padding internally where it matters.
function Shell({ sidebar, children }) {
  return (
    <div className="h-[100dvh] w-full surf-bg overflow-hidden flex">
      {sidebar}
      <div className="relative flex-1 h-full">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  // Show the animated splash once per app load. It overlays the app while
  // the first data loads and dismisses itself on a timer (never gating).
  const [splashDone, setSplashDone] = useState(false);

  if (isMocksRoute()) {
    return (
      <Suspense fallback={<Splash />}>
        <MocksGallery />
      </Suspense>
    );
  }
  if (isPdfMockRoute()) {
    return (
      <Suspense fallback={<Splash />}>
        <PdfMock />
      </Suspense>
    );
  }
  return (
    <ToastProvider>
      <RealApp theme={theme} toggleTheme={toggleTheme} />
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
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
  const [defaultAreasForNew, setDefaultAreasForNew] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

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

  // Clear pending entries as soon as the real snapshot reflects them. Avoids
  // the optimistic overlay sticking around once Firestore has caught up.
  useEffect(() => {
    if (Object.keys(pending).length === 0) return;
    setPending((p) => {
      let changed = false;
      const next = { ...p };
      for (const [taskId, kind] of Object.entries(p)) {
        const item = items.find((it) => it.task.id === taskId);
        if (!item) continue;
        const matches =
          (kind === 'done'    && item.doneToday) ||
          (kind === 'undone'  && !item.doneToday && !item.skippedToday) ||
          (kind === 'skipped' && item.skippedToday);
        if (matches) {
          delete next[taskId];
          changed = true;
        }
      }
      return changed ? next : p;
    });
  }, [items, pending]);

  function setPendingFor(taskId, kind) {
    setPending((p) => ({ ...p, [taskId]: kind }));
    // Safety net in case the snapshot never reflects the change (write
    // failed silently, user went offline, etc.). The effect above is the
    // primary cleanup path.
    setTimeout(() => {
      setPending((p) => {
        if (p[taskId] !== kind) return p;
        const { [taskId]: _, ...rest } = p;
        return rest;
      });
    }, 6000);
  }

  if (authLoading) return <Splash />;

  if (!role) {
    return (
      <Shell>
        <main
          className="absolute inset-0 overflow-y-auto no-scrollbar"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="max-w-[440px] md:max-w-[560px] mx-auto">
            <PickerScreen onPick={pickRole} />
          </div>
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
    setDefaultAreasForNew(null);
    setTaskSheetOpen(true);
  }
  function handleAddInArea(area) {
    setEditingTask(null);
    setDefaultAreasForNew([area]);
    setTaskSheetOpen(true);
  }
  function handleEditTask(task) {
    setEditingTask(task);
    setDefaultAreasForNew(null);
    setTaskSheetOpen(true);
  }
  function handleCloseSheet() {
    setTaskSheetOpen(false);
    setEditingTask(null);
    setDefaultAreasForNew(null);
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
      haptics.medium();
      handleCloseSheet();
    } catch (err) {
      console.error('save task failed', err);
      haptics.error();
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
  const showDock = isAdmin && tab !== 'preview' && tab !== 'mine';
  // Simone has no dock, so she needs a separate way into settings.
  const showFloatingSettings = !showDock && tab !== 'preview';
  // First snapshot still loading and nothing cached yet → show skeleton.
  const firstLoad = dataLoading && tasks.length === 0;

  return (
    <Shell
      sidebar={
        showDock ? (
          <Sidebar
            tab={tab}
            setTab={setTab}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        ) : null
      }
    >
      <main
        className="absolute inset-0 overflow-y-auto no-scrollbar"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: showDock
            ? 'calc(env(safe-area-inset-bottom) + 96px)'
            : 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="max-w-[440px] md:max-w-[640px] mx-auto">
          {firstLoad ? (
            <TodaySkeleton />
          ) : role === 'simone' ? (
            <TodayScreen
              items={effectiveItems}
              assignedToRole="simone"
              onToggle={handleToggleDone}
              onSkipRequest={handleSkipRequest}
            />
          ) : isAdmin ? (
            <div key={tab} className="screen-in">
              {tab === 'home' && (
                <AdminHome
                  person={adminPerson}
                  role={role}
                  items={effectiveItems}
                  onAddTask={handleAddTask}
                  onExport={() => setExportOpen(true)}
                  goTo={setTab}
                />
              )}
              {tab === 'tarefas' && (
                <Catalogo
                  items={items}
                  onAdd={handleAddTask}
                  onAddInArea={handleAddInArea}
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
              {tab === 'mine' && (
                <TodayScreen
                  items={effectiveItems}
                  assignedToRole={role}
                  title="Minhas tarefas"
                  onToggle={handleToggleDone}
                  onSkipRequest={handleSkipRequest}
                  onBack={() => setTab('home')}
                />
              )}
            </div>
          ) : null}
        </div>
      </main>

      {showDock && (
        <BottomDock
          tab={tab}
          setTab={setTab}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      {showFloatingSettings && (
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label="Mais opções"
          className="pressable absolute z-20 w-11 h-11 rounded-full surf-card txt-primary flex items-center justify-center shadow-md-token"
          style={{
            top: 'max(env(safe-area-inset-top), 12px)',
            right: 12,
          }}
        >
          <MoreHorizontal size={18} />
        </button>
      )}

      <TaskSheet
        open={taskSheetOpen}
        task={editingTask}
        defaultAreas={defaultAreasForNew}
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
      <ExportSheet
        open={exportOpen}
        items={effectiveItems}
        onClose={() => setExportOpen(false)}
        showToast={showToast}
      />
    </Shell>
  );
}
