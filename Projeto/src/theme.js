const STORAGE_KEY = "convert-money-theme"

/**
 * Detecta o tema inicial: preferência salva > preferência do sistema > claro.
 * @returns {"light" | "dark"}
 */
function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "light" || saved === "dark") {
        return saved
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return prefersDark ? "dark" : "light"
}

/** Aplica o tema no <html> via data-attribute e salva a preferência. */
export function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(STORAGE_KEY, theme)
}

/** Deve ser chamado uma vez, ao carregar a página. */
export function initTheme() {
    applyTheme(getInitialTheme())
}

/** Alterna entre claro e escuro. */
export function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme")
    applyTheme(current === "dark" ? "light" : "dark")
}