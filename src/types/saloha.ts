export type TicketType = 'incident' | 'demande' | 'probleme' | 'changement';
export type TicketPriority = 'P1 - Critique' | 'P2 - Eleve' | 'P3 - Moyen' | 'P4 - Faible';
export type TicketStatus = 'Nouveau' | 'En cours' | 'En attente' | 'Resolu' | 'Clos';

export interface TicketComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  reference: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  perimeterId?: string;
  slaDeadline?: string;
  assignee?: string;
  ciName?: string;
  updatedAt: string;
  comments?: TicketComment[];
}

export interface CmdbiItem {
  id: string;
  name: string;
  category: 'Serveur' | 'Reseau' | 'Poste AD' | 'Application' | 'Stockage';
  environment: 'Production' | 'Preprod' | 'On-Prem';
  status: 'Operationnel' | 'Degrade' | 'Maintenance';
  ipOrHost: string;
}

export interface Nis2Control {
  id: string;
  code: string;
  label: string;
  domain: string;
  complianceScore: number;
  lastAudit: string;
}

export interface PerimeterItem {
  id: string;
  code: string;
  name: string;
  inService: boolean;
  criticality: 'Essentiel' | 'Important' | 'Standard';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ServerConfig {
  baseUrl: string;
  token?: string;
  activePerimeterId?: string;
  demoMode: boolean;
}
