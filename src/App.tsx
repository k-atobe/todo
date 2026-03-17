import { useState, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import { FilterBar } from './components/FilterBar';
import type { Filter, Priority } from './types/todo';

export default function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<Filter>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const inText = todo.text.toLowerCase().includes(q);
        const inTags = todo.tags.some((t) => t.toLowerCase().includes(q));
        if (!inText && !inTags) return false;
      }
      return true;
    });
  }, [todos, filter, priorityFilter, search]);

  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            タスク管理
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {activeCount > 0
              ? `${activeCount}件の未完了タスク`
              : todos.length === 0
              ? 'タスクはありません'
              : 'すべてのタスクが完了しています 🎉'}
          </p>
        </div>

        {/* Add form */}
        <TodoForm onAdd={addTodo} />

        {/* Filters */}
        {todos.length > 0 && (
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            search={search}
            onSearchChange={setSearch}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        )}

        {/* Todo list */}
        {filtered.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            {filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))}
          </div>
        ) : todos.length > 0 ? (
          <div className="text-center py-12 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">該当するタスクはありません</p>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-sm font-medium">タスクを追加してみましょう</p>
            <p className="text-xs mt-1">上のフォームからタスクを入力してください</p>
          </div>
        )}

        {/* Footer stats */}
        {todos.length > 0 && (
          <div className="mt-4 text-center text-xs text-slate-400">
            全{todos.length}件 · 完了{completedCount}件 · 未完了{activeCount}件
          </div>
        )}
      </div>
    </div>
  );
}
