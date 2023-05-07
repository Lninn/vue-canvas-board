import { create_canvas } from './shared'

export function main() {
  const payload = create_canvas()
  if (!payload) return

  const { canvas, ctx } = payload

  const clear = () => {
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
  const update = () => {
    // scene.update()
  }
  const draw = () => {
    // scene.draw()

    ctx.rect(10, 10, 10, 10)
    ctx.fill()
  }
  const loop = () => {
    clear()
    update()
    draw()

    requestAnimationFrame(loop)
  }
  const start = () => {
    requestAnimationFrame(loop)
  }

  start()
}
