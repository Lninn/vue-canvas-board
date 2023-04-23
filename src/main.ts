import './style.css'


type I2DCtx = CanvasRenderingContext2D

const get_by_id = <T = HTMLElement, >(id: string) => {
  const e = document.getElementById(id)
  if (e) {
    return e as T
  } else {
    return null
  }
}

const to_rad = (deg: number) => deg * Math.PI / 180
const get_length = (s: PointProps, e: PointProps) => {
  const xP = Math.pow(s.x - e.x, 2)
  const yP = Math.pow(s.y - e.y, 2)

  return Math.sqrt(xP + yP)
}

const find_element = (elements: Element[], p: PointProps) => {
  for (const e of elements) {
    if (e.hasInteracion(p)) {
      return e
    }
  }

  return null
}

const get_canvas_center = (el: HTMLCanvasElement): PointProps => {
  const {
    width,
    height,
  } = el

  const p: PointProps = {
    x: width / 2,
    y: height / 2,
  }

  return p
}

const draw_points = (ctx: I2DCtx,points: PointProps[]) => {
  const [start, ...restPoints] = points

  ctx.strokeStyle = '#1772b4'

  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  restPoints.forEach(p => { ctx.lineTo(p.x, p.y) })

  ctx.closePath()

  ctx.setLineDash([12, 3, 3])

  ctx.stroke()
}

interface PointProps {
  x: number
  y: number
}
interface CircleProps {
  x: number
  y: number
  r: number
}

interface RectangleProps {
  x: number
  y: number
  w: number
  h: number
}

interface Shape {
  hasInteracion: (p: PointProps) => boolean
  update: (p: PointProps) => void
  draw: (ctx: I2DCtx) => void
}

class Rectangle implements Shape {
  props: RectangleProps

  constructor(props: RectangleProps) {
    this.props = props
  }

  hasInteracion(p: PointProps) {
    const { x, y, w, h } = this.props
    const inX = p.x >= x && p.x <= w + x
    const inY = p.y >= y && p.y <= h + y

    return inX && inY
  }

  update(p: PointProps) {
    this.props.x = p.x
    this.props.y = p.y
  }

  draw(ctx: I2DCtx) {
    ctx.beginPath()

    const { x, y, w, h } = this.props

    ctx.rect(x, y, w, h)
    ctx.fill()
  }
}

class Circle implements Shape {
  props: CircleProps

  constructor(props: CircleProps) {
    this.props = props
  }

  private getPoint(deg: number) {
    const { x, y, r } = this.props

    const _r = r * 1.5

    const rad = to_rad(deg)
    const p: PointProps = {
      x: _r * Math.cos(rad) + x,
      y: _r * Math.sin(rad) + y,
    }

    return p
  }

  private renderBorder(ctx: I2DCtx) {

    const p1 = this.getPoint(45)
    const p2 = this.getPoint(135)
    const p3 = this.getPoint(225)
    const p4 = this.getPoint(315)

    const points = [p1, p2, p3, p4]

    draw_points(ctx, points)

  }

  private render(ctx: I2DCtx) {
    const {
      x,
      y,
      r,
    } = this.props

    ctx.fillStyle = '#f07c82'

    ctx.beginPath()
    ctx.arc(x, y, r, Math.PI * 2, 0, false)

    ctx.fill()
  }

  hasInteracion(p: PointProps) {
    return get_length(this.props, p) <= this.props.r
  }

  update(p: PointProps) {
    this.props.x = p.x
    this.props.y = p.y
  }

  draw(ctx: I2DCtx) {
    this.render(ctx)
    this.renderBorder(ctx)
  }
}

type Element = Circle | Rectangle

interface State {
  element: Element | null,
  hasDown: boolean
  downPoint: PointProps | null
  movePoint: PointProps | null
}

function main() {

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
  const r1 = new Rectangle({ x: 100, y: 100, w: 400, h: 100 })

  const elements: Element[] = [c1, r1]

  const state: State = {
    element: null,
    hasDown: false,
    downPoint: null,
    movePoint: null,
  }

  window.addEventListener('mousedown', (e) => {
    const crtP: PointProps = { x: e.pageX, y: e.pageY }

    const element = find_element(elements, crtP)
    if (!element) return

    const offsetX = crtP.x - element.props.x
    const offsetY = crtP.y - element.props.y

    state.downPoint = { x: offsetX, y: offsetY }
    state.element = element
    state.hasDown = true
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
