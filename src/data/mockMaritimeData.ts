export type VesselStatus = 'At anchorage' | 'JIT window set' | 'At berth' | 'Underway'
export type DocumentStatus = 'Pending review' | 'In review' | 'Cleared'
export type RiskLevel = 'Low' | 'Watch' | 'Elevated'

export interface Vessel {
  id: string
  name: string
  imo: string
  type: string
  flag: string
  terminal: string
  location: string
  eta: string
  status: VesselStatus
  risk: RiskLevel
  waitHours: number
  cargo: string
  jitApplied: boolean
  fuelSavedTonnes: number
  carbonSavedTonnes: number
  demurrageSavedUsd: number
}

export interface ArrivalDocument {
  id: string
  vesselId: string
  vesselName: string
  document: string
  agency: string
  submitted: string
  status: DocumentStatus
}

export interface CrewMember {
  id: string
  name: string
  role: string
  vesselName: string
  rotation: string
  risk: RiskLevel
  lastCheckIn: string
  followUp: boolean
}

export interface LedgerEntry {
  id: string
  date: string
  vesselName: string
  category: 'Demurrage avoided' | 'Fuel saved' | 'Carbon avoided' | 'Port cost'
  detail: string
  amount: number
  unit: 'USD' | 'tonnes CO₂e'
}

export interface MaritimeState {
  vessels: Vessel[]
  documents: ArrivalDocument[]
  crew: CrewMember[]
  ledger: LedgerEntry[]
  guidedDemo: boolean
  lastUpdated: string
  totals: {
    waitingVessels: number
    demurrageExposureUsd: number
    averageWaitHours: number
    monthlySavingsUsd: number
    carbonAvoidedTonnes: number
    portCallsMonthToDate: number
  }
  weeklySavingsUsd: number[]
}

export const terminals = [
  { name: 'APM Terminals Apapa', short: 'APM Apapa', code: 'NGAPP', zone: 'Apapa Port Complex', occupancy: 87, vessels: 12, signal: 'Congested' },
  { name: 'Tin Can Island Container Terminal (TICT)', short: 'TICT', code: 'NGTIN', zone: 'Tin Can Island', occupancy: 74, vessels: 8, signal: 'Elevated' },
  { name: 'Lekki Deep Sea Port', short: 'Lekki Port', code: 'NGLEK', zone: 'Ibeju-Lekki', occupancy: 61, vessels: 5, signal: 'On plan' },
]

export const weeklySavingsUsdBaseline = [24, 31, 28, 42, 39, 58, 71, 63, 79, 69, 88, 100]

export const terminalSavings = [
  { terminal: 'APM Terminals Apapa', share: 58, valueUsd: 164_900, tone: 'cyan' as const },
  { terminal: 'Tin Can Island · TICT', share: 27, valueUsd: 76_700, tone: 'emerald' as const },
  { terminal: 'Lekki Deep Sea Port', share: 15, valueUsd: 43_000, tone: 'slate' as const },
]

export const agencyConnections = [
  { name: 'Nigerian Maritime Administration and Safety Agency', abbr: 'NIMASA', status: 'Connected', tone: 'emerald' as const, focus: 'Safety · Seafarer welfare · Cabotage' },
  { name: 'Nigerian Ports Authority', abbr: 'NPA', status: 'Connected', tone: 'emerald' as const, focus: 'Port operations · Berth planning' },
  { name: 'Nigeria Customs Service', abbr: 'NCS', status: 'Data exchange', tone: 'cyan' as const, focus: 'Cargo manifest · Trade facilitation' },
  { name: 'Port Health Services', abbr: 'PHS', status: 'Data exchange', tone: 'cyan' as const, focus: 'Vessel clearance · Public health' },
]

