import { describe, it, expect } from "vitest"
import {
    parseInputValue,
    formatCurrencyValue,
    convertCurrency,
    formatTrend,
    formatRelativeTime,
} from "../formatters.js"

describe("parseInputValue", () => {
    it("converte um valor no formato pt-BR com separador de milhar", () => {
        expect(parseInputValue("10.000,00")).toBe(10000)
    })

    it("converte um valor simples com vírgula decimal", () => {
        expect(parseInputValue("99,90")).toBe(99.9)
    })

    it("converte um valor inteiro sem separadores", () => {
        expect(parseInputValue("500")).toBe(500)
    })

    it("retorna 0 para string vazia", () => {
        expect(parseInputValue("")).toBe(0)
    })

    it("retorna 0 para valor inválido", () => {
        expect(parseInputValue("abc")).toBe(0)
    })

    it("retorna 0 para undefined/null", () => {
        expect(parseInputValue(undefined)).toBe(0)
        expect(parseInputValue(null)).toBe(0)
    })

    // Teste de regressão do bug original:
    // /./g (sem escapar o ponto) apagava a string inteira e retornava sempre 0.
    it("não zera o valor quando há múltiplos separadores de milhar", () => {
        expect(parseInputValue("1.234.567,89")).toBe(1234567.89)
    })
})

describe("formatCurrencyValue", () => {
    it("formata Real corretamente", () => {
        expect(formatCurrencyValue(1000, "real")).toBe(
            (1000).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        )
    })

    it("formata Dólar corretamente", () => {
        expect(formatCurrencyValue(50, "dolar")).toBe(
            (50).toLocaleString("en-US", { style: "currency", currency: "USD" })
        )
    })

    it("formata Bitcoin com 8 casas decimais e sufixo BTC", () => {
        expect(formatCurrencyValue(0.00123456, "bitcoin")).toBe("0.00123456 BTC")
    })

    it("retorna string simples para chave desconhecida", () => {
        expect(formatCurrencyValue(42, "moeda-inexistente")).toBe("42")
    })
})

describe("convertCurrency", () => {
    const rates = {
        dolar: 5,
        euro: 6,
        libra: 7,
        bitcoin: 300000,
        renminbi: 0.7,
        iene: 0.03,
    }

    it("converte Real para Dólar", () => {
        expect(convertCurrency(100, "real", "dolar", rates)).toBe(20)
    })

    it("converte Dólar para Real", () => {
        expect(convertCurrency(20, "dolar", "real", rates)).toBe(100)
    })

    it("converte entre duas moedas estrangeiras via Real como ponte", () => {
        expect(convertCurrency(10, "dolar", "euro", rates)).toBeCloseTo(8.3333, 4)
    })

    it("retorna o mesmo valor quando origem e destino são Real", () => {
        expect(convertCurrency(250, "real", "real", rates)).toBe(250)
    })

    it("retorna 0 quando a taxa de destino é 0 (evita divisão por zero)", () => {
        const brokenRates = { ...rates, dolar: 0 }
        expect(convertCurrency(100, "real", "dolar", brokenRates)).toBe(0)
    })

    it("trata moeda de origem desconhecida como taxa 0", () => {
        expect(convertCurrency(100, "moeda-invalida", "real", rates)).toBe(0)
    })
})

describe("formatTrend", () => {
    it("retorna direção 'up' para variação positiva", () => {
        const result = formatTrend(1.25)
        expect(result.direction).toBe("up")
        expect(result.arrow).toBe("▲")
    })

    it("retorna direção 'down' para variação negativa", () => {
        const result = formatTrend(-0.5)
        expect(result.direction).toBe("down")
        expect(result.arrow).toBe("▼")
    })

    it("retorna direção 'neutral' para variação zero", () => {
        const result = formatTrend(0)
        expect(result.direction).toBe("neutral")
        expect(result.arrow).toBe("•")
    })
})

describe("formatRelativeTime", () => {
    it("retorna string vazia para timestamp inválido", () => {
        expect(formatRelativeTime(null)).toBe("")
        expect(formatRelativeTime(undefined)).toBe("")
        expect(formatRelativeTime(0)).toBe("")
    })

    it("retorna 'agora mesmo' para menos de 60 segundos atrás", () => {
        const thirtySecondsAgo = Date.now() - 30 * 1000
        expect(formatRelativeTime(thirtySecondsAgo)).toBe("agora mesmo")
    })

    it("retorna minutos no singular corretamente", () => {
        const oneMinuteAgo = Date.now() - 60 * 1000
        expect(formatRelativeTime(oneMinuteAgo)).toBe("há 1 minuto")
    })

    it("retorna minutos no plural corretamente", () => {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
        expect(formatRelativeTime(fiveMinutesAgo)).toBe("há 5 minutos")
    })

    it("retorna horas quando passa de 60 minutos", () => {
        const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
        expect(formatRelativeTime(twoHoursAgo)).toBe("há 2 horas")
    })
})
