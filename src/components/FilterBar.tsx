import type { Filter, Priority } from '../types/todo';

interface Props {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (p: Priority | 'all') => void;
  search: string;
  onSearchChange: (s: string) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
];

const PRIORITIES: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

export function FilterBar({
  filter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  search,
  onSearchChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: Props) {
  return (
    <div className="space-y-3 mb-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-violet-400 transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filter === value
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
              {value === 'active' && activeCount > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === 'active' ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {activeCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
          {PRIORITIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onPriorityFilterChange(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                priorityFilter === value
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={onClearCompleted}
            className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
          >
            完了済みを削除 ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
}
