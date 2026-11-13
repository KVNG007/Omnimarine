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
  mapPosition: { x: number; y: number }
  speedKnots: number
  etaHours: number
  berthClearsInHours: number
  recommendedSpeedKnots: number
  waitHoursSaved: number
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

export interface CargoDiscrepancy {
  id: string
  kind: 'HS code mismatch' | 'Gross weight variance'
  severity: 'Restricted classification' | 'Manifest variance'
  invoiceValue: string
  billOfLadingValue: string
  resolvedValue: string
  finding: string
  suggestedCorrection: string
  resolved: boolean
}

export interface ClearanceCase {
  id: string
  vesselId: string
  vesselName: string
  manifestNumber: string
  billOfLadingNumber: string
  invoiceNumber: string
  terminal: string
  origin: string
  etaLabel: string
  aiConfidencePercent: number
  waitHoursSaved: number
  submitted: string
  cargo: string
  status: 'At-Risk of Delay' | 'In Review' | 'Pre-Cleared'
  discrepancies: CargoDiscrepancy[]
  storageFeesAvoidedUsd: number
}

export interface SampleManifestScan {
  status: 'idle' | 'scanning' | 'complete'
  fileName: string | null
  startedAt: string | null
  validationResults: string[]
}

export interface CalculationAssumptions {
  demurrageRateUsdPerDay: number
  dailyCharterRateUsd: number
  mainEngineFuelBurnTonnesPerDay: number
  speedFuelSavingBenchmarkPercent: number
  auxiliaryFuelBurnTonnesPerDay: number
  fuelPriceUsdPerTonne: number
  co2TonnesPerFuelTonne: number
  noxTonnesPerFuelTonne: number
  soxTonnesPerFuelTonne: number
}

export interface VoyageImpact {
  id: string
  vesselId: string
  vesselName: string
  terminal: string
  source: 'JIT arrival' | 'Pre-arrival clearance'
  baselineWaitHours: number
  actualWaitHours: number
  speedOptimizationHours: number
  storageFeesAvoidedUsd: number
}

export interface CalculatedVoyageImpact extends VoyageImpact {
  hoursSaved: number
  demurrageAvoidedUsd: number
  fuelSavedTonnes: number
  co2AvoidedTonnes: number
  noxAvoidedTonnes: number
  soxAvoidedTonnes: number
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

export interface WellbeingMessage {
  id: string
  sender: 'practitioner' | 'seafarer'
  body: string
  time: string
  delivery: 'sent' | 'queued'
}

export interface WellbeingDemoState {
  offline: boolean
  identityConsent: boolean
  shoreLeaveRequested: boolean
  messages: WellbeingMessage[]
}

export interface BerthStatus {
  id: string
  terminal: string
  berth: string
  status: 'Occupied' | 'Clearing Soon' | 'Available' | 'JIT aligned'
  clearsInHours: number
  vessel: string | null
  mapLabel: string
  mapPosition: { x: number; y: number }
}

export interface LedgerEntry {
  id: string
  date: string
  vesselName: string
  category: 'Demurrage avoided' | 'Fuel saved' | 'Carbon avoided' | 'Wait avoided' | 'Port storage avoided' | 'Port cost'
  detail: string
  amount: number
  unit: 'USD' | 'tonnes CO₂e' | 'tonnes fuel' | 'hours'
  impactId?: string
}

export interface MaritimeState {
  vessels: Vessel[]
  documents: ArrivalDocument[]
  crew: CrewMember[]
  wellbeing: WellbeingDemoState
  clearanceCases: ClearanceCase[]
  sampleManifestScan: SampleManifestScan
  voyageImpacts: VoyageImpact[]
  calculationAssumptions: CalculationAssumptions
  berths: BerthStatus[]
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
    jitWaitHoursSaved: number
    preclearanceWaitHoursSaved: number
    fuelSavedTonnes: number
    portStorageFeesAvoidedUsd: number
  }
  weeklySavingsUsd: number[]
}

export const terminals = [
  { name: 'APM Terminals Apapa', short: 'APM Apapa', code: 'NGAPP', zone: 'Apapa Port Complex', occupancy: 87, vessels: 12, signal: 'Congested' },
  { name: 'Tin Can Island Container Terminal (TICT)', short: 'TICT', code: 'NGTIN', zone: 'Tin Can Island', occupancy: 74, vessels: 8, signal: 'Elevated' },
  { name: 'Lekki Deep Sea Port', short: 'Lekki Port', code: 'NGLEK', zone: 'Ibeju-Lekki', occupancy: 61, vessels: 5, signal: 'On plan' },
]

