import './style.css'

import { create_canvas } from './shared'
import { PointProps } from './type'
import { IS_MOBILE } from './constant'
import setup from './app-setup'
import { Scene } from './scene'

function main() {
  const payload = create_canvas()
  if (!payload) return

  const { canvas, ctx } = payload

  const scene = new Scene(ctx)

  const clear = () => {
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
  const update = () => {
    scene.update()
  }
  const draw = () => {
    scene.draw(ctx)
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

  bind_event(canvas, scene)

  start()
}

const to_mobile_point = (ev: TouchEvent) => {
  const { pageX, pageY } = ev.touches[0]

  const p: PointProps = { x: pageX, y: pageY }

  return p
}

const to_pc_point = (ev: MouseEvent) => {
  const p: PointProps = { x: ev.pageX, y: ev.pageY }

  return p
}

const bind_event = (canvas: HTMLCanvasElement, scene: Scene) => {
  const handleMouseDown = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    scene.on_pointer_down(crtP)
  }
  const handleMouseMove = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    scene.on_move(crtP)
  }
  const handleMouseUp = () => {
    scene.on_pointer_up()
  }

  const handleTouchStart = (ev: TouchEvent) => {
    const point = to_mobile_point(ev)
    scene.on_pointer_down(point)
  }
  const handleTouchMove = (ev: TouchEvent) => {
    const point = to_mobile_point(ev)
    scene.on_move(point)
  }
  const handleTouchEnd = () => {
    scene.on_pointer_up()
  }

  if (IS_MOBILE) {
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchmove', handleTouchMove)
    canvas.addEventListener('touchend', handleTouchEnd)
  } else {
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
  }
}

setup()
main()
