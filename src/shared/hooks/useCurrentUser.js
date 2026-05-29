// Returns the current authenticated user object
import { useAuth } from '@shared/contexts/AuthContext';
export function useCurrentUser() {
  return useAuth().user;
}