export const berthStatuses: BerthStatus[] = [
  { id: 'apapa-b04', terminal: 'APM Terminals Apapa', berth: 'Apapa · Berth 04', status: 'Clearing Soon', clearsInHours: 42, vessel: 'MV Meridian Dawn', mapLabel: 'APAPA 04', mapPosition: { x: 610, y: 220 } },
  { id: 'apapa-b06', terminal: 'APM Terminals Apapa', berth: 'Apapa · Berth 06', status: 'Occupied', clearsInHours: 61, vessel: 'MV Ocean Crest', mapLabel: 'APAPA 06', mapPosition: { x: 619, y: 237 } },
  { id: 'tict-b02', terminal: 'Tin Can Island · TICT', berth: 'Tin Can · Berth 02', status: 'Occupied', clearsInHours: 27, vessel: 'MV Eko Pride', mapLabel: 'TIN CAN 02', mapPosition: { x: 600, y: 255 } },
  { id: 'tict-b05', terminal: 'Tin Can Island · TICT', berth: 'Tin Can · Berth 05', status: 'Available', clearsInHours: 0, vessel: null, mapLabel: 'TIN CAN 05', mapPosition: { x: 607, y: 272 } },
  { id: 'lekki-b01', terminal: 'Lekki Deep Sea Port', berth: 'Lekki · Berth 01', status: 'Available', clearsInHours: 0, vessel: null, mapLabel: 'LEKKI 01', mapPosition: { x: 618, y: 116 } },
]

export const anchorageClusters = [
  { id: 'lagos-outer', label: 'Lagos Anchorage', x: 515, y: 247, radius: 48, waiting: 22, congestion: 'High' },
  { id: 'tin-can-roads', label: 'Tin Can Roads', x: 566, y: 302, radius: 31, waiting: 11, congestion: 'Elevated' },
  { id: 'lekki-approach', label: 'Lekki approach', x: 590, y: 133, radius: 24, waiting: 6, congestion: 'Moderate' },
]

export const julyLagosBaseline = {
  waitingVessels: 39,
  averageWaitHours: 74.5,
  demurrageExposureUsd: 3_380_000,
  monthlySavingsUsd: 284_600,
  carbonAvoidedTonnes: 186.4,
}

export const defaultCalculationAssumptions: CalculationAssumptions = {
  demurrageRateUsdPerDay: 42_500,
  dailyCharterRateUsd: 38_000,
  mainEngineFuelBurnTonnesPerDay: 60,
  speedFuelSavingBenchmarkPercent: 20,
  auxiliaryFuelBurnTonnesPerDay: 2.5,
  fuelPriceUsdPerTonne: 650,
  co2TonnesPerFuelTonne: 3.114,
  noxTonnesPerFuelTonne: 0.065,
  soxTonnesPerFuelTonne: 0.01,
}

export const initialVoyageImpacts: VoyageImpact[] = [
  { id: 'impact-v-001-jit', vesselId: 'v-001', vesselName: 'MV Atlantic Star', terminal: 'APM Terminals Apapa', source: 'JIT arrival', baselineWaitHours: 6, actualWaitHours: 6, speedOptimizationHours: 0, storageFeesAvoidedUsd: 0 },
  { id: 'impact-case-ng-8841', vesselId: 'v-001', vesselName: 'MV Atlantic Star', terminal: 'APM Terminals Apapa', source: 'Pre-arrival clearance', baselineWaitHours: 10.6, actualWaitHours: 10.6, speedOptimizationHours: 0, storageFeesAvoidedUsd: 0 },
]

