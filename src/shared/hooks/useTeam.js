// ============================================================
// useTeam.js — team/user data
// CHUNK 10: replace with Firestore subscriptions
// ============================================================
import { useData } from '@shared/contexts/DataContext';

export function useTeam() {
  const { users } = useData();

  function getMemberById(id) {
    if (!users) return undefined;
    return users.find((u) => u.id === id);
  }

  return {
    members: users ?? [],
    loading: false,
    getMemberById,
  };
}
