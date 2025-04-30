// src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/features/auth/types';

export const useAuth = (requiredRole?: UserRole) => {
  const { currentUser, status } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (status === 'succeeded' && !currentUser) {
      router.push('/login');
    }
    
    if (currentUser && requiredRole && currentUser.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [currentUser, status, requiredRole, router]);

  return {
    user: currentUser,
    role: currentUser?.role,
    isAuthenticated: !!currentUser,
    isLoading: status === 'loading',
  };
};