export function calculateVoyageImpact(voyage: VoyageImpact, assumptions: CalculationAssumptions): CalculatedVoyageImpact {
  const hoursSaved = Math.max(0, voyage.baselineWaitHours - voyage.actualWaitHours)
  const demurrageAvoidedUsd = Math.round((hoursSaved / 24) * assumptions.demurrageRateUsdPerDay)
  const speedFuelSaved = voyage.source === 'JIT arrival'
    ? (voyage.speedOptimizationHours / 24) * assumptions.mainEngineFuelBurnTonnesPerDay * (assumptions.speedFuelSavingBenchmarkPercent / 100)
    : 0
  const auxiliaryFuelSaved = (hoursSaved / 24) * assumptions.auxiliaryFuelBurnTonnesPerDay
  const fuelSavedTonnes = Number((speedFuelSaved + auxiliaryFuelSaved).toFixed(1))
  return {
    ...voyage,
    hoursSaved: Number(hoursSaved.toFixed(1)),
    demurrageAvoidedUsd,
    fuelSavedTonnes,
    co2AvoidedTonnes: Number((fuelSavedTonnes * assumptions.co2TonnesPerFuelTonne).toFixed(1)),
    noxAvoidedTonnes: Number((fuelSavedTonnes * assumptions.noxTonnesPerFuelTonne).toFixed(2)),
    soxAvoidedTonnes: Number((fuelSavedTonnes * assumptions.soxTonnesPerFuelTonne).toFixed(2)),
  }
}

export function calculateImpactTotals(impacts: VoyageImpact[], assumptions: CalculationAssumptions) {
  const rows = impacts.map((impact) => calculateVoyageImpact(impact, assumptions))
  const demurrageAvoidedUsd = rows.reduce((total, row) => total + row.demurrageAvoidedUsd, 0)
  const storageFeesAvoidedUsd = rows.reduce((total, row) => total + row.storageFeesAvoidedUsd, 0)
  const hoursSaved = rows.reduce((total, row) => total + row.hoursSaved, 0)
  const fuelSavedTonnes = Number(rows.reduce((total, row) => total + row.fuelSavedTonnes, 0).toFixed(1))
  const carbonAvoidedTonnes = Number(rows.reduce((total, row) => total + row.co2AvoidedTonnes, 0).toFixed(1))
  const jitWaitHoursSaved = Number(rows.filter((row) => row.source === 'JIT arrival').reduce((total, row) => total + row.hoursSaved, 0).toFixed(1))
  const preclearanceWaitHoursSaved = Number(rows.filter((row) => row.source === 'Pre-arrival clearance').reduce((total, row) => total + row.hoursSaved, 0).toFixed(1))
  const modeledSavingsUsd = demurrageAvoidedUsd + storageFeesAvoidedUsd
  const weeklySavingsUsd = [...weeklySavingsUsdBaseline]
  weeklySavingsUsd[weeklySavingsUsd.length - 1] += modeledSavingsUsd / 1_000
  return {
    rows,
    demurrageAvoidedUsd,
    storageFeesAvoidedUsd,
    hoursSaved: Number(hoursSaved.toFixed(1)),
    fuelSavedTonnes,
    carbonAvoidedTonnes,
    jitWaitHoursSaved,
    preclearanceWaitHoursSaved,
    modeledSavingsUsd,
    totals: {
      waitingVessels: Math.max(0, julyLagosBaseline.waitingVessels - rows.filter((row) => row.source === 'JIT arrival' && row.hoursSaved > 0).length),
      demurrageExposureUsd: Math.max(0, julyLagosBaseline.demurrageExposureUsd - demurrageAvoidedUsd),
      averageWaitHours: Math.max(0, Number((julyLagosBaseline.averageWaitHours - hoursSaved / julyLagosBaseline.waitingVessels).toFixed(1))),
      monthlySavingsUsd: julyLagosBaseline.monthlySavingsUsd + modeledSavingsUsd,
      carbonAvoidedTonnes: Number((julyLagosBaseline.carbonAvoidedTonnes + carbonAvoidedTonnes).toFixed(1)),
      portCallsMonthToDate: 214,
      jitWaitHoursSaved,
      preclearanceWaitHoursSaved,
      fuelSavedTonnes,
      portStorageFeesAvoidedUsd: storageFeesAvoidedUsd,
    },
    weeklySavingsUsd,
  }
}

export const jitRecommendation = {
  heroVesselId: 'v-001',
  currentSpeedKnots: 14.2,
  recommendedSpeedKnots: 11.4,
  currentEtaHours: 36,
  berthClearsInHours: 42,
  waitHoursAvoided: 6,
  fuelSavedTonnes: 18.6,
  co2AvoidedTonnes: 57.9,
  demurrageSavedUsd: 10_625,
  destination: { x: 610, y: 220 },
  routePath: 'M150 285 C270 230 395 190 512 184 C560 181 582 207 610 220',
  motionPath: 'M0 0 C120 -65 310 -100 460 -65',
}

