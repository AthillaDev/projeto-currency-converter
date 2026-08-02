import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const mockApiResponse = {
    USDBRL: { high: "5.20", pctChange: "0.85" },
    EURBRL: { high: "6.10", pctChange: "-0.32" },
    BTCBRL: { high: "350000.00", pctChange: "0" },
    GBPBRL: { high: "7.05", pctChange: "1.10" },
    CNYBRL: { high: "0.75", pctChange: "0.02" },
    JPYBRL: { high: "0.035", pctChange: "-0.10" },
}

describe("api.js — fetchRates", () => {
    beforeEach(() => {
        vi.resetModules()
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("busca e converte as cotações corretamente", async () => {
        const { fetchRates } = await import("../api.js")
        const rates = await fetchRates()

        expect(rates.dolar).toBe(5.2)
        expect(rates.euro).toBe(6.1)
        expect(rates.bitcoin).toBe(350000)
        expect(rates.libra).toBe(7.05)
        expect(rates.renminbi).toBe(0.75)
        expect(rates.iene).toBe(0.035)
    })

    it("usa cache em chamadas subsequentes, sem repetir o fetch", async () => {
        const { fetchRates } = await import("../api.js")

        await fetchRates()
        await fetchRates()
        await fetchRates()

        expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it("busca de novo depois de invalidateRatesCache()", async () => {
        const { fetchRates, invalidateRatesCache } = await import("../api.js")

        await fetchRates()
        invalidateRatesCache()
        await fetchRates()

        expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it("lança erro quando a resposta HTTP não é ok", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })
        const { fetchRates } = await import("../api.js")

        await expect(fetchRates()).rejects.toThrow("Falha ao buscar cotações")
    })

    it("usa fallback de 0 quando algum campo vem ausente/malformado", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ USDBRL: { high: "5.20" } }),
        })
        const { fetchRates } = await import("../api.js")
        const rates = await fetchRates()

        expect(rates.dolar).toBe(5.2)
        expect(rates.euro).toBe(0)
        expect(rates.bitcoin).toBe(0)
    })
})

describe("api.js — getPctChange", () => {
    beforeEach(() => {
        vi.resetModules()
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("retorna 0 antes de qualquer fetch bem-sucedido", async () => {
        const { getPctChange } = await import("../api.js")
        expect(getPctChange("dolar")).toBe(0)
    })

    it("retorna a variação percentual correta após o fetch", async () => {
        const { fetchRates, getPctChange } = await import("../api.js")
        await fetchRates()

        expect(getPctChange("dolar")).toBe(0.85)
        expect(getPctChange("euro")).toBe(-0.32)
    })

    it("retorna 0 para uma chave de moeda desconhecida", async () => {
        const { fetchRates, getPctChange } = await import("../api.js")
        await fetchRates()

        expect(getPctChange("moeda-invalida")).toBe(0)
    })
})

describe("api.js — getLastFetchTime", () => {
    beforeEach(() => {
        vi.resetModules()
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockApiResponse),
        })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("retorna null antes de qualquer fetch bem-sucedido", async () => {
        const { getLastFetchTime } = await import("../api.js")
        expect(getLastFetchTime()).toBeNull()
    })

    it("retorna um timestamp numérico após o fetch", async () => {
        const { fetchRates, getLastFetchTime } = await import("../api.js")
        await fetchRates()

        expect(typeof getLastFetchTime()).toBe("number")
        expect(getLastFetchTime()).toBeGreaterThan(0)
    })
})