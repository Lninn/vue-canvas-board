import './style.css'

import { Board } from './board'
import { create_canvas } from './shared'
import { PointProps } from './type'
import { IS_MOBILE } from './constant'

function main() {
  const payload = create_canvas()
  if (!payload) return

  const { canvas, ctx } = payload

  const board = new Board()

  const clear = () => {
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
  const update = () => {
    board.update()
  }
  const draw = () => {
    board.draw(ctx)
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

  bind_event(canvas, board)

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

const bind_event = (canvas: HTMLCanvasElement, host: Board) => {
  const handleMouseDown = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    host.on_pointer_down(crtP)
  }
  const handleMouseMove = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    host.on_move(crtP)
  }
  const handleMouseUp = () => {
    host.on_up()
  }

  const handleTouchStart = (ev: TouchEvent) => {
    const point = to_mobile_point(ev)
    host.on_pointer_down(point)
  }
  const handleTouchMove = (ev: TouchEvent) => {
    const point = to_mobile_point(ev)
    host.on_move(point)
  }
  const handleTouchEnd = () => {
    host.on_up()
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
