const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const API_URL = (configuredUrl || 'http://localhost:5000').replace(/\/$/, '');

export type SessionUser = { username: string; displayName: string; role: string };
export type Incident = {
  id: number;
  reference?: string | null;
  title?: string | null;
  priority?: string | null;
  status?: string | null;
  affectedService?: string | null;
};

type LoginResponse = { token?: string; username: string; displayName: string; role: string };

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
    throw new Error(`Impossible de joindre l’API (${API_URL}). Vérifiez l’adresse et le réseau.`);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message || `Erreur API (${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  login: (username: string, password: string) =>
    request<LoginResponse>('/auth/login', undefined, {
      method: 'POST',
      body: JSON.stringify({ username, password, returnToken: true }),
    }).then((result) => {
      if (!result.token) throw new Error('L’API n’a pas renvoyé de jeton de session.');
      return { ...result, token: result.token } as LoginResponse & { token: string };
    }),
  me: async () => {
    const token = await import('./session').then((session) => session.getToken());
    if (!token) throw new Error('Session expirée.');
    return request<SessionUser>('/auth/me', token);
  },
  incidents: async () => {
    const token = await import('./session').then((session) => session.getToken());
    if (!token) throw new Error('Session expirée.');
    return request<Incident[]>('/incidents', token);
  },
  logout: async () => {
    const token = await import('./session').then((session) => session.getToken());
    if (token) await request<void>('/auth/logout', token, { method: 'POST' });
  },
};
