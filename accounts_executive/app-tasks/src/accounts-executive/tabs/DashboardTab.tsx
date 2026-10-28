// Desktop dashboard (BI layout on a 12-column grid):
//   1. KPI strip (5 cards) — the answers first
//   2. My work by area (8) | Action center, with Suggestions under it (4)
//   3. Posted purchases: due dates (7) | My worklist + Month-end close (5)

import { CalendarCheck, CircleAlert, Hourglass, Inbox, Scale } from 'lucide-react';
import { fmtDateTime } from '../../domain/dates';
import { inr } from '../../domain/money';
import { useApp } from '../../store/appStore';
import { isMine, isWithOthers, monthEndStatus, routedVariances, workItems } from '../../store/selectors';
import { KpiCard, PageHeader, TileGrid } from '../../ui';
import { ActionCenter } from '../dashboard/ActionCenter';
import { Suggestions } from '../dashboard/Suggestions';
import { AreaBoard, MonthEndTile, PayablesWatch, WorklistTile } from '../dashboard/Tiles';
import '../dashboard/dashboard.css';

export function DashboardTab() {
  const s = useApp();
  const work = workItems(s);
  const mine = work.filter(isMine);
  const returned = work.filter((w) => w.status === 'Returned');
  const withOthers = work.filter(isWithOthers);
  const oldest = withOthers.reduce<string | null>((o, w) => (!o || (w.sentAt ?? w.arrivedAt) < o ? (w.sentAt ?? w.arrivedAt) : o), null);
  const variances = routedVariances(s);
  const close = monthEndStatus(s);
  const closeDone = close.filter((r) => r.state === 'approved' || r.state === 'with checker').length;

  return (
    <div className="dashboard">
      <PageHeader title="Dashboard" subtitle={`Purchase, inventory, sales and AR/AP accounting · as of ${fmtDateTime(s.now)}`} />

      <div className="kpi-strip">
        <KpiCard
          icon={Inbox}
          label="Waiting for you"
          value={mine.length}
          status={mine.length ? { tone: 'warning', label: `${mine.length} to post or send` } : { tone: 'success', label: 'Nothing waiting' }}
          context={mine.length ? mine.slice(0, 3).map((w) => w.id).join(', ') + (mine.length > 3 ? '…' : '') : 'Arrivals appear here'}
          onClick={() => s.openQueue('me')}
        />
        <KpiCard
          icon={CircleAlert}
          label="Returned to you"
          value={returned.length}
          status={returned.length ? { tone: 'critical', label: 'Correct and resend' } : undefined}
          context={returned.length ? returned.map((w) => w.id).join(', ') : 'Nothing returned by a checker'}
          onClick={() => s.openQueue('me')}
        />
        <KpiCard
          icon={Hourglass}
          label="With checkers"
          value={withOthers.length}
          status={withOthers.length ? { tone: 'info', label: 'Accounts Manager and others' } : undefined}
          context={oldest ? `Oldest sent ${fmtDateTime(oldest)}` : 'Nothing sent yet'}
          onClick={() => s.openQueue('others')}
        />
        <KpiCard
          icon={Scale}
          label="Match variances (Procurement)"
          value={inr(variances.reduce((a, x) => a + (x.f.match?.total ?? 0), 0))}
          status={variances.length ? { tone: 'warning', label: `${variances.length} voucher${variances.length > 1 ? 's' : ''}, raised by Ravi` } : undefined}
          context="PO · GRN · invoice differences, with reasons"
          onClick={() => s.navigate({ tab: 'reports', screen: 'purchase', id: null })}
        />
        <KpiCard
          icon={CalendarCheck}
          label="Month-end close"
          value={`${closeDone}/${close.length}`}
          progress={{ value: (closeDone / close.length) * 100, tone: closeDone === close.length ? 'success' : 'warning' }}
          context="Runs done or with a checker"
          onClick={() => s.navigate({ tab: 'reports', screen: 'close', id: null })}
        />
      </div>

      <TileGrid>
        <AreaBoard />
        <div className="tile-col tile-col--4">
          <ActionCenter />
          <Suggestions />
        </div>
        <PayablesWatch />
        <div className="tile-col">
          <WorklistTile />
          <MonthEndTile />
        </div>
      </TileGrid>
    </div>
  );
}
