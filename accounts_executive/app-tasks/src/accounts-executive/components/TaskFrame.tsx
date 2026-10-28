import type { ReactNode } from 'react';
import type { TaskId } from '../../domain/types';
import { useApp } from '../../store/appStore';
import { AREAS } from '../../store/areas';
import { PageHeader } from '../../ui';
import { RESPONSIBILITIES, taskOf } from '../manifest';

/** Child screen of the Tasks page: back to Tasks + title, content fills the rest. */
export function TaskFrame({ code, actions, children }: { code: TaskId; actions?: ReactNode; children: ReactNode }) {
  const back = useApp((s) => s.back);
  const t = taskOf(code);
  const resp = RESPONSIBILITIES.find((r) => r.id === t.responsibility)!;
  const area = AREAS.find((a) => a.id === t.area)!;
  return (
    <div className="screen-fill">
      <PageHeader
        onBack={back}
        eyebrow={
          <>
            <span className="code-tag">{t.code}</span>
            <span>
              Tasks · {area.title} ({area.ref}) · {resp.id} {resp.title} · {t.cadence} · {t.type}
            </span>
          </>
        }
        title={t.title}
        subtitle={`${t.description} Checked by: ${t.checker}.`}
        actions={actions}
      />
      {children}
    </div>
  );
}
