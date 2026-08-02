import { fetchRates, getPctChange, getLastFetchTime, fetchHistoricalRates } from "./api.js"
import { parseInputValue, formatCurrencyValue, convertCurrency, formatRelativeTime } from "./formatters.js"
import { maskCurrencyInput } from "./inputMask.js"
import { initTheme, toggleTheme } from "./theme.js"
import { copyToClipboard } from "./clipboard.js"
import { onSwipe } from "./swipeGesture.js"
import { addHistoryEntry, getHistory, clearHistory } from "./history.js"
import {
    elements,
    renderFromCurrencyInfo,
    renderToCurrencyInfo,
    renderInputValue,
    renderConvertedValue,
    renderError,
    setLoading,
    animateNumber,
    flashResultHighlight,
    pulseSwapIcons,
    renderTrend,
    renderTimestamp,
    showToast,
    renderChart,
    renderHistory,
} from "./dom.js"

let lastConvertedValue = 0
let lastToCurrency = null
let lastChartCurrency = null

/** Busca e desenha o gráfico de variação pra moeda de destino, evitando refetch repetido. */
async function updateChart(toCurrency) {
    if (toCurrency === lastChartCurrency) return
    lastChartCurrency = toCurrency

    try {
        const values = await fetchHistoricalRates(toCurrency, 15)
        renderChart(values, toCurrency)
    } catch (err) {
        console.error("Erro ao buscar histórico de cotação:", err)
        renderChart([], toCurrency)
    }
}

async function convertValues() {
    renderError("")
    setLoading(true)

    try {
        const inputValue = parseInputValue(elements.inputCurrency.value)
        const fromCurrency = elements.currencySelectFrom.value
        const toCurrency = elements.currencySelectTo.value

        const rates = await fetchRates()
        const convertedValue = convertCurrency(inputValue, fromCurrency, toCurrency, rates)

        if (toCurrency === lastToCurrency) {
            animateNumber(lastConvertedValue, convertedValue, 450, (currentValue) => {
                renderConvertedValue(formatCurrencyValue(currentValue, toCurrency))
            })
        } else {
            renderConvertedValue(formatCurrencyValue(convertedValue, toCurrency))
        }
        flashResultHighlight()

        lastConvertedValue = convertedValue
        lastToCurrency = toCurrency

        renderInputValue(formatCurrencyValue(inputValue, fromCurrency))
        renderTrend(getPctChange(toCurrency))
        renderTimestamp(formatRelativeTime(getLastFetchTime()))

        // Só registra no histórico conversões reais (evita poluir com o valor 0 inicial)
        if (inputValue > 0) {
            const updatedHistory = addHistoryEntry({
                fromCurrency,
                toCurrency,
                inputValue,
                convertedValue,
                timestamp: Date.now(),
            })
            renderHistory(updatedHistory)
        }

        updateChart(toCurrency)
    } catch (err) {
        console.error("Erro ao converter valores:", err)
        renderError("Não foi possível buscar a cotação agora. Tente novamente em instantes.")
    } finally {
        setLoading(false)
    }
}

function handleFromCurrencyChange() {
    renderFromCurrencyInfo(elements.currencySelectFrom.value)
    convertValues()
}

function handleToCurrencyChange() {
    renderToCurrencyInfo(elements.currencySelectTo.value)
    convertValues()
}

function handleSwapCurrencies() {
    const fromValue = elements.currencySelectFrom.value
    const toValue = elements.currencySelectTo.value

    elements.currencySelectFrom.value = toValue
    elements.currencySelectTo.value = fromValue

    renderFromCurrencyInfo(elements.currencySelectFrom.value)
    renderToCurrencyInfo(elements.currencySelectTo.value)
    pulseSwapIcons()
    convertValues()
}

function handleInputMask(event) {
    event.target.value = maskCurrencyInput(event.target.value)
}

function handleInputKeydown(event) {
    if (event.key === "Enter") {
        convertValues()
    }
}

function handleQuickAmountClick(event) {
    const cents = event.currentTarget.dataset.amount
    elements.inputCurrency.value = maskCurrencyInput(cents)
    convertValues()
}

async function handleCopyClick() {
    const text = elements.currencyValueConverted.textContent
    const success = await copyToClipboard(text)
    showToast(success ? "Valor copiado!" : "Não foi possível copiar")
}

function handleClearHistory() {
    clearHistory()
    renderHistory([])
}

elements.currencySelectFrom.addEventListener("change", handleFromCurrencyChange)
elements.currencySelectTo.addEventListener("change", handleToCurrencyChange)
elements.convertButton.addEventListener("click", convertValues)
elements.swapButton.addEventListener("click", handleSwapCurrencies)
elements.inputCurrency.addEventListener("input", handleInputMask)
elements.inputCurrency.addEventListener("keydown", handleInputKeydown)
elements.themeToggle.addEventListener("click", toggleTheme)
elements.copyButton?.addEventListener("click", handleCopyClick)
elements.clearHistoryButton?.addEventListener("click", handleClearHistory)
elements.quickAmountButtons?.forEach((button) => {
    button.addEventListener("click", handleQuickAmountClick)
})

onSwipe(elements.resultSection, handleSwapCurrencies)

// Registra o service worker (PWA), se o navegador suportar
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch((err) => {
            console.error("Erro ao registrar service worker:", err)
        })
    })
}

initTheme()
renderHistory(getHistory())

// Conversão inicial ao carregar a página, pra não ficar com os
// valores estáticos definidos no HTML.
convertValues()
