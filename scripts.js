const convertButton = document.querySelector(".convert-button");
const currencySelectFrom = document.querySelector(".currency-select-from")
const currencySelectTo = document.querySelector(".currency-select")

function convertValues() {
    const inputCurrencyValue = document.querySelector(".input-currency").value
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    const currencyValueConverted = document.querySelector(".currency-value")
    
    // Pegando as moedas selecionadas
    const fromCurrency = currencySelectFrom.value
    const toCurrency = currencySelectTo.value
    
    // Taxas de câmbio em relação ao Real
    const realToday = 1.0
    const dolarToday = 5.0
    const euroToday = 6.0
    const libraToday = 6.7
    const bitcoinToday = 300000
    const renminbiToday = 0.73
    const ienesToday = 0.031
    
    // Primeiro, converter o valor para Real
    let valueInReal = inputCurrencyValue
    
    if (fromCurrency == "dolar") {
        valueInReal = inputCurrencyValue * dolarToday
    }
    if (fromCurrency == "euro") {
        valueInReal = inputCurrencyValue * euroToday
    }
    if (fromCurrency == "libra") {
        valueInReal = inputCurrencyValue * libraToday
    }
    if (fromCurrency == "bitcoin") {
        valueInReal = inputCurrencyValue * bitcoinToday
    }
    if (fromCurrency == "renminbi") {
        valueInReal = inputCurrencyValue * renminbiToday
    }
    if (fromCurrency == "iene") {
        valueInReal = inputCurrencyValue * ienesToday
    }
    
    // Agora converter de Real para a moeda de destino
    let convertedValue = valueInReal
    
    if (toCurrency == "dolar") {
        convertedValue = valueInReal / dolarToday
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(convertedValue)
    }
    if (toCurrency == "euro") {
        convertedValue = valueInReal / euroToday
        currencyValueConverted.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(convertedValue)
    }
    if (toCurrency == "libra") {
        convertedValue = valueInReal / libraToday
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP"
        }).format(convertedValue)
    }
    if (toCurrency == "bitcoin") {
        convertedValue = valueInReal / bitcoinToday
        currencyValueConverted.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BTC"
        }).format(convertedValue)
    }
    if (toCurrency == "renminbi") {
        convertedValue = valueInReal / renminbiToday
        currencyValueConverted.innerHTML = new Intl.NumberFormat("zh-CN", {
            style: "currency",
            currency: "CNY"
        }).format(convertedValue)
    }
    if (toCurrency == "iene") {
        convertedValue = valueInReal / ienesToday
        currencyValueConverted.innerHTML = new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY"
        }).format(convertedValue)
    }
    if (toCurrency == "real") {
        currencyValueConverted.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valueInReal)
    }
    
    // Exibir o valor de entrada (moeda DE)
    if (fromCurrency == "real") {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(inputCurrencyValue)
    }
    if (fromCurrency == "dolar") {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(inputCurrencyValue)
    }
    if (fromCurrency == "euro") {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR"
        }).format(inputCurrencyValue)
    }
    if (fromCurrency == "libra") {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP"
        }).format(inputCurrencyValue)
    }
    if (fromCurrency == "bitcoin") {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "BTC"
        }).format(inputCurrencyValue)
    }
    if (fromCurrency == "renminbi") {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("zh-CN", {
            style: "currency",
            currency: "CNY"
        }).format(inputCurrencyValue)
    }
    if (fromCurrency == "iene") {
        currencyValueToConvert.innerHTML = new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY"
        }).format(inputCurrencyValue)
    }
}

function changeCurrencyFrom() {
    const currencyNameFrom = document.querySelector("#currency-name-from")
    const currencyImgFrom = document.querySelector(".currency-img-from")
    const fromCurrency = currencySelectFrom.value
    
    if (fromCurrency == "real") {
        currencyNameFrom.innerHTML = "Real"
        currencyImgFrom.src = "./assets/REAL.png"
    }
    if (fromCurrency == "dolar") {
        currencyNameFrom.innerHTML = "Dólar Americano"
        currencyImgFrom.src = "./assets/DOLAR.png"
    }
    if (fromCurrency == "euro") {
        currencyNameFrom.innerHTML = "Euro"
        currencyImgFrom.src = "./assets/EURO.png"
    }
    if (fromCurrency == "libra") {
        currencyNameFrom.innerHTML = "Libra"
        currencyImgFrom.src = "./assets/LIBRA.png"
    }
    if (fromCurrency == "bitcoin") {
        currencyNameFrom.innerHTML = "Bitcoin"
        currencyImgFrom.src = "./assets/BITCOIN.png"
    }
    if (fromCurrency == "renminbi") {
        currencyNameFrom.innerHTML = "Renminbi Chines"
        currencyImgFrom.src = "./assets/CHINA.png"
    }
    if (fromCurrency == "iene") {
        currencyNameFrom.innerHTML = "Iene Japones"
        currencyImgFrom.src = "./assets/JAPAO.png"
    }
    
    convertValues()
}

function changeCurrencyTo() {
    const currencyName = document.querySelector("#currency-name")
    const currencyImg = document.querySelector(".currency-img")
    const toCurrency = currencySelectTo.value
    
    if (toCurrency == "real") {
        currencyName.innerHTML = "Real"
        currencyImg.src = "./assets/REAL.png"
    }
    if (toCurrency == "dolar") {
        currencyName.innerHTML = "Dólar Americano"
        currencyImg.src = "./assets/DOLAR.png"
    }
    if (toCurrency == "euro") {
        currencyName.innerHTML = "Euro"
        currencyImg.src = "./assets/EURO.png"
    }
    if (toCurrency == "libra") {
        currencyName.innerHTML = "Libra"
        currencyImg.src = "./assets/LIBRA.png"
    }
    if (toCurrency == "bitcoin") {
        currencyName.innerHTML = "Bitcoin"
        currencyImg.src = "./assets/BITCOIN.png"
    }
    if (toCurrency == "renminbi") {
        currencyName.innerHTML = "Renminbi Chines"
        currencyImg.src = "./assets/CHINA.png"
    }
    if (toCurrency == "iene") {
        currencyName.innerHTML = "Iene Japones"
        currencyImg.src = "./assets/JAPAO.png"
    }
    
    convertValues()
}

currencySelectFrom.addEventListener("change", changeCurrencyFrom)
currencySelectTo.addEventListener("change", changeCurrencyTo)
convertButton.addEventListener("click", convertValues)
