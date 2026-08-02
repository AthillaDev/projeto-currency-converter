/**
 * Formata uma string digitada como valor monetário pt-BR em tempo real,
 * tratando os dois últimos dígitos como centavos (padrão de app bancário:
 * digitar "1000" vira "10,00", digitar mais um dígito vira "100,00").
 * @param {string} rawValue - valor atual do input (pode conter qualquer caractere)
 * @returns {string} valor formatado, ex: "10.000,00"
 */
export function maskCurrencyInput(rawValue) {
    const digitsOnly = rawValue.replace(/\D/g, "")

    if (!digitsOnly) {
        return ""
    }

    const numericValue = parseInt(digitsOnly, 10) / 100

    return numericValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}