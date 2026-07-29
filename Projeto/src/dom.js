import { currencyConfig } from "./currencyConfig.js"

// Todos os elementos do DOM usados pela aplicação, centralizados aqui.
// Se o HTML mudar uma classe/id, só precisa atualizar este arquivo.
export const elements = {
    convertButton: document.querySelector(".convert-button"),
    currencySelectFrom: document.querySelector(".currency-select-from"),
    currencySelectTo: document.querySelector(".currency-select"),
    inputCurrency: document.querySelector(".input-currency"),
    currencyValueToConvert: document.querySelector(".currency-value-to-convert"),
    currencyValueConverted: document.querySelector(".currency-value"),
    currencyNameFrom: document.querySelector("#currency-name-from"),
    currencyNameTo: document.querySelector("#currency-name"),
    currencyImgFrom: document.querySelector(".currency-img-from"),
    currencyImgTo: document.querySelector(".currency-img"),
}

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

    elements.currencyNameTo.innerHTML = config.label
    elements.currencyImgTo.src = config.img
}

/** Exibe o valor de origem já formatado na tela. */
export function renderInputValue(formattedValue) {
    elements.currencyValueToConvert.innerHTML = formattedValue
}

/** Exibe o valor convertido já formatado na tela. */
export function renderConvertedValue(formattedValue) {
    elements.currencyValueConverted.innerHTML = formattedValue
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
        elements.convertButton.insertAdjacentElement("beforebegin", errorEl)
    }

    errorEl.textContent = message || ""
}

/** Alterna o estado visual de "carregando" no botão de converter. */
export function setLoading(isLoading) {
    elements.convertButton.disabled = isLoading
    elements.convertButton.textContent = isLoading ? "Convertendo..." : "Converter"
}