'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions map
const rolePermissions: Record<UserRole, string[]> = {
  staf_pemeriksa: [
    'dashboard.view_own',
    'request.view_own',
    'request.create',
    'evidence.view_own',
    'evidence.upload',
    'report.view',
    'knowledge.read',
    'announcements.read',
  ],
  supervisor: [
    'dashboard.view_own',
    'dashboard.view_team',
    'request.view_team',
    'request.approve',
    'evidence.view_team',
    'evidence.upload',
    'report.view',
    'report.generate',
    'knowledge.read',
    'announcements.read',
    'announcements.create',
    'workload.view',
    'case.assign',
  ],
  analis_lab: [
    'dashboard.view_own',
    'request.view_assigned',
    'evidence.view_own',
    'evidence.upload',
    'evidence.analyze',
    'report.view',
    'report.write',
    'knowledge.read',
    'announcements.read',
    'workspace.access',
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Mock login: find user by email or default to first user
    const foundUser = mockUsers.find((u) => u.email === email) || mockUsers[0];
    setUser(foundUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const userForRole = mockUsers.find((u) => u.role === role);
    if (userForRole) {
      setUser(userForRole);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      return rolePermissions[user.role]?.includes(permission) ?? false;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
