// Mock data for the onboarding walkthrough. Names follow the biscuit-plant scenario (Vendor H = Malnad Cocoa
// Traders, whose form Ravi handed over on 07-Oct). Party ids look like P-0107 here; in the backend they are uuids.
// Decided 27-Oct: parties do not arrive in the system. Ravi / Kiran / Arun hand over a PAPER form and the
// Accounts Executive types it in. PAPERS below is what is written on those forms.

import { follow } from './rules';
import type { Account, ActorKey, LogEntry, Notice, PaperForm, Party, Request, Side, Values } from './types';

export const START = '2026-10-07T11:05';

const party = (p: Partial<Party> & Pick<Party, 'partyId' | 'legalName'>): Party => ({
  kind: 'organization',
  pan: null,
  gstins: [],
  address: { line: '', city: 'Bengaluru', stateCode: 'KA', pincode: '560001', country: 'IN' },
  phones: [],
  roles: [],
  ...p,
});

const supplier = (since: string, formFrom: ActorKey = 'ravi'): Party['roles'][number] => ({ type: 'supplier', since, enteredBy: 'teja', formFrom });
const customer = (since: string, formFrom: ActorKey = 'arun'): Party['roles'][number] => ({ type: 'customer', since, enteredBy: 'teja', formFrom });

export const HEALTHY_BITE = party({
  partyId: 'P-0042',
  legalName: 'Healthy Bite Foods Pvt Ltd',
  tradeName: 'Healthy Bite Foods',
  pan: 'AABCH0000H',
  gstins: [{ value: '29AABCH0000H1Z3', stateCode: 'KA', status: 'active' }],
  address: { line: 'Plot 22, KIADB Industrial Area', city: 'Hosakote', stateCode: 'KA', pincode: '562114', country: 'IN' },
  contactPerson: 'Meena (accounts)',
  email: 'finance@healthybite.example',
  phones: ['+91 98860 00000', '+91 80 4000 0000'],
  roles: [customer('2025-04-01')],
});

/** A legacy row with the same PAN as Coastal Bakes: shows the "same PAN" warning. */
const COASTAL_LEGACY = party({ partyId: 'P-0088', legalName: 'Coastal Bakes & Confectioners', pan: 'AADCC0000C', address: { line: 'Kankanady', city: 'Mangaluru', stateCode: 'KA', pincode: '575002', country: 'IN' } });

const VENDORS: [string, string][] = [
  ['P-0011', 'Vendor A'],
  ['P-0012', 'Vendor B'],
  ['P-0013', 'Vendor C'],
  ['P-0014', 'Vendor D'],
  ['P-0015', 'Vendor E'],
  ['P-0016', 'Vendor F'],
  ['P-0017', 'Vendor G'],
  ['P-0019', 'Vendor J'],
  ['P-0021', 'Shakti Manpower'],
];
const CUSTOMERS: [string, string, string][] = [
  ['P-0031', 'Sri Lakshmi Distributors', 'KA'],
  ['P-0032', 'Chennai Retail Mart', 'TN'],
  ['P-0033', 'Gulf Snack Imports LLC', ''],
  ['P-0035', 'Namma Bakes', 'KA'],
  ['P-0036', 'Kerala Traders', 'KL'],
];

export function seedParties(): Party[] {
  return [
    HEALTHY_BITE,
    COASTAL_LEGACY,
    ...VENDORS.map(([id, name]) => party({ partyId: id, legalName: name, roles: [supplier('2024-04-01')] })),
    ...CUSTOMERS.map(([id, name, st]) =>
      party({
        partyId: id,
        legalName: name,
        ...(id === 'P-0031'
          ? { pan: 'AAKFS0000S', gstins: [{ value: '29AAKFS0000S1Z2', stateCode: 'KA', status: 'active' as const }], address: { line: 'Avenue Road', city: 'Bengaluru', stateCode: 'KA', pincode: '560002', country: 'IN' } }
          : { address: { line: '', city: '', stateCode: st, pincode: '', country: st ? 'IN' : 'AE' } }),
        roles: [customer('2024-04-01')],
      }),
    ),
  ];
}

