// ============================================================
// useTodos.js — todo data and actions
// CHUNK 10: replace with Firestore subscriptions
// ============================================================
import { useMemo } from 'react';
import { useData } from '@shared/contexts/DataContext';

/**
 * @param {'personal'|'team'|'all'} [type='all']
 * @param {string} [userId] - when type is 'personal', further filter by ownerId
 */
export function useTodos(type = 'all', userId) {
  const { todos, createTodo, updateTodo, deleteTodo, toggleTodoSubtask } = useData();

  const filteredTodos = useMemo(() => {
    let result = todos ?? [];

    if (type === 'personal') {
      result = result.filter((todo) => todo.type === 'personal');
      if (userId) {
        result = result.filter((todo) => todo.ownerId === userId);
      }
    } else if (type === 'team') {
      result = result.filter((todo) => todo.type === 'team');
    }
    // 'all' — no filter

    return result;
  }, [todos, type, userId]);

  return {
    todos: filteredTodos,
    loading: false,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoSubtask,
  };
}
