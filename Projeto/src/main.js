import { fetchRates } from "./api.js"
import { parseInputValue, formatCurrencyValue, convertCurrency } from "./formatters.js"
import {
    elements,
    renderFromCurrencyInfo,
    renderToCurrencyInfo,
    renderInputValue,
    renderConvertedValue,
    renderError,
    setLoading,
} from "./dom.js"

async function convertValues() {
    renderError("")
    setLoading(true)

    try {
        const inputValue = parseInputValue(elements.inputCurrency.value)
        const fromCurrency = elements.currencySelectFrom.value
        const toCurrency = elements.currencySelectTo.value

        const rates = await fetchRates()
        const convertedValue = convertCurrency(inputValue, fromCurrency, toCurrency, rates)

        renderConvertedValue(formatCurrencyValue(convertedValue, toCurrency))
        renderInputValue(formatCurrencyValue(inputValue, fromCurrency))
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

elements.currencySelectFrom.addEventListener("change", handleFromCurrencyChange)
elements.currencySelectTo.addEventListener("change", handleToCurrencyChange)
elements.convertButton.addEventListener("click", convertValues)

// Conversão inicial ao carregar a página, pra não ficar com os
// valores estáticos "R$ 0,00" / "US$ 0.0" definidos no HTML.
convertValues()

/*
  IMPORTANTE — pra este arquivo funcionar como módulo ES, o <script> no
  index.html precisa ter o atributo type="module":

    <script type="module" src="./src/main.js"></script>

  Módulos ES respeitam CORS/protocolo file://, então rodando local é
  recomendado servir com um servidor simples (ex: `npx serve` ou a
  extensão "Live Server" do VS Code) em vez de abrir o index.html direto
  no navegador (file://) — senão o import vai falhar.
*/