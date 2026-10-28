// Action center: the desktop home for alerts. "Needs action" holds critical and warning items until the
// work is done (they resolve themselves when the item is sent); "Updates" holds outcomes from other roles.

import { useState } from 'react';
import { Check, Inbox } from 'lucide-react';
import { relTime } from '../../domain/dates';
import { useApp, type AppNotification } from '../../store/appStore';
import { Button, EmptyState, SegmentedControl, Tile, toneIcon } from '../../ui';

type Filter = 'action' | 'updates';

const needsAction = (n: AppNotification) => n.tone === 'critical' || n.tone === 'warning';
const SEVERITY: Record<AppNotification['tone'], number> = { critical: 0, warning: 1, info: 2, success: 3 };

export function ActionCenter() {
  const s = useApp();
  const [filter, setFilter] = useState<Filter>('action');
  const open = s.notifications.filter((n) => !n.dismissed);
  const action = open.filter(needsAction).sort((a, b) => SEVERITY[a.tone] - SEVERITY[b.tone] || (a.at < b.at ? 1 : -1));
  const updates = open.filter((n) => !needsAction(n)).sort((a, b) => (a.at < b.at ? 1 : -1));
  const list = filter === 'action' ? action : updates;

  return (
    <Tile
      span={4}
      flush
      title="Action center"
      subtitle="Work sent to you and outcomes from other roles"
      actions={
        <SegmentedControl<Filter>
          label="Filter alerts"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'action', label: `Needs action${action.length ? ` (${action.length})` : ''}` },
            { value: 'updates', label: `Updates${updates.length ? ` (${updates.length})` : ''}` },
          ]}
        />
      }
    >
      <div className="inbox">
        {list.length === 0 ? (
          <EmptyState
            icon={filter === 'action' ? Check : Inbox}
            title={filter === 'action' ? "You're all caught up" : 'No updates'}
            text={filter === 'action' ? 'Invoices, returns, new vendors and items, and anything a checker returns appear here.' : 'Approvals and other roles\' outcomes appear here.'}
          />
        ) : (
          list.map((n) => {
            const Icon = toneIcon[n.tone];
            return (
              <div key={n.id} className={`inbox__row inbox__row--${n.tone}${n.read ? '' : ' is-unread'}`}>
                <Icon size={18} className={`inbox__icon tone-${n.tone}`} aria-hidden />
                <div className="inbox__main">
                  <div className="inbox__top">
                    <span className="inbox__title">{n.title}</span>
                    <span className="inbox__time">{relTime(n.at, s.now)}</span>
                  </div>
                  <p className="inbox__body">{n.body}</p>
                  <div className="inbox__actions">
                    {n.link && (
                      <Button size="sm" variant={needsAction(n) ? 'primary' : 'secondary'} onClick={() => s.openNotification(n.id)}>
                        {needsAction(n) ? 'Open' : 'View'}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => s.dismissAlert(n.id)}>
                      {needsAction(n) ? 'Dismiss' : 'Mark done'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Tile>
  );
}
