'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Button, Callout } from '@/components/Ui';
import { Sidebar } from '@/components/Sidebar';
import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { listNotes } from '@/lib/notesApi';
import type { Note } from '@/lib/types';

export default function HomePage() {
    const router = useRouter();
    const { isAuthed, isHydrating, logout } = useAuth();

    const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
    const [query, setQuery] = useState('');

    const [notes, setNotes] = useState<Note[]>([]);
    const [activeId, setActiveId] = useState<string | number | undefined>(undefined);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const visibleNotes = useMemo(() => {
        return notes;
    }, [notes]);

    async function refresh() {
        setIsLoading(true);
        setError(null);
        try {
            const res = await listNotes({ q: query.trim() || undefined, tag: activeTag });
            setNotes(res || []);
            if (activeId && !(res || []).some((n) => String(n.id) === String(activeId))) {
                setActiveId(undefined);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load notes.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isHydrating) return;
        if (!isAuthed) {
            router.push('/login');
            return;
        }
        void refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHydrating, isAuthed]);

    useEffect(() => {
        if (!isAuthed) return;
        const t = setTimeout(() => {
            void refresh();
        }, 250);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, activeTag, isAuthed]);

    if (isHydrating) {
        return (
            <main className="appShell">
                <header className="topBar">
                    <div className="topBarInner">
                        <div className="brand">
                            <div className="brandTitle">Retro Notes</div>
                            <div className="brandSubtitle">Hydrating…</div>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <Callout>Loading…</Callout>
                </div>
            </main>
        );
    }

    return (
        <main className="appShell">
            <header className="topBar">
                <div className="topBarInner">
                    <div className="brand">
                        <div className="brandTitle">Retro Notes</div>
                        <div className="brandSubtitle">Search, tag, edit — synced per user</div>
                    </div>
                    <div className="topBarActions">
                        <Button onClick={() => void refresh()} disabled={isLoading}>
                            {isLoading ? 'Refreshing…' : 'Refresh'}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                logout();
                                router.push('/login');
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container">
                {!isAuthed ? (
                    <Callout variant="error">
                        You are not logged in. <Link href="/login">Go to login</Link>.
                    </Callout>
                ) : null}

                <div className="mainGrid" style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Sidebar
                            activeTag={activeTag}
                            onSelectTag={(t) => {
                                setActiveTag(t);
                            }}
                        />
                        <NotesList
                            notes={visibleNotes}
                            activeId={activeId}
                            isLoading={isLoading}
                            error={error}
                            query={query}
                            onQueryChange={setQuery}
                            onSelect={(id) => setActiveId(id)}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Callout>
                            Tip: Create a note by leaving nothing selected (New mode). Select a note on the left to edit.
                        </Callout>
                        <NoteEditor
                            activeId={activeId}
                            onSaved={(saved) => {
                                // Update list optimistically.
                                setNotes((prev) => {
                                    const exists = prev.some((n) => String(n.id) === String(saved.id));
                                    if (!exists) return [saved, ...prev];
                                    return prev.map((n) => (String(n.id) === String(saved.id) ? saved : n));
                                });
                                setActiveId(saved.id);
                            }}
                            onDeleted={(id) => {
                                setNotes((prev) => prev.filter((n) => String(n.id) !== String(id)));
                                setActiveId(undefined);
                            }}
                        />
                    </div>
                </div>

                <div style={{ height: 16 }} />
                <div className="small">
                    Backend: <span className="mono">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}</span>
                </div>
            </div>
        </main>
    );
}
