'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Button, Callout, Panel } from '@/components/Ui';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await register(email.trim(), password);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed.');
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
                        <div className="brandSubtitle">Create your account</div>
                    </div>
                </div>
            </header>

            <div className="container">
                <Panel
                    title="Register"
                    right={
                        <Link className="small" href="/login">
                            Already have an account?
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
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div style={{ height: 12 }} />
                        <div>
                            <div className="fieldLabel">Confirm password</div>
                            <input
                                className="input"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div style={{ height: 14 }} />
                        <div className="rowWrap">
                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating…' : 'Create account'}
                            </Button>
                            <Link className="small" href="/">
                                Back
                            </Link>
                        </div>
                    </form>
                </Panel>
            </div>
        </main>
    );
}
