'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Tag } from '@/lib/types';
import { createTag, deleteTag, listTags } from '@/lib/notesApi';
import { Button, Callout, Panel, Pill } from '@/components/Ui';

type Props = {
    activeTag?: string;
    onSelectTag: (tag?: string) => void;
};

/**
 * PUBLIC_INTERFACE
 * Sidebar with tag filters and tag management.
 */
export function Sidebar({ activeTag, onSelectTag }: Props) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newTag, setNewTag] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    async function refresh() {
        setIsLoading(true);
        setError(null);
        try {
            const res = await listTags();
            setTags(res || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tags.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void refresh();
    }, []);

    const tagNames = useMemo(() => {
        return tags.map((t) => t.name);
    }, [tags]);

    async function onAddTag() {
        const name = newTag.trim();
        if (!name) return;

        setIsAdding(true);
        setError(null);
        try {
            await createTag(name);
            setNewTag('');
            await refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create tag.');
        } finally {
            setIsAdding(false);
        }
    }

    async function onDeleteTag(tag: Tag) {
        const ok = confirm(`Delete tag "${tag.name}"? This will not delete notes.`);
        if (!ok) return;

        setError(null);
        try {
            await deleteTag(tag.id);
            if (activeTag === tag.name) {
                onSelectTag(undefined);
            }
            await refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete tag.');
        }
    }

    return (
        <Panel
            title="Tags & Filters"
            right={<span className="badge">{isLoading ? 'Loading…' : `${tags.length}`}</span>}
        >
            {error ? <Callout variant="error">{error}</Callout> : null}
            <div className="rowWrap">
                <Pill active={!activeTag} onClick={() => onSelectTag(undefined)}>
                    All notes
                </Pill>
                {tagNames.map((name) => (
                    <Pill key={name} active={activeTag === name} onClick={() => onSelectTag(name)}>
                        #{name}
                    </Pill>
                ))}
            </div>

            <hr className="hr" style={{ margin: '14px 0' }} />

            <div>
                <div className="fieldLabel">Create tag</div>
                <div className="rowWrap">
                    <input
                        className="input"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="e.g. work, recipes, ideas"
                    />
                    <Button variant="primary" disabled={isAdding} onClick={onAddTag}>
                        {isAdding ? 'Adding…' : 'Add'}
                    </Button>
                </div>
                <div className="helpText">Tip: tags are used for filtering and quick organization.</div>
            </div>

            <hr className="hr" style={{ margin: '14px 0' }} />

            <div className="small">Manage</div>
            <div style={{ height: 10 }} />
            <div className="rowWrap">
                {tags.length === 0 ? <span className="small">No tags yet.</span> : null}
                {tags.map((t) => (
                    <span key={String(t.id)} className="pill">
                        <span className="mono">#{t.name}</span>
                        <button className="btn btnGhost" type="button" onClick={() => void onDeleteTag(t)}>
                            Delete
                        </button>
                    </span>
                ))}
            </div>
        </Panel>
    );
}
