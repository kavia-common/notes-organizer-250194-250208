import { apiFetch } from '@/lib/apiClient';
import type { Note, Tag } from '@/lib/types';

type ListNotesParams = {
    q?: string;
    tag?: string;
};

/**
 * Try multiple possible backend routes (since API spec not populated).
 * @param {string[]} paths Candidate paths.
 * @param {RequestInit} init Fetch init.
 */
async function tryPaths<T>(paths: string[], init: RequestInit): Promise<T> {
    let lastErr: unknown = null;
    for (const p of paths) {
        try {
            return await apiFetch<T>(p, init);
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Request failed.');
}

/**
 * PUBLIC_INTERFACE
 * List notes for current user.
 */
export async function listNotes(params: ListNotesParams): Promise<Note[]> {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.tag) sp.set('tag', params.tag);

    const qs = sp.toString() ? `?${sp.toString()}` : '';
    return await tryPaths<Note[]>(
        [`/notes${qs}`, `/api/notes${qs}`],
        { method: 'GET' },
    );
}

/**
 * PUBLIC_INTERFACE
 * Get a note by id.
 */
export async function getNote(id: string | number): Promise<Note> {
    return await tryPaths<Note>(
        [`/notes/${id}`, `/api/notes/${id}`],
        { method: 'GET' },
    );
}

/**
 * PUBLIC_INTERFACE
 * Create note.
 */
export async function createNote(payload: { title: string; content: string; tag_names?: string[] }): Promise<Note> {
    return await tryPaths<Note>(
        ['/notes', '/api/notes'],
        { method: 'POST', body: JSON.stringify(payload) },
    );
}

/**
 * PUBLIC_INTERFACE
 * Update note.
 */
export async function updateNote(
    id: string | number,
    payload: { title: string; content: string; tag_names?: string[] },
): Promise<Note> {
    return await tryPaths<Note>(
        [`/notes/${id}`, `/api/notes/${id}`],
        { method: 'PUT', body: JSON.stringify(payload) },
    );
}

/**
 * PUBLIC_INTERFACE
 * Delete note.
 */
export async function deleteNote(id: string | number): Promise<void> {
    await tryPaths<void>(
        [`/notes/${id}`, `/api/notes/${id}`],
        { method: 'DELETE' },
    );
}

/**
 * PUBLIC_INTERFACE
 * List tags.
 */
export async function listTags(): Promise<Tag[]> {
    return await tryPaths<Tag[]>(
        ['/tags', '/api/tags'],
        { method: 'GET' },
    );
}

/**
 * PUBLIC_INTERFACE
 * Create tag.
 */
export async function createTag(name: string): Promise<Tag> {
    return await tryPaths<Tag>(
        ['/tags', '/api/tags'],
        { method: 'POST', body: JSON.stringify({ name }) },
    );
}

/**
 * PUBLIC_INTERFACE
 * Delete tag.
 */
export async function deleteTag(id: string | number): Promise<void> {
    await tryPaths<void>(
        [`/tags/${id}`, `/api/tags/${id}`],
        { method: 'DELETE' },
    );
}
