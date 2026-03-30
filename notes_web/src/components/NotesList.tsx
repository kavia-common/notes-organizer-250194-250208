'use client';

import React from 'react';
import type { Note } from '@/lib/types';
import { Callout, Panel } from '@/components/Ui';

type Props = {
    notes: Note[];
    activeId?: string | number;
    isLoading: boolean;
    error?: string | null;
    query: string;
    onQueryChange: (v: string) => void;
    onSelect: (id: string | number) => void;
};

/**
 * PUBLIC_INTERFACE
 * List + search notes.
 */
export function NotesList({
    notes,
    activeId,
    isLoading,
    error,
    query,
    onQueryChange,
    onSelect,
}: Props) {
    return (
        <Panel title="Notes">
            <div>
                <div className="fieldLabel">Search</div>
                <input
                    className="input"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search by title/content…"
                />
            </div>

            <div style={{ height: 14 }} />
            {error ? <Callout variant="error">{error}</Callout> : null}
            {isLoading ? <Callout>Loading notes…</Callout> : null}

            {!isLoading && !error && notes.length === 0 ? (
                <Callout>No notes found. Create one to get started.</Callout>
            ) : null}

            <div style={{ height: 10 }} />
            <div className="noteList">
                {notes.map((n) => {
                    const active = String(activeId) === String(n.id);
                    const cls = ['noteItem', active ? 'noteItemActive' : ''].filter(Boolean).join(' ');
                    const tagText = (n.tags || []).map((t) => `#${t.name}`).join(' ');
                    return (
                        <div key={String(n.id)} className={cls} onClick={() => onSelect(n.id)}>
                            <div className="noteTitle">{n.title || '(Untitled)'}</div>
                            <div className="noteMeta">
                                <span className="mono">{tagText || '—'}</span>
                                {n.updated_at ? <span>Updated: {new Date(n.updated_at).toLocaleString()}</span> : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}
