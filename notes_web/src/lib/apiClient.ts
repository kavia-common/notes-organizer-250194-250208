import { API_BASE_URL } from '@/lib/config';
import { getAuthToken } from '@/lib/auth';

/**
 * Standard API error object.
 */
export class ApiError extends Error {
    status: number;
    details?: unknown;

    /**
     * @param {string} message Error message.
     * @param {number} status HTTP status.
     * @param {unknown=} details Optional response body.
     */
    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

/**
 * PUBLIC_INTERFACE
 * Fetch wrapper that adds Authorization header and surfaces errors consistently.
 * @param {string} path API path starting with `/`.
 * @param {RequestInit=} init Fetch init.
 * @return {Promise<T>} Parsed JSON response.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers = new Headers(init.headers);

    if (!headers.has('Content-Type') && init.body) {
        headers.set('Content-Type', 'application/json');
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
        const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);
        const message = (body && (body.detail || body.message)) ? (body.detail || body.message) : response.statusText;
        throw new ApiError(String(message || 'Request failed'), response.status, body);
    }

    if (response.status === 204) {
        return undefined as unknown as T;
    }

    if (isJson) {
        return (await response.json()) as T;
    }
    return (await response.text()) as unknown as T;
}
