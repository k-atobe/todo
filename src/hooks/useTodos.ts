import { useState, useEffect, useCallback } from 'react';
import type { Todo, Priority } from '../types/todo';

const STORAGE_KEY = 'todos-v1';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(
    (text: string, priority: Priority, dueDate: string | null, tags: string[]) => {
      setTodos((prev) => [
        {
          id: generateId(),
          text: text.trim(),
          completed: false,
          priority,
          dueDate,
          createdAt: new Date().toISOString(),
          tags,
        },
        ...prev,
      ]);
    },
    []
  );

  const updateTodo = useCallback(
    (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  return { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted };
}
