import type { Period } from './period';

/** The report period is shared by every report, so switching reports keeps it. */
export interface ReportPeriodProps {
  period: Period;
  setPeriod: (p: Period) => void;
}
