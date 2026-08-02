import { currencyConfig } from "./currencyConfig.js"
import { formatTrend, formatCurrencyValue } from "./formatters.js"
import { drawSparkline } from "./chart.js"

// Todos os elementos do DOM usados pela aplicação, centralizados aqui.
// Se o HTML mudar uma classe/id, só precisa atualizar este arquivo.
export const elements = {
    convertButton: document.querySelector(".convert-button"),
    swapButton: document.querySelector(".swap-button"),
    themeToggle: document.querySelector(".theme-toggle"),
    copyButton: document.querySelector(".copy-button"),
    toast: document.querySelector(".toast"),
    quickAmountButtons: document.querySelectorAll(".quick-amount"),
    resultSection: document.querySelector(".result-section"),
    currencySelectFrom: document.querySelector(".currency-select-from"),
    currencySelectTo: document.querySelector(".currency-select"),
    inputCurrency: document.querySelector(".input-currency"),
    currencyValueToConvert: document.querySelector(".currency-value-to-convert"),
    currencyValueConverted: document.querySelector(".currency-value"),
    currencyNameFrom: document.querySelector("#currency-name-from"),
    currencyNameToText: document.querySelector(".currency-label-text"),
    currencyImgFrom: document.querySelector(".currency-img-from"),
    currencyImgTo: document.querySelector(".currency-img"),
    trendIndicator: document.querySelector(".trend-indicator"),
    quoteTimestamp: document.querySelector(".quote-timestamp"),
    chartCanvas: document.querySelector(".quote-chart"),
    chartEmptyMessage: document.querySelector(".chart-empty-message"),
    chartTitle: document.querySelector(".chart-title"),
    historyList: document.querySelector(".history-list"),
    clearHistoryButton: document.querySelector(".clear-history-button"),
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

let animationFrameId = null
let toastTimeoutId = null

/** Atualiza o label e o ícone exibidos para a moeda de origem. */
export function renderFromCurrencyInfo(currencyKey) {
    const config = currencyConfig[currencyKey]
    if (!config) return

    elements.currencyNameFrom.innerHTML = config.label
    elements.currencyImgFrom.src = config.img
}

/** Atualiza o label e o ícone exibidos para a moeda de destino. */
export function renderToCurrencyInfo(currencyKey) {
    const config = currencyConfig[currencyKey]
    if (!config) return

    elements.currencyNameToText.innerHTML = config.label
    elements.currencyImgTo.src = config.img
}

/** Exibe o valor de origem já formatado na tela. */
export function renderInputValue(formattedValue) {
    elements.currencyValueToConvert.innerHTML = formattedValue
}

/** Exibe o valor convertido já formatado na tela, sem animação. */
export function renderConvertedValue(formattedValue) {
    elements.currencyValueConverted.innerHTML = formattedValue
}

/**
 * Anima um número de `from` até `to` ao longo de `duration` ms, chamando
 * `onUpdate(valorAtual)` a cada frame. Ignora a animação (aplica direto o
 * valor final) se o usuário preferir menos movimento na tela.
 */
export function animateNumber(from, to, duration, onUpdate) {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }

    if (prefersReducedMotion || from === to) {
        onUpdate(to)
        return
    }

    const startTime = performance.now()

    function tick(now) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = from + (to - from) * eased

        onUpdate(current)

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(tick)
        }
    }

    animationFrameId = requestAnimationFrame(tick)
}

/** Dispara um flash visual breve no valor convertido, sinalizando atualização. */
export function flashResultHighlight() {
    const el = elements.currencyValueConverted
    el.classList.remove("value-flash")
    void el.offsetWidth
    el.classList.add("value-flash")
}

/** Dispara um pulso visual breve nos ícones das moedas ao inverter. */
export function pulseSwapIcons() {
    [elements.currencyImgFrom, elements.currencyImgTo].forEach((img) => {
        img.classList.remove("icon-pulse")
        void img.offsetWidth
        img.classList.add("icon-pulse")
    })
}

