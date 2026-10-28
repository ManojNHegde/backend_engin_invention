// Tasks page: for now only "Create a vendor", built from scratch.
// The other 22 tasks and their generic task screen are left in the app but not shown here.
// Earlier screens kept beside it: ../t7/ (vendor finance fields) and ../t17/ (vendor Udyam data).

import { CreateVendorScreen } from '../vendor-create/CreateVendorScreen';

export function TasksTab() {
  return <CreateVendorScreen />;
}
