import { useState, useRef, useEffect } from 'react';
import type { Priority } from '../types/todo';

interface Props {
  onAdd: (text: string, priority: Priority, dueDate: string | null, tags: string[]) => void;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
  high: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200',
};

const PRIORITY_ACTIVE: Record<Priority, string> = {
  low: 'bg-emerald-500 text-white border-emerald-500',
  medium: 'bg-amber-500 text-white border-amber-500',
  high: 'bg-rose-500 text-white border-rose-500',
};

export function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, dueDate || null, tags);
    setText('');
    setPriority('medium');
    setDueDate('');
    setTagInput('');
    setTags([]);
    setExpanded(false);
    inputRef.current?.focus();
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex gap-3 items-center">
        <button
          type="submit"
          className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400 hover:border-violet-400 hover:text-violet-400 transition-colors flex-shrink-0"
          title="追加"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="新しいタスクを入力..."
          className="flex-1 text-base outline-none placeholder-slate-400 bg-transparent"
        />
        {text.trim() && (
          <button
            type="submit"
            className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
          >
            追加
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-16 flex-shrink-0">優先度</span>
            <div className="flex gap-1.5">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                    priority === p ? PRIORITY_ACTIVE[p] : PRIORITY_COLORS[p]
                  }`}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-16 flex-shrink-0">期日</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-violet-400 transition-colors"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Tags */}
          <div className="flex items-start gap-2">
            <span className="text-xs text-slate-500 w-16 flex-shrink-0 pt-1.5">タグ</span>
            <div className="flex flex-wrap gap-1.5 flex-1 border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-violet-400 transition-colors">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-violet-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? 'Enterで追加...' : ''}
                className="text-sm outline-none bg-transparent min-w-[80px] flex-1"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
