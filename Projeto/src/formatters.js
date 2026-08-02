import { currencyConfig } from "./currencyConfig.js"

/**
 * Converte a string digitada pelo usuário (formato pt-BR, ex: "10.000,00")
 * em número. Bug histórico: usar /./g numa regex remove QUALQUER caractere,
 * pois "." em regex significa "qualquer caractere", não "ponto literal".
 * Por isso escapamos com /\./g.
 * @param {string} rawValue
 * @returns {number}
 */
export function parseInputValue(rawValue) {
    if (!rawValue) return 0
    const normalized = rawValue.replace(/\./g, "").replace(",", ".")
    return parseFloat(normalized) || 0
}

/**
 * Formata um valor numérico de acordo com a moeda selecionada.
 * @param {number} value
 * @param {string} currencyKey - chave presente em currencyConfig
 * @returns {string}
 */
export function formatCurrencyValue(value, currencyKey) {
    const config = currencyConfig[currencyKey]

    if (currencyKey === "bitcoin") {
        return value.toFixed(8) + " BTC"
    }

    if (config?.locale && config?.currency) {
        return value.toLocaleString(config.locale, { style: "currency", currency: config.currency })
    }

    return value.toString()
}

/**
 * Converte um valor de uma moeda de origem para uma moeda de destino,
 * usando o Real como moeda-ponte (é a base fornecida pela API).
 * @param {number} amount - valor na moeda de origem
 * @param {string} fromCurrency
 * @param {string} toCurrency
 * @param {object} rates - objeto retornado por fetchRates()
 * @returns {number} valor convertido na moeda de destino
 */
export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
    const valueInReal = fromCurrency === "real"
        ? amount
        : amount * (rates[fromCurrency] || 0)

    if (toCurrency === "real") {
        return valueInReal
    }

    const rate = rates[toCurrency] || 0
    return rate ? valueInReal / rate : 0
}

/**
 * Interpreta uma variação percentual do dia em direção de tendência.
 * @param {number} pctChange
 * @returns {{ arrow: string, direction: "up" | "down" | "neutral", label: string }}
 */
export function formatTrend(pctChange) {
    if (pctChange > 0) {
        return { arrow: "▲", direction: "up", label: `Em alta (${pctChange.toFixed(2)}% hoje)` }
    }
    if (pctChange < 0) {
        return { arrow: "▼", direction: "down", label: `Em baixa (${pctChange.toFixed(2)}% hoje)` }
    }
    return { arrow: "•", direction: "neutral", label: "Estável hoje" }
}

/**
 * Formata um timestamp em texto relativo curto, em português.
 * @param {number | null} timestampMs
 * @returns {string} ex: "há 2 minutos", ou "" se timestamp inválido
 */
export function formatRelativeTime(timestampMs) {
    if (!timestampMs) return ""

    const diffSeconds = Math.round((Date.now() - timestampMs) / 1000)

    if (diffSeconds < 60) return "agora mesmo"

    const diffMinutes = Math.round(diffSeconds / 60)
    if (diffMinutes < 60) {
        return diffMinutes === 1 ? "há 1 minuto" : `há ${diffMinutes} minutos`
    }

    const diffHours = Math.round(diffMinutes / 60)
    return diffHours === 1 ? "há 1 hora" : `há ${diffHours} horas`
}