export const sampleManifestFixture = {
  fileName: 'NG_Sample_Manifest.pdf',
  validationResults: ['Manifest fields extracted', 'Invoice totals cross-checked', 'No blocking discrepancies detected'],
}

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
    jitWaitHoursSaved: 0,
    preclearanceWaitHoursSaved: 0,
    fuelSavedTonnes: 0,
    portStorageFeesAvoidedUsd: 0,
  },
  berths: berthStatuses,
  weeklySavingsUsd: weeklySavingsUsdBaseline,
  wellbeing: {
    offline: false,
    identityConsent: false,
    shoreLeaveRequested: false,
    messages: [
      { id: 'wb-1', sender: 'practitioner', body: 'Hello, Mariner-749. I’m here with you. How has rest been during this passage?', time: '09:14', delivery: 'sent' },
      { id: 'wb-2', sender: 'seafarer', body: 'The night watches have been long. I have been finding it hard to switch off after duty.', time: '09:18', delivery: 'sent' },
      { id: 'wb-3', sender: 'practitioner', body: 'Thank you for telling me. We can talk through what might help, at your pace. Would you like to book a private time to speak?', time: '09:20', delivery: 'sent' },
    ],
  },
  voyageImpacts: initialVoyageImpacts,
  calculationAssumptions: defaultCalculationAssumptions,
  vessels: [
    { id: 'v-001', name: 'MV Atlantic Star', imo: 'IMO 9384216', type: 'Bulk carrier', flag: '🇱🇷 Liberia', terminal: 'APM Terminals Apapa', location: 'Gulf of Guinea · 36h out', eta: '36h · Jul 16, 18:00', status: 'Underway', risk: 'Elevated', waitHours: 0, cargo: '52,000 MT · wheat', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0, mapPosition: { x: 150, y: 285 }, speedKnots: jitRecommendation.currentSpeedKnots, etaHours: jitRecommendation.currentEtaHours, berthClearsInHours: jitRecommendation.berthClearsInHours, recommendedSpeedKnots: jitRecommendation.recommendedSpeedKnots, waitHoursSaved: 0 },
    { id: 'v-002', name: 'MV Eko Pride', imo: 'IMO 9715024', type: 'Product tanker', flag: '🇳🇬 Nigeria', terminal: 'Tin Can Island Container Terminal (TICT)', location: 'Lagos Anchorage', eta: 'Today · 14:15', status: 'At anchorage', risk: 'Watch', waitHours: 68.4, cargo: '32,000 MT · AGO', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0, mapPosition: { x: 532, y: 220 }, speedKnots: 0, etaHours: 0, berthClearsInHours: 27, recommendedSpeedKnots: 0, waitHoursSaved: 0 },
    { id: 'v-003', name: 'MV Bonga Spirit', imo: 'IMO 9851107', type: 'LNG carrier', flag: '🇳🇬 Nigeria', terminal: 'Lekki Deep Sea Port', location: 'Offshore Lagos', eta: 'Today · 18:45', status: 'Underway', risk: 'Low', waitHours: 42.1, cargo: '68,000 m³ · LNG', jitApplied: true, fuelSavedTonnes: 18.6, carbonSavedTonnes: 57.8, demurrageSavedUsd: 42_500, mapPosition: { x: 630, y: 123 }, speedKnots: 11.4, etaHours: 18, berthClearsInHours: 0, recommendedSpeedKnots: 11.4, waitHoursSaved: 0 },
    { id: 'v-004', name: 'MV Ocean Crest', imo: 'IMO 9602841', type: 'Bulk carrier', flag: '🇵🇦 Panama', terminal: 'APM Terminals Apapa', location: 'Lagos Anchorage', eta: 'Today · 20:00', status: 'At anchorage', risk: 'Watch', waitHours: 76.8, cargo: '52,000 MT · wheat', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0, mapPosition: { x: 562, y: 255 }, speedKnots: 0, etaHours: 0, berthClearsInHours: 61, recommendedSpeedKnots: 0, waitHoursSaved: 0 },
    { id: 'v-005', name: 'MV Lagos Trader', imo: 'IMO 9456732', type: 'General cargo', flag: '🇬🇭 Ghana', terminal: 'Tin Can Island Container Terminal (TICT)', location: 'Tin Can Roads', eta: 'Today · 22:20', status: 'At anchorage', risk: 'Elevated', waitHours: 83.6, cargo: '18,400 MT · steel', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0, mapPosition: { x: 500, y: 194 }, speedKnots: 0, etaHours: 0, berthClearsInHours: 0, recommendedSpeedKnots: 0, waitHoursSaved: 0 },
    { id: 'v-006', name: 'MV Meridian Dawn', imo: 'IMO 9721845', type: 'Container', flag: '🇸🇬 Singapore', terminal: 'Lekki Deep Sea Port', location: 'Gulf of Guinea', eta: 'Tomorrow · 06:30', status: 'Underway', risk: 'Low', waitHours: 31.5, cargo: '2,150 TEU', jitApplied: false, fuelSavedTonnes: 0, carbonSavedTonnes: 0, demurrageSavedUsd: 0, mapPosition: { x: 305, y: 337 }, speedKnots: 12.7, etaHours: 22, berthClearsInHours: 0, recommendedSpeedKnots: 0, waitHoursSaved: 0 },
  ],
  documents: [
    { id: 'd-101', vesselId: 'v-001', vesselName: 'MV Atlantic Star', document: 'Cargo manifest', agency: 'Nigerian Customs Service', submitted: '08:12 WAT', status: 'Pending review' },
    { id: 'd-102', vesselId: 'v-001', vesselName: 'MV Atlantic Star', document: 'Crew list & effects', agency: 'NIMASA', submitted: '08:19 WAT', status: 'In review' },
    { id: 'd-103', vesselId: 'v-002', vesselName: 'MV Eko Pride', document: 'Ship sanitation certificate', agency: 'Port Health Services', submitted: '07:54 WAT', status: 'Pending review' },
    { id: 'd-104', vesselId: 'v-004', vesselName: 'MV Ocean Crest', document: 'Dangerous goods declaration', agency: 'Nigerian Ports Authority', submitted: '09:01 WAT', status: 'In review' },
    { id: 'd-105', vesselId: 'v-005', vesselName: 'MV Lagos Trader', document: 'Certificate of origin', agency: 'Nigerian Customs Service', submitted: 'Yesterday · 16:42', status: 'Pending review' },
    { id: 'd-106', vesselId: 'v-003', vesselName: 'MV Bonga Spirit', document: 'Pre-arrival notification', agency: 'NIMASA', submitted: '06:30 WAT', status: 'Cleared' },
  ],
  clearanceCases: [
    {
      id: 'case-ng-8841', vesselId: 'v-001', vesselName: 'MV Atlantic Star', manifestNumber: 'NG-8841', billOfLadingNumber: 'BOL-NG-8841', invoiceNumber: 'INV-8841', terminal: 'APM Terminals Apapa', origin: 'Antwerp, Belgium', etaLabel: '36h to Lagos Anchorage', aiConfidencePercent: 98.7, waitHoursSaved: 10.6, submitted: 'Today · 08:12 WAT', cargo: 'Industrial machinery parts · 128 packages', status: 'At-Risk of Delay', storageFeesAvoidedUsd: 18_750,
      discrepancies: [
        { id: 'hs-code', kind: 'HS code mismatch', severity: 'Restricted classification', invoiceValue: '8431.49.00 · machinery parts', billOfLadingValue: '8710.00.00 · restricted category', resolvedValue: '8431.49.00 · machinery parts', finding: 'The bill of lading classifies machinery parts under a restricted tariff category that does not match the commercial invoice.', suggestedCorrection: 'Align the bill of lading with invoice code 8431.49.00, subject to importer and customs confirmation.', resolved: false },
        { id: 'gross-weight', kind: 'Gross weight variance', severity: 'Manifest variance', invoiceValue: '27,550 kg · commercial invoice', billOfLadingValue: '29,000 kg · bill of lading', resolvedValue: '27,550 kg · verified packing list', finding: 'The declared gross weights differ by 1,450 kg across the submitted cargo documents.', suggestedCorrection: 'Reconcile against the packing list and amend the bill of lading to the verified gross weight.', resolved: false },
      ],
    },
    { id: 'case-ng-8856', vesselId: 'v-002', vesselName: 'MV Eko Pride', manifestNumber: 'NG-8856', billOfLadingNumber: 'BOL-NG-8856', invoiceNumber: 'INV-8856', terminal: 'Tin Can Island · TICT', origin: 'Rotterdam, Netherlands', etaLabel: '28h to Tin Can Roads', aiConfidencePercent: 96.4, waitHoursSaved: 0, submitted: 'Today · 07:54 WAT', cargo: 'Automotive gas oil · 32,000 MT', status: 'In Review', storageFeesAvoidedUsd: 0, discrepancies: [] },
    { id: 'case-ng-8862', vesselId: 'v-006', vesselName: 'MV Meridian Dawn', manifestNumber: 'NG-8862', billOfLadingNumber: 'BOL-NG-8862', invoiceNumber: 'INV-8862', terminal: 'Lekki Deep Sea Port', origin: 'Singapore', etaLabel: '22h to Lagos', aiConfidencePercent: 99.1, waitHoursSaved: 0, submitted: 'Today · 09:18 WAT', cargo: 'Containerized electronics · 2,150 TEU', status: 'In Review', storageFeesAvoidedUsd: 0, discrepancies: [] },
  ],
  sampleManifestScan: { status: 'idle', fileName: null, startedAt: null, validationResults: [] },
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
  | { type: 'set-wellbeing-offline'; value: boolean }
  | { type: 'set-wellbeing-identity-consent'; value: boolean }
  | { type: 'set-wellbeing-shore-leave'; value: boolean }
  | { type: 'send-wellbeing-message'; body: string }
  | { type: 'sync-wellbeing-messages' }
  | { type: 'resolve-cargo-discrepancy'; caseId: string; discrepancyId: string }
  | { type: 'start-sample-manifest-scan'; fileName: string }
  | { type: 'complete-sample-manifest-scan' }
  | { type: 'set-demurrage-rate'; value: number }
  | { type: 'reset-demo' }

