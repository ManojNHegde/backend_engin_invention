// CnC page (communication and collaboration): every message my work sent, and to whom, plus what came to me.
// Read-only: messages are sent by the tasks themselves (sent for checking, a flag to Billing, a tax request …).
// Top: who my work went to, with counts (pick a person to filter). Below: one thread per document.

import { useState } from 'react';
import { ArrowRight, MessagesSquare, Send } from 'lucide-react';
import { fmtDateTime, relTime } from '../../domain/dates';
import type { Actor } from '../../store/actors';
import { useApp } from '../../store/appStore';
import { cncMessages, cncThreads, sentTo, type CncMessage } from '../../store/cnc';
import { Button, DetailPane, EmptyState, ListGroup, ListItem, MasterDetail, PageHeader, SegmentedControl } from '../../ui';
import { DetailHead } from '../components/DetailHead';
import '../cnc/cnc.css';

type Filter = 'all' | 'sent' | 'received';

const initial = (a: Actor) => a.name[0];
const who = (a: Actor) => `${a.name} (${a.role})`;

export function CnCTab() {
  const s = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [person, setPerson] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const all = cncMessages(s);
  const counts = sentTo(all);
  const shown = all.filter((m) => (filter === 'all' || (filter === 'sent') === m.mine) && (!person || [m.from, ...m.to, ...m.cc].some((p) => p.key === person)));
  const threads = cncThreads(s, shown);
  const thread = threads.find((t) => t.key === picked) ?? threads[0];
  const sentCount = all.filter((m) => m.mine).length;

  return (
    <div className="cnc-page screen-fill">
      <PageHeader
        title="Communication and collaboration"
        subtitle="Everything your tasks sent, and to whom, with what came back. Messages are sent by the tasks; nothing is typed here."
        actions={
          <SegmentedControl<Filter>
            label="Show"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: `All (${all.length})` },
              { value: 'sent', label: `Sent by me (${sentCount})` },
              { value: 'received', label: `To me (${all.length - sentCount})` },
            ]}
          />
        }
      />

      <section className="cnc-sent" aria-label="Sent to">
        <span className="cnc-sent__label">
          <Send size={14} aria-hidden /> Sent to
        </span>
        {counts.length === 0 && <span className="cnc-sent__none">Nobody yet. Messages appear as you send work for checking.</span>}
        {counts.map(({ person: p, count }) => (
          <button key={p.key} className={`cnc-person${person === p.key ? ' is-active' : ''}`} onClick={() => setPerson(person === p.key ? null : p.key)} aria-pressed={person === p.key} title={`Show only messages with ${who(p)}`}>
            <span className="cnc-avatar">{initial(p)}</span>
            <span className="cnc-person__text">
              <b>{p.name}</b>
              <small>{p.role}</small>
            </span>
            <span className="cnc-person__count">{count}</span>
          </button>
        ))}
      </section>

      {threads.length === 0 ? (
        <EmptyState icon={MessagesSquare} title="No messages" text={person ? 'Nothing with this person for this filter.' : 'Messages appear here as the tasks send them.'} />
      ) : (
        <MasterDetail
          list={
            <ListGroup title="Conversations" count={threads.length}>
              {threads.map((t) => (
                <ListItem
                  key={t.key}
                  selected={t.key === thread?.key}
                  onClick={() => setPicked(t.key)}
                  title={t.title}
                  subtitle={t.messages[t.messages.length - 1].title}
                  meta={`${t.messages.length} message${t.messages.length === 1 ? '' : 's'} · ${t.people.map((p) => p.name).join(', ')}`}
                  right={<span className="cnc-time">{relTime(t.last, s.now)}</span>}
                />
              ))}
            </ListGroup>
          }
          detail={
            thread && (
              <DetailPane header={<DetailHead eyebrow={`${thread.subtitle ? `${thread.subtitle} · ` : ''}${thread.messages.length} message${thread.messages.length === 1 ? '' : 's'}`} title={thread.title} />}>
                <ol className="cnc-thread">
                  {thread.messages.map((m) => (
                    <Message key={m.id} m={m} />
                  ))}
                </ol>
              </DetailPane>
            )
          }
        />
      )}
    </div>
  );
}

function Message({ m }: { m: CncMessage }) {
  const s = useApp();
  return (
    <li className={`cnc-msg${m.mine ? ' is-mine' : ''}`}>
      <span className="cnc-avatar">{initial(m.from)}</span>
      <div className="cnc-msg__body">
        <div className="cnc-msg__route">
          <b>{m.mine ? 'You' : m.from.name}</b>
          <ArrowRight size={13} aria-hidden />
          <span>{m.to.map((p) => (p.key === 'teja' ? 'You' : who(p))).join(', ')}</span>
          {m.cc.length > 0 && <span className="cnc-msg__cc">· told: {m.cc.map((p) => (p.key === 'teja' ? 'you' : p.name)).join(', ')}</span>}
          <span className="cnc-msg__task">{m.task}</span>
        </div>
        <p className="cnc-msg__title">{m.title}</p>
        {m.text && <p className="cnc-msg__text">"{m.text}"</p>}
        <div className="cnc-msg__foot">
          <span>{fmtDateTime(m.at)}</span>
          {m.link && (
            <Button size="sm" variant="ghost" onClick={() => s.navigate(m.link!)}>
              Open {m.task === 'Rules' ? 'rule' : m.task}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
