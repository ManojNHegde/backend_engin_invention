// CnC (communication and collaboration): every message the work sent, and to whom.
// Read from the Approval Log: an entry with `to` is a message. Nothing new is stored.
// One thread per work item (or "My rules"), newest first.

import type { ActorKey, LogEntry, TaskId } from '../domain/types';
import { ACTORS, type Actor } from './actors';
import type { AppState } from './appStore';
import type { NavTarget } from './navigation';

export interface CncMessage {
  id: string;
  at: string;
  from: Actor;
  to: Actor[];
  cc: Actor[];
  /** Sent by me (Teja), or received / copied to me. */
  mine: boolean;
  title: string;
  text?: string;
  task: TaskId | 'Rules' | '—';
  thread: string;
  link?: NavTarget;
}

export interface CncThread {
  key: string;
  title: string;
  subtitle: string;
  messages: CncMessage[];
  last: string;
  people: Actor[];
}

const toActors = (keys?: ActorKey[]) => (keys ?? []).map((k) => ACTORS[k]);

function toMessage(s: AppState, e: LogEntry): CncMessage | null {
  if (e.outcome !== 'OK' || !e.to?.length) return null;
  const thread = e.itemId ?? (e.task === 'Rules' ? 'My rules' : e.entity);
  const item = e.itemId ? s.work.find((w) => w.id === e.itemId) : undefined;
  return {
    id: e.id,
    at: e.at,
    from: ACTORS[e.actor],
    to: toActors(e.to),
    cc: toActors(e.cc),
    mine: e.actor === 'teja',
    title: e.action,
    text: e.detail,
    task: e.task ?? '—',
    thread,
    link: item ? { tab: 'tasks', screen: item.task, id: item.id } : e.task === 'Rules' ? { tab: 'rules', id: e.entity.split(' / ')[1] ?? null } : undefined,
  };
}

export function cncMessages(s: AppState): CncMessage[] {
  return s.log.map((e) => toMessage(s, e)).filter((x): x is CncMessage => !!x);
}

export function cncThreads(s: AppState, messages = cncMessages(s)): CncThread[] {
  const map = new Map<string, CncMessage[]>();
  messages.forEach((m) => map.set(m.thread, [...(map.get(m.thread) ?? []), m]));
  return [...map.entries()]
    .map(([key, list]) => {
      const msgs = [...list].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : a.id < b.id ? -1 : 1));
      const item = s.work.find((w) => w.id === key);
      const people = new Map<string, Actor>();
      msgs.forEach((m) => [m.from, ...m.to, ...m.cc].forEach((p) => p.key !== 'teja' && people.set(p.key, p)));
      return {
        key,
        title: item ? `${item.id} · ${item.title}` : key,
        subtitle: item ? `${item.task} · ${item.partyName}` : key === 'My rules' ? 'Rules' : '',
        messages: msgs,
        last: msgs[msgs.length - 1].at,
        people: [...people.values()],
      };
    })
    .sort((a, b) => (a.last < b.last ? 1 : -1));
}

/** Who my work sent messages to, and how many. */
export function sentTo(messages: CncMessage[]): { person: Actor; count: number }[] {
  const counts = new Map<string, { person: Actor; count: number }>();
  messages
    .filter((m) => m.mine)
    .forEach((m) => [...m.to, ...m.cc].forEach((p) => counts.set(p.key, { person: p, count: (counts.get(p.key)?.count ?? 0) + 1 })));
  return [...counts.values()].sort((a, b) => b.count - a.count);
}

/** The messages about one item, for the conversation panel on its task screen. */
export const messagesAbout = (s: AppState, itemId: string) => cncMessages(s).filter((m) => m.thread === itemId).sort((a, b) => (a.at < b.at ? -1 : 1));
