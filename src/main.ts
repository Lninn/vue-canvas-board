import './style.css'

import { Circle } from './circle'
import { Rectangle } from './rectangle'
import { get_by_id, get_canvas_center } from './shared'
import { PointProps } from './type'


type Element = Circle | Rectangle

const find_element = (elements: Element[], p: PointProps) => {
  for (const e of elements) {
    if (e.hasInteracion(p)) {
      return e
    }
  }

  return null
}

interface State {
  element: Element | null,
  hasDown: boolean
  downPoint: PointProps | null
  movePoint: PointProps | null
}

function  main() {

  const canvas = get_by_id<HTMLCanvasElement>('canvas')
  if (!canvas) return

  const {
    clientWidth,
    clientHeight,
  } = document.documentElement

  canvas.width = clientWidth
  canvas.height = clientHeight
  canvas.style.width = clientWidth + 'px'
  canvas.style.height = clientHeight + 'px'

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const center = get_canvas_center(canvas)

  const c1 = new Circle({ x: center.x, y: center.y, r: 100 })
  const r1 = new Rectangle({ x: 100, y: 100, w: 100, h: 100 })

  const elements: Element[] = [c1, r1]

  const state: State = {
    element: null,
    hasDown: false,
    downPoint: null,
    movePoint: null,
  }

  const resetElement = () => {
    const prevElement = state.element
    if (prevElement) {
      prevElement.hasFocus = false
    }
  }

  window.addEventListener('mousedown', (e) => {
    const crtP: PointProps = { x: e.pageX, y: e.pageY }

    const element = find_element(elements, crtP)
    if (!element) {
      resetElement()

      return
    }

    const offsetX = crtP.x - element.props.x
    const offsetY = crtP.y - element.props.y

    state.downPoint = { x: offsetX, y: offsetY }

    resetElement()

    state.element = element
    state.hasDown = true

    element.hasFocus = true
  })
  window.addEventListener('mousemove', (e) => {
    if (state.hasDown) {
      const crtP: PointProps = { x: e.pageX, y: e.pageY }
      const _downPoint = state.downPoint as PointProps

      const offsetX = crtP.x - _downPoint.x
      const offsetY = crtP.y - _downPoint.y

      state.movePoint = { x: offsetX, y: offsetY }
    }
  })
  window.addEventListener('mouseup', () => {
    state.hasDown = false

    if (state.movePoint) {
      state.downPoint = state.movePoint
      state.movePoint = null
    }
  })

  const clear = () => {
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
  const update = () => {

    if (state.movePoint) {
      const element = state.element

      if (element) {
        element.update(state.movePoint)
      }
    }

  }
  const draw = () => {
    c1.draw(ctx)
    r1.draw(ctx)
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

 main()