const acc = (a: Partial<Account> & Pick<Account, 'accountId' | 'partyId' | 'side' | 'name' | 'under' | 'category'>): Account => ({
  creditDays: 30,
  creditLimit: null,
  msme: 'no',
  udyam: null,
  sec43bh: false,
  bankLast4: null,
  bankSince: null,
  activatedAt: '2024-04-01',
  ...a,
});

export function seedAccounts(): Account[] {
  return [
    acc({ accountId: 'ACC-2101', partyId: 'P-0011', side: 'payable', name: 'Vendor A', under: 'Trade Payables › Goods', category: 'goods_non_msme', creditDays: 30, bankAccountNo: '50100012345678', bankLast4: '5678', bankSince: '2024-04-01' }),
    acc({ accountId: 'ACC-2102', partyId: 'P-0012', side: 'payable', name: 'Vendor B', under: 'Trade Payables › Goods', category: 'goods_non_msme', creditDays: 45, bankAccountNo: '00112233445566', bankLast4: '5566', bankSince: '2024-04-01' }),
    acc({ accountId: 'ACC-2103', partyId: 'P-0013', side: 'payable', name: 'Vendor C', under: 'Trade Payables › Goods', category: 'goods_msme', creditDays: 45, msme: 'yes', msmeCategory: 'micro', udyam: 'UDYAM-KA-03-0012345', sec43bh: true, bankAccountNo: '3344556677', bankLast4: '6677', bankSince: '2025-02-10' }),
    acc({ accountId: 'ACC-2104', partyId: 'P-0014', side: 'payable', name: 'Vendor D', under: 'Trade Payables › Goods', category: 'goods_non_msme', creditDays: 30, bankAccountNo: '1029384756', bankLast4: '4756', bankSince: '2026-09-28' }),
    acc({ accountId: 'ACC-2105', partyId: 'P-0015', side: 'payable', name: 'Vendor E', under: 'Trade Payables › Goods', category: 'goods_msme', creditDays: 30, msme: 'yes', msmeCategory: 'small', udyam: 'UDYAM-KA-01-0045678', sec43bh: true, bankAccountNo: '5566778899', bankLast4: '8899', bankSince: '2024-04-01' }),
    acc({ accountId: 'ACC-2106', partyId: 'P-0016', side: 'payable', name: 'Vendor F', under: 'Trade Payables › Goods', category: 'goods_non_msme', creditDays: 60, bankAccountNo: '6677889900', bankLast4: '9900', bankSince: '2024-04-01' }),
    acc({ accountId: 'ACC-2107', partyId: 'P-0017', side: 'payable', name: 'Vendor G', under: 'Trade Payables › Goods', category: 'goods_msme', creditDays: 45, msme: 'yes', msmeCategory: 'micro', udyam: null, sec43bh: true, bankAccountNo: '7788990011', bankLast4: '0011', bankSince: '2024-04-01' }),
    acc({ accountId: 'ACC-2109', partyId: 'P-0019', side: 'payable', name: 'Vendor J', under: 'Trade Payables › Goods', category: 'goods_non_msme', creditDays: 30, msme: 'unknown', sec43bh: null, bankAccountNo: '8899001122', bankLast4: '1122', bankSince: '2024-04-01' }),
    acc({ accountId: 'ACC-2121', partyId: 'P-0021', side: 'payable', name: 'Shakti Manpower', under: 'Trade Payables › Services & Expenses', category: 'manpower_security', creditDays: 15, bankAccountNo: '9900112233', bankLast4: '2233', bankSince: '2025-06-01' }),
    acc({ accountId: 'ACC-1201', partyId: 'P-0031', side: 'receivable', name: 'Sri Lakshmi Distributors', under: 'Trade Receivables › Domestic', category: 'dealer_distributor', creditDays: 30, creditLimit: 15_00_000, msme: null, sec43bh: null }),
    acc({ accountId: 'ACC-1202', partyId: 'P-0032', side: 'receivable', name: 'Chennai Retail Mart', under: 'Trade Receivables › Domestic', category: 'domestic_b2b_regular', creditDays: 45, creditLimit: 10_00_000, msme: null, sec43bh: null }),
    acc({ accountId: 'ACC-1203', partyId: 'P-0033', side: 'receivable', name: 'Gulf Snack Imports LLC', under: 'Trade Receivables › Export & SEZ', category: 'export_goods', creditDays: null, creditLimit: null, msme: null, sec43bh: null }),
    acc({ accountId: 'ACC-1204', partyId: 'P-0042', side: 'receivable', name: 'Healthy Bite Foods', under: 'Trade Receivables › Domestic', category: 'domestic_b2b_regular', creditDays: 15, creditLimit: 3_00_000, msme: null, sec43bh: null, activatedAt: '2025-04-01' }),
    acc({ accountId: 'ACC-1205', partyId: 'P-0035', side: 'receivable', name: 'Namma Bakes', under: 'Trade Receivables › Domestic', category: 'domestic_b2b_regular', creditDays: 30, creditLimit: 5_00_000, msme: null, sec43bh: null }),
    acc({ accountId: 'ACC-1206', partyId: 'P-0036', side: 'receivable', name: 'Kerala Traders', under: 'Trade Receivables › Domestic', category: 'domestic_b2b_regular', creditDays: 30, creditLimit: 5_00_000, msme: null, sec43bh: null }),
  ];
}

