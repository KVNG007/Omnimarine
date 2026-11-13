import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { calculateImpactTotals, defaultCalculationAssumptions, initialMaritimeState, initialVoyageImpacts, jitRecommendation, maritimeReducer, type MaritimeAction, type MaritimeState } from '@/data/mockMaritimeData'

const STORAGE_KEY = 'omnimarine.maritime-demo.v2'

interface MaritimeDataContextValue {
  state: MaritimeState
  dispatch: Dispatch<MaritimeAction>
}

const MaritimeDataContext = createContext<MaritimeDataContextValue | null>(null)

function readStoredState(): MaritimeState {
  if (typeof window === 'undefined') return initialMaritimeState
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return initialMaritimeState
    const parsed = JSON.parse(stored) as Partial<MaritimeState>
    const vessels = (Array.isArray(parsed.vessels) ? parsed.vessels : initialMaritimeState.vessels).map((vessel) => {
      const seededVessel = initialMaritimeState.vessels.find((item) => item.id === vessel.id)
      return {
        ...seededVessel,
        ...vessel,
        mapPosition: vessel.mapPosition ?? seededVessel?.mapPosition ?? { x: 150, y: 285 },
      }
    })
    const clearanceCases = Array.isArray(parsed.clearanceCases) ? parsed.clearanceCases : initialMaritimeState.clearanceCases
    const calculationAssumptions = parsed.calculationAssumptions ?? defaultCalculationAssumptions
    const voyageImpacts = Array.isArray(parsed.voyageImpacts)
      ? parsed.voyageImpacts
      : initialVoyageImpacts.map((impact) => {
        if (impact.source === 'JIT arrival' && vessels.find((vessel) => vessel.id === impact.vesselId)?.jitApplied) {
          return { ...impact, actualWaitHours: 0, speedOptimizationHours: jitRecommendation.currentEtaHours }
        }
        if (impact.source === 'Pre-arrival clearance' && clearanceCases.find((item) => item.id === 'case-ng-8841')?.status === 'Pre-Cleared') {
          const clearanceCase = clearanceCases.find((item) => item.id === 'case-ng-8841')
          return { ...impact, actualWaitHours: 0, storageFeesAvoidedUsd: clearanceCase?.storageFeesAvoidedUsd ?? impact.storageFeesAvoidedUsd }
        }
        return impact
      })
    const impactSummary = calculateImpactTotals(voyageImpacts, calculationAssumptions)
    return {
      ...initialMaritimeState,
      ...parsed,
      totals: { ...initialMaritimeState.totals, ...parsed.totals, ...impactSummary.totals },
      weeklySavingsUsd: impactSummary.weeklySavingsUsd,
      calculationAssumptions,
      voyageImpacts,
      berths: (Array.isArray(parsed.berths) ? parsed.berths : initialMaritimeState.berths).map((berth) => {
        const seededBerth = initialMaritimeState.berths.find((item) => item.id === berth.id)
        return {
          ...seededBerth,
          ...berth,
          mapPosition: berth.mapPosition ?? seededBerth?.mapPosition ?? { x: 600, y: 220 },
        }
      }),
      vessels,
      documents: Array.isArray(parsed.documents) ? parsed.documents : initialMaritimeState.documents,
      clearanceCases,
      sampleManifestScan: parsed.sampleManifestScan ?? initialMaritimeState.sampleManifestScan,
      crew: Array.isArray(parsed.crew) ? parsed.crew : initialMaritimeState.crew,
      wellbeing: {
        ...initialMaritimeState.wellbeing,
        ...(parsed.wellbeing ?? {}),
        messages: Array.isArray(parsed.wellbeing?.messages) ? parsed.wellbeing.messages : initialMaritimeState.wellbeing.messages,
      },
      ledger: Array.isArray(parsed.ledger) ? parsed.ledger : initialMaritimeState.ledger,
    }
  } catch {
    return initialMaritimeState
  }
}

function replaceState(state: MaritimeState): MaritimeAction {
  return { type: 'replace-state', state }
}

export function MaritimeDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(maritimeReducer, undefined, readStoredState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // The demo remains usable in memory when browser storage is unavailable.
    }
  }, [state])

  useEffect(() => {
    function syncAcrossTabs(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        dispatch(replaceState(JSON.parse(event.newValue) as MaritimeState))
      } catch {
        // Ignore malformed values and retain the current in-memory demo state.
      }
    }
    window.addEventListener('storage', syncAcrossTabs)
    return () => window.removeEventListener('storage', syncAcrossTabs)
  }, [])

  return <MaritimeDataContext.Provider value={{ state, dispatch }}>{children}</MaritimeDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMaritimeData() {
  const context = useContext(MaritimeDataContext)
  if (!context) throw new Error('useMaritimeData must be used within MaritimeDataProvider')
  return context
}
