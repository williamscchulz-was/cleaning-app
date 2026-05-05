import { useState } from 'react';
import { Sprout } from 'lucide-react';
import MocksGallery from './mocks/MocksGallery';
import BottomDock from './components/BottomDock';
import { ThemeToggle } from './components/ui';
import PickerScreen from './screens/PickerScreen';
import SimoneToday from './screens/SimoneToday';
import AdminHome from './screens/AdminHome';
import Catalogo from './screens/Catalogo';
import Historico from './screens/Historico';
import Preview from './screens/Preview';
import TaskSheet from './sheets/TaskSheet';
import SkipSheet from './sheets/SkipSheet';
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

function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center surf-bg">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl surf-accent text-white animate-pulse">
        <Sprout size={28} />
      </div>
    </div>
  );
}

// Phone-shaped container on desktop, full width on mobile.
function Shell({ children, theme, onToggleTheme }) {
  return (
    <div className="min-h-screen w-full surf-bg">
      <div className="relative max-w-[440px] mx-auto min-h-screen flex flex-col">
        <div className="absolute top-2 right-3 z-30">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  if (isMocksRoute()) return <MocksGallery />;
  return <RealApp theme={theme} toggleTheme={toggleTheme} />;
}

function RealApp({ theme, toggleTheme }) {
  const { uid, role, loading: authLoading, pickRole } = useAuth();
  const { items, completions, tasks, loading: dataLoading } = useDueTasks();

  const [tab, setTab] = useState('home');
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);

  if (authLoading) return <Splash />;

  if (!role) {
    return (
      <Shell theme={theme} onToggleTheme={toggleTheme}>
        <PickerScreen onPick={pickRole} />
      </Shell>
    );
  }

  const isAdmin = role === 'flavia' || role === 'william';

  async function handleToggleDone(taskId) {
    const item = items.find((it) => it.task.id === taskId);
    if (!item) return;
    if (item.doneToday && item.last && isSameDay(item.last.performedAt, new Date())) {
      await deleteCompletion(item.last.id);
    } else {
      await markCompletion({ taskId, status: 'done', uid });
    }
  }

  function handleSkipRequest(task) {
    setSkipTarget(task);
  }

  async function handleSkipConfirm() {
    if (!skipTarget) return;
    await markCompletion({ taskId: skipTarget.id, status: 'skipped', uid });
    setSkipTarget(null);
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
    if (data.id) {
      await updateTask(data.id, data);
    } else {
      const ref = await createTask({ ...data, uid });
      // Seed last-done so the first cycle is anchored to that date,
      // otherwise a new task immediately appears as due today.
      if (data.seedDate) {
        await markCompletion({
          taskId: ref.id,
          status: 'done',
          uid,
          performedAt: data.seedDate,
        });
      }
    }
    handleCloseSheet();
  }

  async function handleDeleteTask(taskId) {
    await deactivateTask(taskId);
    handleCloseSheet();
  }

  const adminPerson = role === 'flavia' ? PEOPLE.flavia : PEOPLE.william;

  return (
    <Shell theme={theme} onToggleTheme={toggleTheme}>
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {role === 'simone' && (
            <SimoneToday
              items={items}
              onToggle={handleToggleDone}
              onSkipRequest={handleSkipRequest}
            />
          )}

          {isAdmin && (
            <>
              {tab === 'home' && (
                <AdminHome
                  person={adminPerson}
                  items={items}
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
                <Preview items={items} onBack={() => setTab('home')} />
              )}
            </>
          )}

          {dataLoading && tasks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-2xl surf-accent text-white flex items-center justify-center animate-pulse">
                <Sprout size={24} />
              </div>
            </div>
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
    </Shell>
  );
}