// ---------- The paper forms (mock: what is written on them) ----------

export const PAPERS: Record<string, PaperForm> = {
  malnad: {
    key: 'malnad',
    side: 'payable',
    from: 'ravi',
    formNo: 'VRF-0107',
    title: 'Malnad Cocoa Traders',
    note: 'New cocoa powder supplier. Quotation QTN-0003 at ₹410/kg. Vendor says it is MSME (micro), certificate to follow.',
    attachments: ['GST certificate', 'PAN card', 'Cancelled cheque', 'Quotation QTN-0003'],
    values: {
      legalName: 'Malnad Cocoa Traders',
      pan: 'AAHFM0000A',
      gstin: '29AAHFM0000A1Z5',
      addressLine: '14, Coffee Board Road',
      city: 'Chikkamagaluru',
      pincode: '577101',
      contactPerson: 'Suresh Gowda (partner)',
      phone: '+91 98450 00000',
      email: 'accounts@malnadcocoa.example',
      category: 'goods_msme',
      relatedParty: 'no',
      creditDays: 30,
      msmeStatus: 'yes',
      msmeCategory: 'micro',
      bankAccountNo: '60200011112222',
      ifsc: 'CNRB0001234',
      beneficiary: 'Malnad Cocoa Traders',
    },
  },
  rama: {
    key: 'rama',
    side: 'payable',
    from: 'kiran',
    formNo: 'VRF-0108',
    title: 'Sri Rama Packaging',
    note: 'Corrugated boxes for the gift-pack line. Bank details were sent later by email.',
    attachments: ['GST certificate', 'PAN card'],
    values: {
      legalName: 'Sri Rama Packaging',
      pan: 'AAQFS0000R',
      gstin: '29AAQFS0000R1Z0',
      addressLine: '7, Peenya 2nd Stage',
      city: 'Bengaluru',
      pincode: '560058',
      contactPerson: 'Ramesh',
      phone: '+91 99000 22222',
      category: 'goods_non_msme',
      relatedParty: 'no',
      creditDays: 45,
      msmeStatus: 'no',
      bankAccountNo: '777700001234',
      ifsc: 'HDFC0000123',
      beneficiary: 'Sri Rama Packaging',
    },
  },
  coastal: {
    key: 'coastal',
    side: 'receivable',
    from: 'arun',
    formNo: 'CRF-0019',
    title: 'Coastal Bakes Pvt Ltd',
    note: 'Bakery chain, 6 outlets in Dakshina Kannada. First order SO-0019 next week. Credit limit ₹4,00,000 agreed with Farid.',
    attachments: ['GST certificate', 'PAN card', 'Trade references (2)'],
    values: {
      legalName: 'Coastal Bakes Pvt Ltd',
      pan: 'AADCC0000C',
      gstin: '29AADCC0000C1Z9',
      addressLine: 'Door 3-118, Kankanady',
      city: 'Mangaluru',
      pincode: '575002',
      contactPerson: 'Priya (purchase)',
      phone: '+91 824 200 0000',
      email: 'purchase@coastalbakes.example',
      category: 'domestic_b2b_regular',
      relatedParty: 'no',
      creditDays: 30,
      creditLimit: 4_00_000,
      poRule: 'every_invoice',
      delivery: 'email',
    },
  },
  lakshmi: {
    key: 'lakshmi',
    side: 'receivable',
    from: 'arun',
    formNo: 'CRF-0020',
    title: 'Sri Lakshmi Distributors (Mysuru)',
    note: 'New Mysuru depot of Sri Lakshmi. They want separate invoices for the depot.',
    attachments: ['GST certificate'],
    values: {
      legalName: 'Sri Lakshmi Distributors (Mysuru)',
      pan: 'AAKFS0000S',
      gstin: '29AAKFS0000S1Z2',
      addressLine: 'Depot, Hebbal Industrial Area',
      city: 'Mysuru',
      pincode: '570016',
      phone: '+91 821 240 0000',
      email: 'mysuru@srilakshmi.example',
      category: 'dealer_distributor',
      relatedParty: 'no',
      creditDays: 30,
      creditLimit: 5_00_000,
      poRule: 'none',
      delivery: 'email',
    },
  },
};

