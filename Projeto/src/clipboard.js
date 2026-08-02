/**
 * Copia um texto pra área de transferência, com fallback pra navegadores
 * antigos ou contextos não seguros (http) onde a Clipboard API não existe.
 * @param {string} text
 * @returns {Promise<boolean>} true se copiou com sucesso
 */
export async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (err) {
            console.error("Erro ao copiar via Clipboard API:", err)
        }
    }

    // Fallback: cria um textarea invisível, seleciona e usa execCommand
    try {
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        return true
    } catch (err) {
        console.error("Erro ao copiar (fallback):", err)
        return false
    }
}