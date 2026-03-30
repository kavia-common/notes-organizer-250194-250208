/**
 * Frontend domain types (kept flexible to tolerate backend evolution).
 */

export type AuthResponse = {
    access_token: string;
    token_type?: string;
};

export type Tag = {
    id: string | number;
    name: string;
};

export type Note = {
    id: string | number;
    title: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    tags?: Tag[];
    pinned?: boolean;
};
