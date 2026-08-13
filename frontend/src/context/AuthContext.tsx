'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
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
    // tanpa akses evidence: inventaris hasil akuisisi = internal Lab; pemohon pantau via My Request
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
    'evidence.intake', // konfirmasi serah terima barang bukti fisik
    'report.view',
    'report.generate',
    'report.endorse', // pengesahan akhir laporan hasil
    'knowledge.read',
    'announcements.read',
    'announcements.create',
    'workload.view',
  ],
  manajer_teknis: [
    'dashboard.view_own',
    'dashboard.view_team',
    'evidence.view_team',
    'report.view',
    'report.review_technical', // review teknis draft laporan SFD
    'case.assign', // penugasan kasus ke SFD (pindah dari Kepala Lab)
    'workload.view',
    'knowledge.read',
    'announcements.read',
  ],
  analis_lab: [
    'dashboard.view_own',
    'request.view_assigned',
    'evidence.view_own',
    'evidence.intake', // SFD penjaga loket boleh mencatat serah terima
    'evidence.upload', // unggah hasil akuisisi
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
  // Kredensial valid tapi OTP belum diverifikasi — user BELUM terautentikasi
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Mock login: kredensial valid -> tunggu verifikasi OTP (belum terautentikasi)
    const foundUser = mockUsers.find((u) => u.email === email) || mockUsers[0];
    setPendingUser(foundUser);
    return true;
  }, []);

  const verifyOtp = useCallback(async (code: string): Promise<boolean> => {
    // Mock OTP: 6 digit apa pun diterima; user baru terautentikasi di sini
    if (!pendingUser || code.length !== 6) return false;
    setUser(pendingUser);
    setPendingUser(null);
    return true;
  }, [pendingUser]);

  const logout = useCallback(() => {
    setUser(null);
    setPendingUser(null);
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
        verifyOtp,
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
