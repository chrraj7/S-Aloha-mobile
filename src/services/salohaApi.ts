import * as SecureStore from 'expo-secure-store';
import {
  MOCK_CMDB,
  MOCK_NIS2,
  MOCK_NOTIFICATIONS,
  MOCK_PERIMETERS,
  MOCK_TICKETS,
} from '../data/mockData';
import {
  CmdbiItem,
  Nis2Control,
  NotificationItem,
  PerimeterItem,
  ServerConfig,
  Ticket,
  TicketStatus,
} from '../types/saloha';

const STORAGE_KEY = 'saloha_server_config_v1';

const DEFAULT_CONFIG: ServerConfig = {
  baseUrl: 'https://saloha.local/api',
  demoMode: true,
};

let localTicketsCache: Ticket[] = [...MOCK_TICKETS];
let localNotificationsCache: NotificationItem[] = [...MOCK_NOTIFICATIONS];

export async function getServerConfig(): Promise<ServerConfig> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveServerConfig(config: ServerConfig): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(config));
}

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchTickets(): Promise<Ticket[]> {
  const config = await getServerConfig();
  if (config.demoMode) {
    return localTicketsCache;
  }
  const cleanUrl = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${cleanUrl}/tickets`, {
    headers: buildHeaders(config.token),
  });
  if (!response.ok) {
    throw new Error(`Erreur API S-Aloha (${response.status})`);
  }
  return response.json();
}

export async function fetchTicketById(id: string): Promise<Ticket | undefined> {
  const tickets = await fetchTickets();
  return tickets.find((t) => t.id === id);
}

export async function createTicket(
  payload: Omit<Ticket, 'id' | 'reference' | 'updatedAt'>
): Promise<Ticket> {
  const config = await getServerConfig();
  if (config.demoMode) {
    const created: Ticket = {
      ...payload,
      id: `local-${Date.now()}`,
      reference: `INC-2026-${Math.floor(1100 + Math.random() * 899)}`,
      updatedAt: 'A l instant',
      comments: [],
    };
    localTicketsCache = [created, ...localTicketsCache];
    return created;
  }
  const cleanUrl = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${cleanUrl}/tickets`, {
    method: 'POST',
    headers: buildHeaders(config.token),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Impossible de creer le ticket (${response.status})`);
  }
  return response.json();
}

export async function updateTicketStatusAndComment(
  id: string,
  status: TicketStatus,
  commentText?: string,
  author = 'Technicien Mobile'
): Promise<Ticket | undefined> {
  const config = await getServerConfig();
  if (config.demoMode) {
    localTicketsCache = localTicketsCache.map((t) => {
      if (t.id !== id) return t;
      const nextComments = [...(t.comments ?? [])];
      if (commentText && commentText.trim()) {
        nextComments.push({
          id: `c-${Date.now()}`,
          author,
          body: commentText.trim(),
          createdAt: 'A l instant',
        });
      }
      return {
        ...t,
        status,
        updatedAt: 'A l instant',
        comments: nextComments,
      };
    });
    return localTicketsCache.find((t) => t.id === id);
  }
  const cleanUrl = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${cleanUrl}/tickets/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(config.token),
    body: JSON.stringify({ status, comment: commentText }),
  });
  if (!response.ok) {
    throw new Error(`Mise a jour ticket impossible (${response.status})`);
  }
  return response.json();
}

export async function fetchCmdbItems(): Promise<CmdbiItem[]> {
  const config = await getServerConfig();
  if (config.demoMode) {
    return MOCK_CMDB;
  }
  const cleanUrl = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${cleanUrl}/cmdb`, {
    headers: buildHeaders(config.token),
  });
  if (!response.ok) {
    throw new Error(`Erreur CMDB (${response.status})`);
  }
  return response.json();
}

export async function fetchNis2Controls(): Promise<Nis2Control[]> {
  const config = await getServerConfig();
  if (config.demoMode) {
    return MOCK_NIS2;
  }
  const cleanUrl = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${cleanUrl}/nis2/controls`, {
    headers: buildHeaders(config.token),
  });
  if (!response.ok) {
    throw new Error(`Erreur NIS 2 (${response.status})`);
  }
  return response.json();
}

export async function fetchPerimeters(): Promise<PerimeterItem[]> {
  const config = await getServerConfig();
  if (config.demoMode) {
    return MOCK_PERIMETERS;
  }
  const cleanUrl = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${cleanUrl}/perimeters`, {
    headers: buildHeaders(config.token),
  });
  if (!response.ok) {
    throw new Error(`Erreur perimetres (${response.status})`);
  }
  return response.json();
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const config = await getServerConfig();
  if (config.demoMode) {
    return localNotificationsCache;
  }
  const cleanUrl = config.baseUrl.replace(/\/+$/, '');
  const response = await fetch(`${cleanUrl}/notifications`, {
    headers: buildHeaders(config.token),
  });
  if (!response.ok) {
    throw new Error(`Erreur notifications (${response.status})`);
  }
  return response.json();
}

export async function markNotificationRead(id: string): Promise<void> {
  localNotificationsCache = localNotificationsCache.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
}