export const papersFor = (side: Side) => Object.values(PAPERS).filter((p) => p.side === side);

/** Opens a request the way the backend would: empty except what the system works out (currency, bill-by-bill). */
export function newRequest(o: { id: string; side: Side; from: ActorKey; formNo: string; at: string; paper?: string; partyId?: string | null; values?: Values }, accounts: Account[] = []): Request {
  const r: Request = {
    id: o.id,
    side: o.side,
    status: 'draft',
    from: o.from,
    formNo: o.formNo,
    arrivedAt: o.at,
    partyId: o.partyId ?? null,
    paper: o.paper,
    values: { ...(o.values ?? {}) },
    changes: [],
    history: [{ at: o.at, by: 'teja', text: `Opened: paper form ${o.formNo} from ${o.from === 'arun' ? 'Arun' : o.from === 'kiran' ? 'Kiran' : 'Ravi'}` }],
  };
  follow(r, {}, accounts);
  return r;
}

export function seedRequests(accounts: Account[]): Request[] {
  // Malnad: Teja has typed the party details from Ravi's form; the finance details are still to do.
  const m = PAPERS.malnad.values;
  const malnad = newRequest(
    {
      id: 'REQ-0101',
      side: 'payable',
      from: 'ravi',
      formNo: 'VRF-0107',
      at: '2026-10-07T10:40',
      paper: 'malnad',
      values: { legalName: m.legalName, pan: m.pan, gstin: m.gstin, addressLine: m.addressLine, city: m.city, pincode: m.pincode, contactPerson: m.contactPerson, phone: m.phone, email: m.email },
    },
    accounts,
  );

  // Healthy Bite: already our customer (P-0042). Kiran's form makes it a vendor too; it waits for Usha.
  const hb = newRequest(
    {
      id: 'REQ-0100',
      side: 'payable',
      from: 'kiran',
      formNo: 'VRF-0106',
      at: '2026-10-06T10:10',
      partyId: 'P-0042',
      values: {
        legalName: HEALTHY_BITE.legalName,
        tradeName: HEALTHY_BITE.tradeName!,
        pan: HEALTHY_BITE.pan,
        gstin: HEALTHY_BITE.gstins[0].value,
        addressLine: HEALTHY_BITE.address.line,
        city: HEALTHY_BITE.address.city,
        state: 'KA',
        pincode: HEALTHY_BITE.address.pincode,
        contactPerson: HEALTHY_BITE.contactPerson!,
        phone: HEALTHY_BITE.phones[0],
        email: HEALTHY_BITE.email!,
        category: 'contractors',
        relatedParty: 'no',
        creditDays: 30,
        msmeStatus: 'no',
        bankAccountNo: '918020000012345',
        ifsc: 'UTIB0000123',
        beneficiary: 'Healthy Bite Foods Pvt Ltd',
      },
    },
    accounts,
  );
  hb.gstCheck = { status: 'active', nameAtGst: 'HEALTHY BITE FOODS PVT LTD', at: '2026-10-06T15:10', forValue: '29AABCH0000H1Z3' };
  hb.pennyDrop = { result: 'pass', nameAtBank: 'HEALTHY BITE FOODS PVT LTD', matchPct: 100, at: '2026-10-06T15:20', forKey: '918020000012345|UTIB0000123' };
  hb.status = 'submitted';
  hb.submittedAt = '2026-10-06T15:30';
  hb.changes = [
    { id: 'CHG-0100-1', block: 'party', label: 'Party details, account, terms, MSME', checker: 'rajan', status: 'approved', after: {}, decidedAt: '2026-10-06T16:10' },
    { id: 'CHG-0100-2', block: 'bank', label: 'Bank details', checker: 'usha', status: 'pending', after: {} },
    { id: 'CHG-0100-3', block: 'tax', label: 'GST / TDS tagging', checker: 'venkat', status: 'approved', after: {}, decidedAt: '2026-10-06T17:00' },
  ];
  hb.history.push(
    { at: '2026-10-06T10:12', by: 'teja', text: 'GSTIN already in the master: used party P-0042 (our customer)' },
    { at: '2026-10-06T15:10', by: 'gst', text: 'GSTIN 29AABCH0000H1Z3 active: HEALTHY BITE FOODS PVT LTD' },
    { at: '2026-10-06T15:20', by: 'bank', text: 'Penny-drop passed: HEALTHY BITE FOODS PVT LTD (100%)' },
    { at: '2026-10-06T15:30', by: 'teja', text: 'Submitted: 3 parts to Rajan, Usha, Venkat' },
    { at: '2026-10-06T16:10', by: 'rajan', text: 'Approved: party details, account, terms, MSME' },
    { at: '2026-10-06T17:00', by: 'venkat', text: 'Approved: GST / TDS tagging (194C)' },
  );
  return [hb, malnad];
}

