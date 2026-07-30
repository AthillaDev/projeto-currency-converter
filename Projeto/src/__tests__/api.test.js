import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const mockApiResponse = {
    USDBRL: { high: "5.20" },
    EURBRL: { high: "6.10" },
    BTCBRL: { high: "350000.00" },
    GBPBRL: { high: "7.05" },
    CNYBRL: { high: "0.75" },
    JPYBRL: { high: "0.035" },
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