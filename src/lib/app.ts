import { create_canvas } from './shared'
import { PointProps } from '../type'
import { Scene } from './scene'

export function main() {
  const payload = create_canvas()
  if (!payload) return

  const { canvas, ctx } = payload

  // const scene = new Scene(ctx)
  const scene = new Scene(ctx, canvas)

  const clear = () => {
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
  const update = () => {
    scene.update()
  }
  const draw = () => {
    scene.draw()
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

  // bind_event(canvas, scene)
  user_bind_event(canvas, scene)

  start()
}

const to_pc_point = (ev: MouseEvent) => {
  const p: PointProps = { x: ev.pageX, y: ev.pageY }

  return p
}

const user_bind_event = (canvas: HTMLCanvasElement, user: Scene) => {
  const handleMouseDown = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    user.on_mouse_down(crtP)
  }
  const handleMouseMove = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    user.on_mouse_move(crtP)
  }
  const handleMouseUp = () => {
    user.on_mouse_up()
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)

}
