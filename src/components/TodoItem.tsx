import { useState, useRef, useEffect } from 'react';
import type { Todo, Priority } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-rose-400',
};

const PRIORITY_RING: Record<Priority, string> = {
  low: 'border-emerald-400 hover:bg-emerald-50',
  medium: 'border-amber-400 hover:bg-amber-50',
  high: 'border-rose-400 hover:bg-rose-50',
};

const PRIORITY_CHECKED: Record<Priority, string> = {
  low: 'bg-emerald-400 border-emerald-400',
  medium: 'bg-amber-400 border-amber-400',
  high: 'bg-rose-400 border-rose-400',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}日超過`;
  if (diff === 0) return '今日';
  if (diff === 1) return '明日';
  return `${diff}日後`;
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  function handleEditSubmit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onUpdate(todo.id, { text: trimmed });
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  }

  function handleEditKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  }

  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate);

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors rounded-xl ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          todo.completed ? PRIORITY_CHECKED[todo.priority] : PRIORITY_RING[todo.priority]
        }`}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={editRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            className="w-full text-sm outline-none bg-transparent border-b border-violet-400 pb-0.5"
          />
        ) : (
          <span
            className={`text-sm cursor-pointer select-none ${
              todo.completed ? 'line-through text-slate-400' : 'text-slate-800'
            }`}
            onDoubleClick={() => !todo.completed && setEditing(true)}
          >
            {todo.text}
          </span>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {/* Priority indicator */}
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[todo.priority]}`} />
          </span>

          {/* Due date */}
          {todo.dueDate && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md ${
                overdue
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              📅 {formatDate(todo.dueDate)}
            </span>
          )}

          {/* Tags */}
          {todo.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!todo.completed && (
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="編集"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          title="削除"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
