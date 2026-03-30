'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/lib/auth';
import { apiFetch } from '@/lib/apiClient';
import type { AuthResponse } from '@/lib/types';

type AuthContextValue = {
    token?: string;
    isAuthed: boolean;
    isHydrating: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * Global auth provider for client components.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | undefined>(undefined);
    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        setTokenState(getAuthToken());
        setIsHydrating(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        // Backend contract may differ; try common shapes.
        const res = await apiFetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (!res?.access_token) {
            throw new Error('Login succeeded but no token returned.');
        }
        setAuthToken(res.access_token);
        setTokenState(res.access_token);
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        // Backend contract may differ; common route used.
        await apiFetch<unknown>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        // Auto-login after register for smoother UX.
        await login(email, password);
    }, [login]);

    function logout() {
        clearAuthToken();
        setTokenState(undefined);
    }

    const value = useMemo<AuthContextValue>(() => {
        return {
            token,
            isAuthed: Boolean(token),
            isHydrating,
            login,
            register,
            logout,
        };
    }, [token, isHydrating, login, register]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Access auth state/actions.
 */
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within <AuthProvider>.');
    }
    return ctx;
}
