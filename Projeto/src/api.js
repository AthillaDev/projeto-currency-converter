// Responsável por falar com a AwesomeAPI e manter um cache simples
// em memória, evitando requisições repetidas em curto intervalo.

const API_URL = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL,CNY-BRL,JPY-BRL"
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutos

// Mapeia nossas chaves internas para o campo/par correspondente na AwesomeAPI
const API_FIELD_MAP = {
    dolar: "USDBRL",
    euro: "EURBRL",
    libra: "GBPBRL",
    bitcoin: "BTCBRL",
    renminbi: "CNYBRL",
    iene: "JPYBRL",
}

const HISTORICAL_PAIR_MAP = {
    dolar: "USD-BRL",
    euro: "EUR-BRL",
    libra: "GBP-BRL",
    bitcoin: "BTC-BRL",
    renminbi: "CNY-BRL",
    iene: "JPY-BRL",
}

let ratesCache = null
let ratesCacheTime = 0
let rawDataCache = null

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
    rawDataCache = data

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
    rawDataCache = null
}

/**
 * Retorna a variação percentual do dia (%) para uma moeda, com base
 * na última busca bem-sucedida. Retorna 0 se ainda não buscou ou moeda inválida.
 * @param {string} currencyKey
 * @returns {number}
 */
export function getPctChange(currencyKey) {
    const field = API_FIELD_MAP[currencyKey]
    if (!rawDataCache || !field) return 0
    return Number(rawDataCache[field]?.pctChange) || 0
}

/**
 * Timestamp (ms, epoch) da última busca bem-sucedida, ou null se nunca buscou.
 * @returns {number | null}
 */
export function getLastFetchTime() {
    return ratesCacheTime || null
}

/**
 * Busca o histórico de cotação (valor "high" por dia) dos últimos `days` dias
 * pra uma moeda em relação ao Real. Retorna em ordem cronológica (mais antigo
 * primeiro). Retorna array vazio se a moeda não tiver histórico disponível
 * (ex: "real", que não tem cotação contra si mesma).
 * @param {string} currencyKey
 * @param {number} days
 * @returns {Promise<number[]>}
 */
export async function fetchHistoricalRates(currencyKey, days = 15) {
    const pair = HISTORICAL_PAIR_MAP[currencyKey]
    if (!pair) return []

    const response = await fetch(`https://economia.awesomeapi.com.br/json/daily/${pair}/${days}`)

    if (!response.ok) {
        throw new Error(`Falha ao buscar histórico: HTTP ${response.status}`)
    }

    const data = await response.json()

    // A API retorna do mais recente pro mais antigo; invertendo pra ordem cronológica
    return data.map((item) => Number(item.high)).filter((value) => !Number.isNaN(value)).reverse()
}