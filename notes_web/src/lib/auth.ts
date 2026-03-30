import Cookies from 'js-cookie';

const TOKEN_COOKIE = 'notes_token';

/**
 * PUBLIC_INTERFACE
 * Save JWT token for API usage.
 * @param {string} token JWT.
 */
export function setAuthToken(token: string) {
    Cookies.set(TOKEN_COOKIE, token, { sameSite: 'lax' });
}

/**
 * PUBLIC_INTERFACE
 * Read JWT token for API usage.
 * @return {string | undefined} JWT if present.
 */
export function getAuthToken(): string | undefined {
    return Cookies.get(TOKEN_COOKIE);
}

/**
 * PUBLIC_INTERFACE
 * Clear JWT token.
 */
export function clearAuthToken() {
    Cookies.remove(TOKEN_COOKIE);
}
