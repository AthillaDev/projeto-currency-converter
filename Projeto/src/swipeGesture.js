/**
 * Detecta um gesto de swipe horizontal num elemento e chama `callback`
 * com a direção ("left" | "right") quando o arrasto ultrapassa `threshold` px.
 * @param {HTMLElement} element
 * @param {(direction: "left" | "right") => void} callback
 * @param {number} threshold
 */
export function onSwipe(element, callback, threshold = 50) {
    if (!element) return

    let startX = 0

    element.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX
    }, { passive: true })

    element.addEventListener("touchend", (event) => {
        const endX = event.changedTouches[0].clientX
        const diff = endX - startX

        if (Math.abs(diff) > threshold) {
            callback(diff > 0 ? "right" : "left")
        }
    }, { passive: true })
}