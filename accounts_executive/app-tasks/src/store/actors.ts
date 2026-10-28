// People in the scenario (Full scenario §2 "People"). "me" is the signed-in user of this position app.

import type { ActorKey } from '../domain/types';

export interface Actor {
  key: ActorKey;
  name: string;
  role: string;
  roleId: string;
  place: string;
}

export const ACTORS: Record<ActorKey, Actor> = {
  teja: { key: 'teja', name: 'Teja', role: 'Accounts Executive', roleId: 'R01', place: 'HQ' },
  rajan: { key: 'rajan', name: 'Rajan', role: 'Accounts Manager', roleId: 'R02', place: 'HQ' },
  usha: { key: 'usha', name: 'Usha', role: 'Finance Controller', roleId: 'R-FC01', place: 'HQ' },
  venkat: { key: 'venkat', name: 'Venkat', role: 'Compliance Officer', roleId: 'R24', place: 'HQ' },
  sunil: { key: 'sunil', name: 'Sunil', role: 'Payables Executive', roleId: 'R-AP01', place: 'HQ' },
  ravi: { key: 'ravi', name: 'Ravi', role: 'Procurement Officer', roleId: 'R-P01', place: 'KA-01' },
  suresh: { key: 'suresh', name: 'Suresh', role: 'Stores / Inventory Officer', roleId: 'R-P02', place: 'KA-RM' },
  kiran: { key: 'kiran', name: 'Kiran', role: 'Contracts & Services Procurement Officer', roleId: 'R-P03', place: 'KA-01' },
  farid: { key: 'farid', name: 'Farid', role: 'Credit Controller', roleId: 'R-S03', place: 'HQ' },
  arun: { key: 'arun', name: 'Arun', role: 'Sales Executive', roleId: 'R-S01', place: 'KA-01' },
  pooja: { key: 'pooja', name: 'Pooja', role: 'Billing Executive', roleId: 'R-B01', place: 'HQ' },
  hema: { key: 'hema', name: 'Hema', role: 'Collections / Receivables Officer', roleId: 'R-S05', place: 'HQ' },
  anand: { key: 'anand', name: 'Anand', role: 'Inventory Controller', roleId: 'R-P06', place: 'HQ' },
  system: { key: 'system', name: 'System', role: 'Aikyat', roleId: '—', place: 'HQ' },
  calendar: { key: 'calendar', name: 'Calendar', role: 'Month end', roleId: '—', place: 'HQ' },
  vendor: { key: 'vendor', name: 'Vendor', role: 'Outside party', roleId: '—', place: '—' },
};

export const ME = ACTORS.teja;

export const who = (k: ActorKey) => `${ACTORS[k].name} (${ACTORS[k].role})`;
