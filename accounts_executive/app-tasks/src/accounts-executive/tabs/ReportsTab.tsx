// Reports tab: look back. Read-only, role-scoped.
// Two sections: party reports (one vendor or customer) and task registers (every document a task made).
// The period (incl. financial year and custom range) is shared across reports.

import { useState } from 'react';
import { dateOf } from '../../domain/dates';
import { useApp } from '../../store/appStore';
import { PageHeader, ReportCard } from '../../ui';
import { REPORTS, REPORT_SECTIONS } from '../manifest';
import { PartyLedger } from '../reports/PartyLedger';
import { RegisterReport } from '../reports/RegisterReport';
import { resolvePeriod, type Period } from '../reports/period';
import '../reports/reports.css';

export function ReportsTab() {
  const s = useApp();
  const [period, setPeriod] = useState<Period>({ key: 'fy' });
  const range = resolvePeriod(period, dateOf(s.now));
  const id = s.nav.reports.screen;

  if (!id) {
    return (
      <>
        <PageHeader title="Reports" subtitle="Look back at your accounting work. Read-only; corrections go through a task." />
        {REPORT_SECTIONS.map((sec) => (
          <section key={sec.id} className="report-section">
            <h2 className="report-section__title">{sec.title}</h2>
            <p className="report-section__desc">{sec.description}</p>
            <div className="card-grid">
              {REPORTS.filter((r) => r.section === sec.id).map((r) => (
                <ReportCard key={r.id} icon={r.icon} title={r.title} description={r.description} onClick={() => s.navigate({ tab: 'reports', screen: r.id, id: null })} />
              ))}
            </div>
          </section>
        ))}
      </>
    );
  }
  if (id === 'party') return <PartyLedger />;
  return <RegisterReport key={id} id={id} period={period} setPeriod={setPeriod} range={range} />;
}