/** Exibe a seta de tendência (alta/baixa/estável) ao lado do nome da moeda de destino. */
export function renderTrend(pctChange) {
    if (!elements.trendIndicator) return

    const { arrow, direction, label } = formatTrend(pctChange)
    elements.trendIndicator.textContent = arrow
    elements.trendIndicator.className = `trend-indicator trend-${direction}`
    elements.trendIndicator.setAttribute("aria-label", label)
}

/** Exibe o texto "Cotação atualizada há X min" abaixo do resultado. */
export function renderTimestamp(relativeTimeText) {
    if (!elements.quoteTimestamp) return

    elements.quoteTimestamp.textContent = relativeTimeText
        ? `Cotação atualizada ${relativeTimeText}`
        : ""
}

/** Mostra um toast temporário (ex: confirmação de cópia), some sozinho depois de 2s. */
export function showToast(message) {
    if (!elements.toast) return

    elements.toast.textContent = message
    elements.toast.classList.add("toast--visible")

    clearTimeout(toastTimeoutId)
    toastTimeoutId = setTimeout(() => {
        elements.toast.classList.remove("toast--visible")
    }, 2000)
}

/**
 * Desenha o gráfico de variação da cotação, ou mostra a mensagem de estado
 * vazio quando a moeda selecionada não tem histórico (ex: Real).
 * @param {number[]} values
 * @param {string} currencyKey
 */
export function renderChart(values, currencyKey) {
    if (!elements.chartCanvas) return

    const config = currencyConfig[currencyKey]
    if (elements.chartTitle && config) {
        elements.chartTitle.textContent = `Variação — ${config.label} (15 dias)`
    }

    if (!values || values.length < 2) {
        elements.chartCanvas.style.display = "none"
        if (elements.chartEmptyMessage) elements.chartEmptyMessage.style.display = "block"
        return
    }

    elements.chartCanvas.style.display = "block"
    if (elements.chartEmptyMessage) elements.chartEmptyMessage.style.display = "none"

    const styles = getComputedStyle(document.documentElement)
    const strokeColor = styles.getPropertyValue("--color-accent").trim() || "#1B83E2"

    drawSparkline(elements.chartCanvas, values, {
        strokeColor,
        fillColor: `${strokeColor}33`, // adiciona transparência (~20%) ao preenchimento
    })
}

/**
 * Renderiza a lista de conversões recentes.
 * @param {Array<{fromCurrency:string, toCurrency:string, inputValue:number, convertedValue:number}>} entries
 */
export function renderHistory(entries) {
    if (!elements.historyList) return

    elements.historyList.innerHTML = ""

    if (!entries || entries.length === 0) {
        const emptyItem = document.createElement("li")
        emptyItem.className = "history-empty"
        emptyItem.textContent = "Nenhuma conversão recente"
        elements.historyList.appendChild(emptyItem)
        return
    }

    entries.forEach((entry) => {
        const item = document.createElement("li")
        item.className = "history-item"

        const fromText = formatCurrencyValue(entry.inputValue, entry.fromCurrency)
        const toText = formatCurrencyValue(entry.convertedValue, entry.toCurrency)

        item.innerHTML = `
            <span class="history-from">${fromText}</span>
            <span class="history-arrow">→</span>
            <span class="history-to">${toText}</span>
        `
        elements.historyList.appendChild(item)
    })
}

/**
 * Mostra ou limpa uma mensagem de erro abaixo dos campos.
 * Cria o elemento sob demanda na primeira vez que é chamado.
 */
export function renderError(message) {
    let errorEl = document.querySelector(".conversion-error")

    if (!errorEl) {
        errorEl = document.createElement("p")
        errorEl.className = "conversion-error"
        errorEl.setAttribute("role", "alert")
        elements.convertButton.insertAdjacentElement("beforebegin", errorEl)
    }

    errorEl.textContent = message || ""
}

/** Alterna o estado visual de "carregando" no botão e no valor convertido. */
export function setLoading(isLoading) {
    elements.convertButton.disabled = isLoading
    elements.convertButton.textContent = isLoading ? "Convertendo..." : "Converter"
    elements.currencyValueConverted.classList.toggle("is-loading", isLoading)
}
