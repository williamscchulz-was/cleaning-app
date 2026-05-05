import { useState } from 'react';
import { Sprout } from 'lucide-react';
import StatusBar from './components/StatusBar';
import BottomDock from './components/BottomDock';
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
import {
  createTask, deactivateTask, deleteCompletion, markCompletion, updateTask,
} from './lib/tasksApi';
import { isSameDay } from './lib/dates';
import { PEOPLE } from './lib/constants';

function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center surf-paper">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl surf-accent text-white shadow-lg animate-pulse">
        <Sprout size={32} />
      </div>
    </div>
  );
}

function PhoneFrame({ children }) {
  return (
    <div className="theme-light font-body min-h-screen w-full surf-outer flex items-center justify-center p-0 sm:p-6 transition-colors">
      <div className="relative w-full sm:w-[400px] sm:h-[860px] h-screen surf-paper sm:rounded-[44px] overflow-hidden shadow-none sm:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.30),0_0_0_10px_#000000,0_0_0_12px_#1C1C1E]">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { uid, role, loading: authLoading, pickRole } = useAuth();
  const { items, completions, tasks, loading: dataLoading } = useDueTasks();

  const [tab, setTab] = useState('home');
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [skipTarget, setSkipTarget] = useState(null);

  if (authLoading) return <Splash />;

  if (!role) {
    return (
      <PhoneFrame>
        <StatusBar />
        <div className="h-[calc(100%-32px)] overflow-y-auto no-scrollbar">
          <PickerScreen onPick={pickRole} />
        </div>
      </PhoneFrame>
    );
  }

  const isAdmin = role === 'flavia' || role === 'william';

  // Toggle done for a task today. If already done today → undo (delete completion).
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
      await createTask({ ...data, uid });
    }
    handleCloseSheet();
  }

  async function handleDeleteTask(taskId) {
    await deactivateTask(taskId);
    handleCloseSheet();
  }

  const adminPerson = role === 'flavia' ? PEOPLE.flavia : PEOPLE.william;

  return (
    <PhoneFrame>
      <StatusBar />
      <div className="h-[calc(100%-32px)] overflow-y-auto no-scrollbar relative">
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
            <div className="w-12 h-12 rounded-2xl surf-accent text-white flex items-center justify-center shadow-lg animate-pulse">
              <Sprout size={24} />
            </div>
          </div>
        )}
      </div>

      {isAdmin && tab !== 'preview' && <BottomDock tab={tab} setTab={setTab} />}

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
    </PhoneFrame>
  );
}