export const initialMaritimeState: MaritimeState = {
  guidedDemo: false,
  lastUpdated: '13 Nov 2026 · 09:42 WAT',
  totals: {
    waitingVessels: 39,
    demurrageExposureUsd: 3_380_000,
    averageWaitHours: 74.5,
    monthlySavingsUsd: 284_600,
    carbonAvoidedTonnes: 186.4,
    portCallsMonthToDate: 214,
  },
  weeklySavingsUsd: weeklySavingsUsdBaseline,
  vessels: [
    { id: 'v-001', name: 'MV Atlantic Star', imo: 'IMO 9384216', type: 'Container', flag: '🇱🇷 Liberia', terminal: 'APM Terminals Apapa', location: 'Lagos Anchorage', eta: 'Today · 11:30', status: 'At anchorage', risk: 'Elevated', waitHours: 91.2, cargo: '4,820 TEU', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0 },
    { id: 'v-002', name: 'MV Eko Pride', imo: 'IMO 9715024', type: 'Product tanker', flag: '🇳🇬 Nigeria', terminal: 'Tin Can Island Container Terminal (TICT)', location: 'Lagos Anchorage', eta: 'Today · 14:15', status: 'At anchorage', risk: 'Watch', waitHours: 68.4, cargo: '32,000 MT · AGO', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0 },
    { id: 'v-003', name: 'MV Bonga Spirit', imo: 'IMO 9851107', type: 'LNG carrier', flag: '🇳🇬 Nigeria', terminal: 'Lekki Deep Sea Port', location: 'Offshore Lagos', eta: 'Today · 18:45', status: 'Underway', risk: 'Low', waitHours: 42.1, cargo: '68,000 m³ · LNG', jitApplied: true, fuelSavedTonnes: 18.6, carbonSavedTonnes: 57.8, demurrageSavedUsd: 42_500 },
    { id: 'v-004', name: 'MV Ocean Crest', imo: 'IMO 9602841', type: 'Bulk carrier', flag: '🇵🇦 Panama', terminal: 'APM Terminals Apapa', location: 'Lagos Anchorage', eta: 'Today · 20:00', status: 'At anchorage', risk: 'Watch', waitHours: 76.8, cargo: '52,000 MT · wheat', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0 },
    { id: 'v-005', name: 'MV Lagos Trader', imo: 'IMO 9456732', type: 'General cargo', flag: '🇬🇭 Ghana', terminal: 'Tin Can Island Container Terminal (TICT)', location: 'Tin Can Roads', eta: 'Today · 22:20', status: 'At anchorage', risk: 'Elevated', waitHours: 83.6, cargo: '18,400 MT · steel', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0 },
    { id: 'v-006', name: 'MV Meridian Dawn', imo: 'IMO 9721845', type: 'Container', flag: '🇸🇬 Singapore', terminal: 'Lekki Deep Sea Port', location: 'Gulf of Guinea', eta: 'Tomorrow · 06:30', status: 'Underway', risk: 'Low', waitHours: 31.5, cargo: '2,150 TEU', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0 },
  ],
  documents: [
    { id: 'd-101', vesselId: 'v-001', vesselName: 'MV Atlantic Star', document: 'Cargo manifest', agency: 'Nigerian Customs Service', submitted: '08:12 WAT', status: 'Pending review' },
    { id: 'd-102', vesselId: 'v-001', vesselName: 'MV Atlantic Star', document: 'Crew list & effects', agency: 'NIMASA', submitted: '08:19 WAT', status: 'In review' },
    { id: 'd-103', vesselId: 'v-002', vesselName: 'MV Eko Pride', document: 'Ship sanitation certificate', agency: 'Port Health Services', submitted: '07:54 WAT', status: 'Pending review' },
    { id: 'd-104', vesselId: 'v-004', vesselName: 'MV Ocean Crest', document: 'Dangerous goods declaration', agency: 'Nigerian Ports Authority', submitted: '09:01 WAT', status: 'In review' },
    { id: 'd-105', vesselId: 'v-005', vesselName: 'MV Lagos Trader', document: 'Certificate of origin', agency: 'Nigerian Customs Service', submitted: 'Yesterday · 16:42', status: 'Pending review' },
    { id: 'd-106', vesselId: 'v-003', vesselName: 'MV Bonga Spirit', document: 'Pre-arrival notification', agency: 'NIMASA', submitted: '06:30 WAT', status: 'Cleared' },
  ],
  crew: [
    { id: 'c-01', name: 'Chinedu Okafor', role: 'Chief Officer', vesselName: 'MV Atlantic Star', rotation: '7 months onboard', risk: 'Elevated', lastCheckIn: '2 days ago', followUp: false },
    { id: 'c-02', name: 'Amina Bello', role: 'Second Engineer', vesselName: 'MV Eko Pride', rotation: '5 months onboard', risk: 'Watch', lastCheckIn: 'Yesterday', followUp: false },
    { id: 'c-03', name: 'Emeka Nwosu', role: 'Able Seafarer', vesselName: 'MV Bonga Spirit', rotation: '3 months onboard', risk: 'Low', lastCheckIn: 'Today · 08:20', followUp: false },
    { id: 'c-04', name: 'Tunde Adebayo', role: 'Deck Cadet', vesselName: 'MV Ocean Crest', rotation: '6 months onboard', risk: 'Elevated', lastCheckIn: '4 days ago', followUp: false },
    { id: 'c-05', name: 'Grace Ekanem', role: 'Third Officer', vesselName: 'MV Lagos Trader', rotation: '4 months onboard', risk: 'Watch', lastCheckIn: 'Yesterday', followUp: true },
  ],
  ledger: [
    { id: 'l-501', date: '13 Nov · 08:30', vesselName: 'MV Bonga Spirit', category: 'Demurrage avoided', detail: 'Just-in-time arrival window confirmed', amount: 42_500, unit: 'USD' },
    { id: 'l-502', date: '13 Nov · 08:30', vesselName: 'MV Bonga Spirit', category: 'Fuel saved', detail: 'Reduced anchorage idle time', amount: 18.6, unit: 'tonnes CO₂e' },
    { id: 'l-503', date: '12 Nov · 17:10', vesselName: 'MV Meridian Dawn', category: 'Demurrage avoided', detail: 'Berth slot matched to arrival', amount: 31_200, unit: 'USD' },
    { id: 'l-504', date: '12 Nov · 17:10', vesselName: 'MV Meridian Dawn', category: 'Carbon avoided', detail: 'Lower-speed approach profile', amount: 12.4, unit: 'tonnes CO₂e' },
    { id: 'l-505', date: '12 Nov · 14:05', vesselName: 'MV Eko Pride', category: 'Port cost', detail: 'Estimated pilotage & towage', amount: 8_750, unit: 'USD' },
    { id: 'l-506', date: '12 Nov · 12:40', vesselName: 'MV Ocean Crest', category: 'Demurrage avoided', detail: 'Arrival aligned to discharge window', amount: 70_000, unit: 'USD' },
    { id: 'l-507', date: '11 Nov · 18:15', vesselName: 'MV Atlantic Star', category: 'Demurrage avoided', detail: 'Pre-arrival document package completed', amount: 44_500, unit: 'USD' },
    { id: 'l-508', date: '11 Nov · 18:15', vesselName: 'MV Atlantic Star', category: 'Fuel saved', detail: 'Lower-speed arrival profile', amount: 96_400, unit: 'USD' },
  ],
}

