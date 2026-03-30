'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Note } from '@/lib/types';
import { Button, Callout, Panel } from '@/components/Ui';
import { createNote, deleteNote, getNote, updateNote } from '@/lib/notesApi';

type Props = {
    activeId?: string | number;
    onSaved: (note: Note) => void;
    onDeleted: (id: string | number) => void;
};

/**
 * PUBLIC_INTERFACE
 * Note editor for create/edit/delete.
 */
export function NoteEditor({ activeId, onSaved, onDeleted }: Props) {
    const [loadedNote, setLoadedNote] = useState<Note | null>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const mode = activeId ? 'edit' : 'create';

    const tagNames = useMemo(() => {
        return tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
    }, [tagsInput]);

    useEffect(() => {
        setSuccess(null);
    }, [activeId]);

    useEffect(() => {
        async function load() {
            if (!activeId) {
                setLoadedNote(null);
                setTitle('');
                setContent('');
                setTagsInput('');
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const n = await getNote(activeId);
                setLoadedNote(n);
                setTitle(n.title || '');
                setContent(n.content || '');
                const tags = (n.tags || []).map((t) => t.name).join(', ');
                setTagsInput(tags);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load note.');
            } finally {
                setIsLoading(false);
            }
        }

        void load();
    }, [activeId]);

    async function onSave() {
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const payload = {
                title: title.trim() || 'Untitled',
                content,
                tag_names: tagNames,
            };
            const saved =
                mode === 'create' ? await createNote(payload) : await updateNote(activeId as string | number, payload);
            setSuccess(mode === 'create' ? 'Created.' : 'Saved.');
            onSaved(saved);
            if (mode === 'create') {
                // After create, keep editor showing new content but switch to edit mode by rehydrating from saved.
                setLoadedNote(saved);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed.');
        } finally {
            setIsSaving(false);
        }
    }

    async function onDelete() {
        if (!activeId) return;
        const ok = confirm('Delete this note?');
        if (!ok) return;

        setIsDeleting(true);
        setError(null);
        setSuccess(null);
        try {
            await deleteNote(activeId);
            onDeleted(activeId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed.');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Panel
            title={mode === 'create' ? 'Create Note' : 'Edit Note'}
            right={
                <span className="badge">
                    {isLoading ? 'Loading…' : loadedNote?.id ? `ID: ${loadedNote.id}` : 'New'}
                </span>
            }
        >
            {error ? <Callout variant="error">{error}</Callout> : null}
            {success ? <Callout variant="success">{success}</Callout> : null}
            {isLoading ? <Callout>Loading…</Callout> : null}

            <div style={{ height: 12 }} />
            <div>
                <div className="fieldLabel">Title</div>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div style={{ height: 12 }} />
            <div>
                <div className="fieldLabel">Tags (comma-separated)</div>
                <input
                    className="input"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="work, ideas, recipes"
                />
            </div>
            <div style={{ height: 12 }} />
            <div>
                <div className="fieldLabel">Content</div>
                <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            <div style={{ height: 14 }} />
            <div className="rowWrap">
                <Button variant="primary" disabled={isSaving || isDeleting} onClick={() => void onSave()}>
                    {isSaving ? 'Saving…' : 'Save'}
                </Button>
                <Button disabled={isSaving || isDeleting} onClick={() => {
                    setTitle('');
                    setContent('');
                    setTagsInput('');
                    setSuccess(null);
                    setError(null);
                }}>
                    Clear
                </Button>
                {mode === 'edit' ? (
                    <Button variant="danger" disabled={isSaving || isDeleting} onClick={() => void onDelete()}>
                        {isDeleting ? 'Deleting…' : 'Delete'}
                    </Button>
                ) : null}
            </div>

            <div className="helpText">
                Tags on this note: <span className="mono">{tagNames.length ? tagNames.map((t) => `#${t}`).join(' ') : '—'}</span>
            </div>
        </Panel>
    );
}