export function seedLog(): LogEntry[] {
  let id = 0;
  const e = (at: string, kind: LogEntry['kind'], actor: ActorKey, line: string, detail?: string): LogEntry => ({ id: ++id, at, kind, actor, line, detail });
  return [
    e('2026-10-06T10:10', 'api', 'teja', 'POST /party-account-requests', '{side: payable, form_no: VRF-0106, form_from: Kiran} → 201 REQ-0100'),
    e('2026-10-06T10:10', 'db', 'system', 'INSERT accounting_txn.party_account_request', 'REQ-0100 · draft · party_id NULL'),
    e('2026-10-06T10:12', 'api', 'teja', 'GET /parties?gstin=29AABCH0000H1Z3', '→ P-0042 Healthy Bite Foods Pvt Ltd (customer)'),
    e('2026-10-06T10:12', 'api', 'teja', 'PATCH /party-account-requests/REQ-0100', '{party_id: P-0042}: use the existing party'),
    e('2026-10-06T15:10', 'api', 'gst', 'GST portal: search GSTIN 29AABCH0000H1Z3', 'active · HEALTHY BITE FOODS PVT LTD'),
    e('2026-10-06T15:20', 'api', 'teja', 'POST /party-account-requests/REQ-0100/bank-verifications', '{method: penny_drop} → pass, 100%'),
    e('2026-10-06T15:30', 'api', 'teja', 'POST /party-account-requests/REQ-0100/submit', '→ 3 change-sets'),
    e('2026-10-06T15:30', 'db', 'system', 'INSERT accounting_txn.party_account_change ×3', 'party → Rajan · bank → Usha · tax → Venkat'),
    e('2026-10-06T16:10', 'api', 'rajan', 'POST /party-account-changes/CHG-0100-1/approve'),
    e('2026-10-06T17:00', 'api', 'venkat', 'POST /party-account-changes/CHG-0100-3/approve'),
    e('2026-10-07T10:40', 'api', 'teja', 'POST /party-account-requests', '{side: payable, form_no: VRF-0107, form_from: Ravi} → 201 REQ-0101'),
    e('2026-10-07T10:40', 'db', 'system', 'INSERT accounting_txn.party_account_request', 'REQ-0101 · draft'),
    e('2026-10-07T11:00', 'api', 'teja', 'PATCH /party-account-requests/REQ-0101', 'party details typed from the form'),
    e('2026-10-07T11:00', 'db', 'system', 'UPDATE accounting_txn.party_account_request', 'REQ-0101 · draft_values'),
  ];
}

export function seedNotices(): Notice[] {
  return [{ id: 'N-1', at: '2026-10-06T17:00', tone: 'info', title: 'Healthy Bite Foods (vendor): waiting on Usha', body: 'Rajan and Venkat approved. Bank details are with the Finance Controller.', requestId: 'REQ-0100', read: false }];
}
