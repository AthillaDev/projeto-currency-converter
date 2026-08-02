/**
 * Desenha um sparkline (gráfico de linha simples) num elemento <canvas>,
 * a partir de uma lista de valores numéricos. Sem dependências externas.
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} values
 * @param {{ strokeColor?: string, fillColor?: string }} options
 */
export function drawSparkline(canvas, values, { strokeColor = "#1B83E2", fillColor = "#1B83E233" } = {}) {
    if (!canvas || !values || values.length < 2) return

    const ctx = canvas.getContext("2d")
    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const padding = 4

    const points = values.map((value, index) => {
        const x = (index / (values.length - 1)) * (width - padding * 2) + padding
        const y = height - padding - ((value - min) / range) * (height - padding * 2)
        return [x, y]
    })

    // Linha
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y))
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 2
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.stroke()

    // Preenchimento sutil abaixo da linha
    ctx.lineTo(points[points.length - 1][0], height)
    ctx.lineTo(points[0][0], height)
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()
}