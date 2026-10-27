import { BadgeAlert, Clock, Inbox, Plus, UserCheck } from 'lucide-react';
import { fmtDateTime, relTime } from '../../domain/dates';
import { Button, Callout, EmptyState, KpiCard, ListItem, PageHeader, Tile, TileGrid } from '../../ui';
import { ACTORS, ME, SIDE_LABEL, who } from '../catalogue';
import { isMine, isWithOthers, titleOf, useOnboarding } from '../store';

const FLOW = [
  { who: 'Procurement / Sales', where: 'On paper', what: 'Fill a vendor / customer form and hand it to you, with copies of the GST certificate, PAN and cancelled cheque' },
  { who: 'You', where: 'This app', what: 'New → type everything from the form: party details and finance details. Check the GSTIN on the portal, run the penny-drop' },
  { who: 'System', where: 'Finance backend', what: 'Works out state, constitution, header, 43B(h); finds the party if it is already in the master; stops what is wrong' },
  { who: 'Checkers', where: 'Their apps', what: 'Rajan: terms · Usha: bank · Farid: credit limit · Venkat: tax tagging' },
  { who: 'System', where: 'Finance backend', what: 'Creates the party in the party master (or adds a role), then the account under its header: active' },
];

export function DashboardScreen() {
  const s = useOnboarding();
  const mine = s.requests.filter(isMine);
  const others = s.requests.filter(isWithOthers);
  const active = s.requests.filter((r) => r.status === 'active');
  const noUdyam = s.accounts.filter((a) => a.side === 'payable' && (a.msme === 'unknown' || (a.msme === 'yes' && !a.udyam)));

  return (
    <div className="dash-wrap">
      <div className="ob-dash">
        <PageHeader title={`Good morning, ${ACTORS[ME].name}`} subtitle="This mock holds one task only: setting up new vendors and customers from the paper forms Procurement and Sales hand you." actions={<Button variant="primary" icon={Plus} onClick={() => s.navigate('onboarding')}>Open Onboarding</Button>} />
        <TileGrid>
          <div className="ob-kpis">
            <KpiCard icon={Inbox} label="Needs me" value={mine.length} context="Forms you are typing in, or returned" status={mine.length ? { tone: 'warning', label: 'Open' } : undefined} onClick={() => s.navigate('onboarding', mine[0]?.id ?? null)} />
            <KpiCard icon={Clock} label="With checkers" value={others.length} context="Waiting on Rajan, Usha, Farid or Venkat" onClick={() => s.navigate('onboarding', others[0]?.id ?? null)} />
            <KpiCard icon={UserCheck} label="Activated" value={active.length} context="In this walkthrough" onClick={() => s.navigate('parties')} />
            <KpiCard icon={BadgeAlert} label="Vendors without Udyam" value={noUdyam.length} context={noUdyam.map((a) => a.name).join(', ') || 'None'} status={noUdyam.length ? { tone: 'warning', label: '45-day rule unclear' } : undefined} onClick={() => s.navigate('parties')} />
          </div>

          <Tile title="Needs me" subtitle="Open one to complete it" span={6}>
            {mine.length === 0 ? (
              <EmptyState title="Nothing open" text='A form on your desk? Open Onboarding and press "New from a paper form".' />
            ) : (
              <div className="ob-list">
                {mine.map((r) => {
                  return (
                    <ListItem
                      key={r.id}
                      tone={r.status === 'returned' ? 'critical' : 'warning'}
                      title={`New ${SIDE_LABEL[r.side].toLowerCase()} · ${titleOf(r)}`}
                      subtitle={r.status === 'returned' ? `Returned · ${r.returnedReason}` : `Form ${r.formNo} from ${who(r.from)}`}
                      meta={`Opened ${relTime(r.arrivedAt, s.now)}`}
                      onClick={() => s.navigate('onboarding', r.id)}
                    />
                  );
                })}
              </div>
            )}
          </Tile>

          <Tile title="Recent" subtitle="Same as the bell" span={6}>
            <div className="ob-list">
              {s.notices.slice(0, 5).map((n) => (
                <ListItem key={n.id} tone={n.tone} title={n.title} subtitle={n.body} meta={fmtDateTime(n.at)} onClick={() => s.openNotice(n.id)} />
              ))}
            </div>
          </Tile>

          <Tile title="How a new vendor or customer reaches you" subtitle="Nothing arrives in the system from Procurement or Sales: you type the whole form in. Rajan checks the party details against the scanned form." span={12}>
            <ol className="ob-flow">
              {FLOW.map((f, i) => (
                <li key={i} className={`ob-flow__step${f.who === 'You' ? ' is-you' : ''}`}>
                  <span className="ob-flow__n">{i + 1}</span>
                  <span className="ob-flow__who">{f.who}</span>
                  <span className="ob-flow__where">{f.where}</span>
                  <span className="ob-flow__what">{f.what}</span>
                </li>
              ))}
            </ol>
            <Callout tone="info" title="No group ledger to pick">
              The account sits under a header (for example Trade Payables › Goods). The category you choose decides which header. You never create a header: after go-live the Accounts Manager owns the chart of accounts.
            </Callout>
          </Tile>
        </TileGrid>
      </div>
    </div>
  );
}
