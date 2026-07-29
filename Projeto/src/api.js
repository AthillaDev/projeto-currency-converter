// Responsável por falar com a AwesomeAPI e manter um cache simples
// em memória, evitando requisições repetidas em curto intervalo.

const API_URL = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL,CNY-BRL,JPY-BRL"
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutos

let ratesCache = null
let ratesCacheTime = 0

/**
 * Busca as cotações atuais (BRL como base), usando cache quando ainda válido.
 * @returns {Promise<{dolar:number, euro:number, libra:number, bitcoin:number, renminbi:number, iene:number}>}
 */
export async function fetchRates() {
    const now = Date.now()

    if (ratesCache && (now - ratesCacheTime) < CACHE_DURATION_MS) {
        return ratesCache
    }

    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error(`Falha ao buscar cotações: HTTP ${response.status}`)
    }

    const data = await response.json()

    ratesCache = {
        dolar: Number(data.USDBRL?.high) || 0,
        euro: Number(data.EURBRL?.high) || 0,
        libra: Number(data.GBPBRL?.high) || 0,
        bitcoin: Number(data.BTCBRL?.high) || 0,
        renminbi: Number(data.CNYBRL?.high) || 0,
        iene: Number(data.JPYBRL?.high) || 0,
    }
    ratesCacheTime = now

    return ratesCache
}

/** Força a próxima chamada a ignorar o cache (útil pra um botão de "atualizar cotação"). */
export function invalidateRatesCache() {
    ratesCache = null
    ratesCacheTime = 0
}