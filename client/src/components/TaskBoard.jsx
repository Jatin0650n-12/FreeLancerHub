import React from 'react';
import {
  KanbanSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  CircleDashed,
} from 'lucide-react';

const TaskCard = ({ task, onStatusChange }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group">
      <p className="font-semibold text-sm text-slate-800 leading-snug">
        {task.title}
      </p>

      {/* Movement action controls */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] font-medium text-slate-400">Move stage:</span>
        <div className="flex items-center gap-1.5">
          {task.status !== 'todo' && (
            <button
              onClick={() => onStatusChange(task._id, 'todo')}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Move to Todo"
            >
              Todo
            </button>
          )}

          {task.status !== 'in-progress' && (
            <button
              onClick={() => onStatusChange(task._id, 'in-progress')}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 transition-colors cursor-pointer"
              title="Move to In Progress"
            >
              In Progress
            </button>
          )}

          {task.status !== 'done' && (
            <button
              onClick={() => onStatusChange(task._id, 'done')}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 transition-colors cursor-pointer flex items-center gap-1"
              title="Mark as Done"
            >
              <Check size={12} />
              <span>Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskBoard = ({ tasks = [], onStatusChange }) => {
  const columns = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Todo Column */}
        <div className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200/70 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="font-bold text-sm text-slate-800">To Do</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-slate-600 shadow-xs">
              {columns.todo.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {columns.todo.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white/50 border border-dashed border-slate-200 rounded-2xl">
                No items in backlog
              </div>
            ) : (
              columns.todo.map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />
              ))
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-amber-50/40 p-4 rounded-3xl border border-amber-200/60 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="font-bold text-sm text-amber-900">In Progress</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-amber-800 shadow-xs">
              {columns['in-progress'].length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {columns['in-progress'].length === 0 ? (
              <div className="p-8 text-center text-xs text-amber-700/60 bg-white/50 border border-dashed border-amber-200 rounded-2xl">
                No active tasks
              </div>
            ) : (
              columns['in-progress'].map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />
              ))
            )}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-emerald-50/40 p-4 rounded-3xl border border-emerald-200/60 flex flex-col">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-sm text-emerald-900">Completed</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-emerald-800 shadow-xs">
              {columns.done.length}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {columns.done.length === 0 ? (
              <div className="p-8 text-center text-xs text-emerald-700/60 bg-white/50 border border-dashed border-emerald-200 rounded-2xl">
                No completed tasks yet
              </div>
            ) : (
              columns.done.map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
