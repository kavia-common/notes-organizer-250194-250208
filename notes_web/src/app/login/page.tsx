'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Button, Callout, Panel } from '@/components/Ui';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login(email.trim(), password);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="appShell">
            <header className="topBar">
                <div className="topBarInner">
                    <div className="brand">
                        <div className="brandTitle">Retro Notes</div>
                        <div className="brandSubtitle">Sign in to sync your notes</div>
                    </div>
                </div>
            </header>

            <div className="container">
                <Panel
                    title="Login"
                    right={
                        <Link className="small" href="/register">
                            Need an account?
                        </Link>
                    }
                >
                    <form onSubmit={onSubmit}>
                        {error ? <Callout variant="error">{error}</Callout> : null}
                        <div style={{ height: 12 }} />
                        <div>
                            <div className="fieldLabel">Email</div>
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div style={{ height: 12 }} />
                        <div>
                            <div className="fieldLabel">Password</div>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <div style={{ height: 14 }} />
                        <div className="rowWrap">
                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {isLoading ? 'Signing in…' : 'Sign in'}
                            </Button>
                            <Link className="small" href="/">
                                Back
                            </Link>
                        </div>
                        <div className="helpText">
                            API base: <span className="mono">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}</span>
                        </div>
                    </form>
                </Panel>
            </div>
        </main>
    );
}
