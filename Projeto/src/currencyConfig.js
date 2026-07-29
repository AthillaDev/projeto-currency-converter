// Configuração central de cada moeda: locale/currency pra formatação,
// label exibido e caminho da imagem. Única fonte de verdade — se precisar
// adicionar uma moeda nova, mexe só aqui.
export const currencyConfig = {
    real:     { locale: "pt-BR", currency: "BRL", label: "Real",              img: "./assets/REAL.png" },
    dolar:    { locale: "en-US", currency: "USD", label: "Dólar Americano",   img: "./assets/DOLAR.png" },
    euro:     { locale: "de-DE", currency: "EUR", label: "Euro",              img: "./assets/EURO.png" },
    libra:    { locale: "en-GB", currency: "GBP", label: "Libra",             img: "./assets/LIBRA.png" },
    bitcoin:  { locale: null,    currency: null,  label: "Bitcoin",           img: "./assets/BITCOIN.png" },
    renminbi: { locale: "zh-CN", currency: "CNY", label: "Renminbi Chines",   img: "./assets/CHINA.png" },
    iene:     { locale: "ja-JP", currency: "JPY", label: "Iene Japones",      img: "./assets/JAPAO.png" },
}