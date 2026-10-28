// Tasks page: for now one task, "Create a vendor". The page lists it as a card; the card opens the form.
// The other 22 tasks and their generic task screen are left in the app but not shown here.
// Earlier screens kept beside it: ../vendor-create/CreateVendorScreen (list + form + checks),
// ../t7/ (vendor finance fields) and ../t17/ (vendor Udyam data).

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { ActionCard, PageHeader } from '../../ui';
import { CreateVendorForm } from '../vendor-create/CreateVendorForm';

export function TasksTab() {
  const [open, setOpen] = useState(false);
  if (open) return <CreateVendorForm onBack={() => setOpen(false)} />;
  return (
    <>
      <PageHeader title="Tasks" subtitle="Your tasks. Open one to start it." />
      <div className="card-grid">
        <div className="task-card">
          <ActionCard
            icon={UserPlus}
            accent="teal"
            title="Create a vendor"
            description="Type in the vendor form Procurement handed you, check the GSTIN and bank account, and send it for checking."
            code="Purchase"
            cadence="As needed · Make"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
    </>
  );
}
