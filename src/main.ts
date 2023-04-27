import './style.css'

import { HostPoint } from './host'
import { create_canvas } from './shared'
import { PointProps } from './type'
import { IS_MOBILE } from './constant'

function main() {
  const payload = create_canvas()
  if (!payload) return

  const { canvas, ctx } = payload

  const host = new HostPoint()

  const clear = () => {
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
  const update = () => {
    host.update()
  }
  const draw = () => {
    host.draw(ctx)
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

  bind_event(canvas, host)

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

const bind_event = (canvas: HTMLCanvasElement, host: HostPoint) => {
  const handleMouseDown = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    host.onPointerDown(crtP)
  }
  const handleMouseMove = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    host.onMove(crtP)
  }
  const handleMouseUp = () => {
    host.onUp()
  }

  const handleTouchStart = (ev: TouchEvent) => {
    const point = to_mobile_point(ev)
    host.onPointerDown(point)
  }
  const handleTouchMove = (ev: TouchEvent) => {
    const point = to_mobile_point(ev)
    host.onMove(point)
  }
  const handleTouchEnd = () => {
    host.onUp()
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

main()
