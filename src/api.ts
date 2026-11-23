import { getToken } from './session';

export type SessionUser = { username: string; displayName: string; role: string };
export type Incident = {
  id: number;
  reference?: string | null;
  title?: string | null;
  priority?: string | null;
  status?: string | null;
  affectedService?: string | null;
};

/** Error returned by the S-Aloha API; `status` is 0 when the server could not be reached. */
export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const API_URL = (configuredUrl || 'http://localhost:8080').replace(/\/$/, '');

async function request<T>(path: string, token?: string | null, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-S-Aloha': '1',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(`Unable to reach the API (${API_URL}). Check the address and network.`, 0);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new ApiError(body.message || `API error (${response.status}).`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

/** Calls the API with the stored session token; no token is treated as an expired session. */
async function authorized<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken();
  if (!token) throw new ApiError('Session expired.', 401);
  return request<T>(path, token, init);
}

export const api = {
  login: async (username: string, password: string) => {
    const result = await request<SessionUser & { token?: string }>('/auth/login', null, {
      method: 'POST',
      body: JSON.stringify({ username, password, returnToken: true }),
    });
    if (!result.token) throw new ApiError('The API did not return a session token.', 0);
    return { ...result, token: result.token };
  },

  me: () => authorized<SessionUser>('/auth/me'),

  incidents: () => authorized<Incident[]>('/incidents'),

  logout: async () => {
    const token = await getToken();
    if (token) await request<void>('/auth/logout', token, { method: 'POST' });
  },
};
