const STORAGE_KEY = "trocca-history"
const MAX_ENTRIES = 8

/**
 * Retorna o histórico salvo, mais recente primeiro.
 * @returns {Array<{id:string, fromCurrency:string, toCurrency:string, inputValue:number, convertedValue:number, timestamp:number}>}
 */
export function getHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch (err) {
        console.error("Erro ao ler histórico:", err)
        return []
    }
}

/**
 * Adiciona uma nova entrada ao histórico (no topo) e mantém só as últimas MAX_ENTRIES.
 * @param {{fromCurrency:string, toCurrency:string, inputValue:number, convertedValue:number, timestamp:number}} entry
 * @returns {Array} histórico atualizado
 */
export function addHistoryEntry(entry) {
    const history = getHistory()
    const withId = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
    const updated = [withId, ...history].slice(0, MAX_ENTRIES)

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (err) {
        console.error("Erro ao salvar histórico:", err)
    }

    return updated
}

/** Limpa todo o histórico salvo. */
export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY)
}