import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { initialMaritimeState, maritimeReducer, type MaritimeAction, type MaritimeState } from '@/data/mockMaritimeData'

const STORAGE_KEY = 'omnimarine.maritime-demo.v1'

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
    return {
      ...initialMaritimeState,
      ...parsed,
      totals: { ...initialMaritimeState.totals, ...parsed.totals },
      weeklySavingsUsd: Array.isArray(parsed.weeklySavingsUsd) ? parsed.weeklySavingsUsd : initialMaritimeState.weeklySavingsUsd,
      vessels: Array.isArray(parsed.vessels) ? parsed.vessels : initialMaritimeState.vessels,
      documents: Array.isArray(parsed.documents) ? parsed.documents : initialMaritimeState.documents,
      crew: Array.isArray(parsed.crew) ? parsed.crew : initialMaritimeState.crew,
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