export type MaritimeAction =
  | { type: 'replace-state'; state: MaritimeState }
  | { type: 'toggle-guided-demo' }
  | { type: 'apply-jit-plan'; vesselId: string }
  | { type: 'clear-document'; documentId: string }
  | { type: 'assign-crew-follow-up'; crewId: string }
  | { type: 'reset-demo' }

export function maritimeReducer(state: MaritimeState, action: MaritimeAction): MaritimeState {
  if (action.type === 'replace-state') return action.state
  const now = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }).format(new Date())
  if (action.type === 'reset-demo') return initialMaritimeState
  if (action.type === 'toggle-guided-demo') return { ...state, guidedDemo: !state.guidedDemo }

  if (action.type === 'apply-jit-plan') {
    const vessel = state.vessels.find((item) => item.id === action.vesselId)
    if (!vessel || vessel.jitApplied) return state
    const saving = 42_500
    const fuel = 18.6
    const carbon = 57.8
    const eventTime = `13 Nov · ${now}`
    return {
      ...state,
      lastUpdated: `13 Nov 2026 · ${now} WAT`,
      totals: {
        ...state.totals,
        waitingVessels: Math.max(0, state.totals.waitingVessels - 1),
        demurrageExposureUsd: Math.max(0, state.totals.demurrageExposureUsd - saving),
        averageWaitHours: Math.max(0, Number((state.totals.averageWaitHours - 1.3).toFixed(1))),
        monthlySavingsUsd: state.totals.monthlySavingsUsd + saving,
        carbonAvoidedTonnes: Number((state.totals.carbonAvoidedTonnes + carbon).toFixed(1)),
      },
      weeklySavingsUsd: state.weeklySavingsUsd.map((amount, index) => index === state.weeklySavingsUsd.length - 1 ? amount + saving / 1_000 : amount),
      vessels: state.vessels.map((item) => item.id === vessel.id ? { ...item, status: 'JIT window set', jitApplied: true, fuelSavedTonnes: fuel, carbonSavedTonnes: carbon, demurrageSavedUsd: saving } : item),
      ledger: [
        { id: `l-${Date.now()}-dem`, date: eventTime, vesselName: vessel.name, category: 'Demurrage avoided', detail: 'JIT arrival plan applied · berth window aligned', amount: saving, unit: 'USD' },
        { id: `l-${Date.now()}-co2`, date: eventTime, vesselName: vessel.name, category: 'Carbon avoided', detail: 'Reduced-speed approach · idle time avoided', amount: carbon, unit: 'tonnes CO₂e' },
        ...state.ledger,
      ],
    }
  }

  if (action.type === 'clear-document') {
    const document = state.documents.find((item) => item.id === action.documentId)
    if (!document || document.status === 'Cleared') return state
    const saving = 8_500
    return {
      ...state,
      lastUpdated: `13 Nov 2026 · ${now} WAT`,
      totals: {
        ...state.totals,
        demurrageExposureUsd: Math.max(0, state.totals.demurrageExposureUsd - saving),
        monthlySavingsUsd: state.totals.monthlySavingsUsd + saving,
      },
      weeklySavingsUsd: state.weeklySavingsUsd.map((amount, index) => index === state.weeklySavingsUsd.length - 1 ? amount + saving / 1_000 : amount),
      documents: state.documents.map((item) => item.id === document.id ? { ...item, status: 'Cleared' } : item),
      ledger: [{ id: `l-${Date.now()}-doc`, date: `13 Nov · ${now}`, vesselName: document.vesselName, category: 'Demurrage avoided', detail: `${document.document} cleared · pre-arrival delay avoided`, amount: saving, unit: 'USD' }, ...state.ledger],
    }
  }

  if (action.type === 'assign-crew-follow-up') {
    return {
      ...state,
      lastUpdated: `13 Nov 2026 · ${now} WAT`,
      crew: state.crew.map((member) => member.id === action.crewId ? { ...member, followUp: true } : member),
    }
  }

  return state
}

export function getCrewAlertCount(state: MaritimeState) {
  return state.crew.filter((member) => member.risk === 'Elevated' && !member.followUp).length
}

export function getPendingDocumentCount(state: MaritimeState) {
  return state.documents.filter((document) => document.status !== 'Cleared').length
}
