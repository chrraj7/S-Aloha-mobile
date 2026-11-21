import { api } from './api';

export type SessionUser = { username: string; displayName: string; role: string };
export type Incident = {
  id: number;
  reference?: string | null;
  title?: string | null;
  priority?: string | null;
  status?: string | null;
  affectedService?: string | null;
};

async function request<T>(path: string, token?: string, init?: RequestInit): Promise<T> {
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
    throw new Error(`Unable to reach the API (${API_URL}). Check the address and network.`);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message || `API error (${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token?: string; username: string; displayName: string; role: string }>('/auth/login', undefined, {
      method: 'POST',
      body: JSON.stringify({ username, password, returnToken: true }),
    }).then((result) => {
      if (!result.token) throw new Error('The API did not return a session token.');
      return { ...result, token: result.token };
    }),
  me: async () => {
    const token = await import('./session').then((session) => session.getToken());
    if (!token) throw new Error('Session expired.');
    return request<SessionUser>('/auth/me', token);
  },
  incidents: async () => {
    const token = await import('./session').then((session) => session.getToken());
    if (!token) throw new Error('Session expired.');
    return request<Incident[]>('/incidents', token);
  },
  logout: async () => {
    const token = await import('./session').then((session) => session.getToken());
    if (token) await request<void>('/auth/logout', token, { method: 'POST' });
  },
};

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const API_URL = (configuredUrl || 'http://localhost:5000').replace(/\/$/, '');