export function maritimeReducer(state: MaritimeState, action: MaritimeAction): MaritimeState {
  if (action.type === 'replace-state') return action.state
  const now = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }).format(new Date())
  if (action.type === 'reset-demo') return initialMaritimeState
  if (action.type === 'toggle-guided-demo') return { ...state, guidedDemo: !state.guidedDemo }

  if (action.type === 'set-demurrage-rate') {
    const calculationAssumptions = { ...state.calculationAssumptions, demurrageRateUsdPerDay: action.value }
    const summary = calculateImpactTotals(state.voyageImpacts, calculationAssumptions)
    const calculatedRows = new Map(summary.rows.map((row) => [row.id, row]))
    const ledger = state.ledger.map((entry) => {
      if (!entry.impactId) return entry
      const row = calculatedRows.get(entry.impactId)
      if (!row) return entry
      if (entry.category === 'Demurrage avoided') return { ...entry, amount: row.demurrageAvoidedUsd }
      if (entry.category === 'Wait avoided') return { ...entry, amount: row.hoursSaved }
      if (entry.category === 'Fuel saved' && entry.unit === 'tonnes fuel') return { ...entry, amount: row.fuelSavedTonnes }
      if (entry.category === 'Carbon avoided') return { ...entry, amount: row.co2AvoidedTonnes }
      return entry
    })
    return {
      ...state,
      calculationAssumptions,
      totals: summary.totals,
      weeklySavingsUsd: summary.weeklySavingsUsd,
      vessels: state.vessels.map((vessel) => {
        const row = summary.rows.find((impact) => impact.vesselId === vessel.id && impact.source === 'JIT arrival')
        return row && vessel.jitApplied ? { ...vessel, demurrageSavedUsd: row.demurrageAvoidedUsd, fuelSavedTonnes: row.fuelSavedTonnes, carbonSavedTonnes: row.co2AvoidedTonnes, waitHoursSaved: row.hoursSaved } : vessel
      }),
      ledger,
    }
  }

  if (action.type === 'apply-jit-plan') {
    const vessel = state.vessels.find((item) => item.id === action.vesselId)
    if (!vessel || vessel.jitApplied) return state
    const impactId = `impact-${vessel.id}-jit`
    const voyageImpacts = state.voyageImpacts.map((impact) => impact.id === impactId ? { ...impact, actualWaitHours: 0, speedOptimizationHours: jitRecommendation.currentEtaHours } : impact)
    const summary = calculateImpactTotals(voyageImpacts, state.calculationAssumptions)
    const impact = summary.rows.find((row) => row.id === impactId)
    if (!impact) return state
    const eventTime = `13 Nov · ${now}`
    return {
      ...state,
      lastUpdated: `13 Nov 2026 · ${now} WAT`,
      voyageImpacts,
      totals: summary.totals,
      weeklySavingsUsd: summary.weeklySavingsUsd,
      vessels: state.vessels.map((item) => item.id === vessel.id ? { ...item, status: 'JIT window set', location: 'Approach corridor · JIT sync', speedKnots: jitRecommendation.recommendedSpeedKnots, etaHours: jitRecommendation.berthClearsInHours, jitApplied: true, waitHoursSaved: impact.hoursSaved, fuelSavedTonnes: impact.fuelSavedTonnes, carbonSavedTonnes: impact.co2AvoidedTonnes, demurrageSavedUsd: impact.demurrageAvoidedUsd, mapPosition: jitRecommendation.destination } : item),
      berths: state.berths.map((berth) => berth.id === 'apapa-b04' ? { ...berth, status: 'JIT aligned', clearsInHours: jitRecommendation.berthClearsInHours, vessel: 'MV Atlantic Star' } : berth),
      ledger: [
        { id: `${impactId}-demurrage`, impactId, date: eventTime, vesselName: vessel.name, category: 'Demurrage avoided', detail: 'JIT arrival plan applied · berth window aligned', amount: impact.demurrageAvoidedUsd, unit: 'USD' },
        { id: `${impactId}-hours`, impactId, date: eventTime, vesselName: vessel.name, category: 'Wait avoided', detail: 'Anchorage wait removed · arrival matched to berth opening', amount: impact.hoursSaved, unit: 'hours' },
        { id: `${impactId}-fuel`, impactId, date: eventTime, vesselName: vessel.name, category: 'Fuel saved', detail: 'AI speed optimization · 14.2 kn → 11.4 kn', amount: impact.fuelSavedTonnes, unit: 'tonnes fuel' },
        { id: `${impactId}-co2`, impactId, date: eventTime, vesselName: vessel.name, category: 'Carbon avoided', detail: 'Reduced-speed approach · idle time avoided', amount: impact.co2AvoidedTonnes, unit: 'tonnes CO₂e' },
        ...state.ledger.filter((entry) => entry.impactId !== impactId),
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

  if (action.type === 'resolve-cargo-discrepancy') {
    const clearanceCase = state.clearanceCases.find((item) => item.id === action.caseId)
    if (!clearanceCase || clearanceCase.status === 'Pre-Cleared') return state
    const discrepancy = clearanceCase.discrepancies.find((item) => item.id === action.discrepancyId)
    if (!discrepancy || discrepancy.resolved) return state
    const updatedDiscrepancies = clearanceCase.discrepancies.map((item) => item.id === discrepancy.id ? { ...item, resolved: true } : item)
    const ready = updatedDiscrepancies.every((item) => item.resolved)
    const completedCase = { ...clearanceCase, discrepancies: updatedDiscrepancies, status: ready ? 'Pre-Cleared' as const : 'In Review' as const }
    const impactId = `impact-${clearanceCase.id}`
    const voyageImpacts = ready ? state.voyageImpacts.map((impact) => impact.id === impactId ? { ...impact, baselineWaitHours: clearanceCase.waitHoursSaved || impact.baselineWaitHours, actualWaitHours: 0, storageFeesAvoidedUsd: clearanceCase.storageFeesAvoidedUsd } : impact) : state.voyageImpacts
    const summary = ready ? calculateImpactTotals(voyageImpacts, state.calculationAssumptions) : null
    const impact = summary?.rows.find((row) => row.id === impactId)
    const impactLedgerEntries: LedgerEntry[] = impact && summary ? [
      { id: `${impactId}-storage`, impactId, date: `13 Nov · ${now}`, vesselName: clearanceCase.vesselName, category: 'Port storage avoided', detail: `Manifest #${clearanceCase.manifestNumber} pre-cleared · estimated port storage charges avoided`, amount: impact.storageFeesAvoidedUsd, unit: 'USD' },
      { id: `${impactId}-demurrage`, impactId, date: `13 Nov · ${now}`, vesselName: clearanceCase.vesselName, category: 'Demurrage avoided', detail: 'Pre-arrival discrepancies resolved · delay hours avoided', amount: impact.demurrageAvoidedUsd, unit: 'USD' },
      { id: `${impactId}-hours`, impactId, date: `13 Nov · ${now}`, vesselName: clearanceCase.vesselName, category: 'Wait avoided', detail: 'Cargo documents validated before berthing', amount: impact.hoursSaved, unit: 'hours' },
      { id: `${impactId}-fuel`, impactId, date: `13 Nov · ${now}`, vesselName: clearanceCase.vesselName, category: 'Fuel saved', detail: 'Auxiliary engine fuel during avoided clearance wait', amount: impact.fuelSavedTonnes, unit: 'tonnes fuel' },
      { id: `${impactId}-co2`, impactId, date: `13 Nov · ${now}`, vesselName: clearanceCase.vesselName, category: 'Carbon avoided', detail: 'Auxiliary engine emissions prevented during avoided wait', amount: impact.co2AvoidedTonnes, unit: 'tonnes CO₂e' },
    ] : []
    return {
      ...state,
      lastUpdated: `13 Nov 2026 · ${now} WAT`,
      voyageImpacts,
      clearanceCases: state.clearanceCases.map((item) => item.id === clearanceCase.id ? completedCase : item),
      documents: ready ? state.documents.map((item) => item.vesselId === clearanceCase.vesselId && item.document === 'Cargo manifest' ? { ...item, status: 'Cleared' } : item) : state.documents,
      totals: summary?.totals ?? state.totals,
      weeklySavingsUsd: summary?.weeklySavingsUsd ?? state.weeklySavingsUsd,
      ledger: summary ? [...impactLedgerEntries, ...state.ledger.filter((entry) => entry.impactId !== impactId)] : state.ledger,
    }
  }

  if (action.type === 'start-sample-manifest-scan') {
    if (state.sampleManifestScan.status === 'scanning') return state
    return { ...state, sampleManifestScan: { status: 'scanning', fileName: action.fileName, startedAt: new Date().toISOString(), validationResults: [] } }
  }

  if (action.type === 'complete-sample-manifest-scan') {
    if (state.sampleManifestScan.status !== 'scanning') return state
    return { ...state, sampleManifestScan: { ...state.sampleManifestScan, status: 'complete', validationResults: sampleManifestFixture.validationResults } }
  }

  if (action.type === 'assign-crew-follow-up') {
    return {
      ...state,
      lastUpdated: `13 Nov 2026 · ${now} WAT`,
      crew: state.crew.map((member) => member.id === action.crewId ? { ...member, followUp: true } : member),
    }
  }

  if (action.type === 'set-wellbeing-offline') {
    return { ...state, wellbeing: { ...state.wellbeing, offline: action.value } }
  }

  if (action.type === 'set-wellbeing-identity-consent') {
    return { ...state, wellbeing: { ...state.wellbeing, identityConsent: action.value } }
  }

  if (action.type === 'set-wellbeing-shore-leave') {
    return { ...state, wellbeing: { ...state.wellbeing, shoreLeaveRequested: action.value } }
  }

  if (action.type === 'send-wellbeing-message') {
    const body = action.body.trim()
    if (!body) return state
    return { ...state, wellbeing: { ...state.wellbeing, messages: [...state.wellbeing.messages, { id: `wb-${Date.now()}`, sender: 'seafarer', body, time: `${now} WAT`, delivery: state.wellbeing.offline ? 'queued' : 'sent' }] } }
  }

  if (action.type === 'sync-wellbeing-messages') {
    if (state.wellbeing.offline) return state
    return { ...state, wellbeing: { ...state.wellbeing, messages: state.wellbeing.messages.map((message) => message.delivery === 'queued' ? { ...message, delivery: 'sent' } : message) } }
  }

  return state
}

export function getCrewAlertCount(state: MaritimeState) {
  return state.crew.filter((member) => member.risk === 'Elevated' && !member.followUp).length
}

export function getPendingDocumentCount(state: MaritimeState) {
  return state.documents.filter((document) => document.status !== 'Cleared').length
}
