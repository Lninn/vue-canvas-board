import { BORDER_RECT_SIZE } from "./constant"
import { draw_points, with_padding } from "./shared"
import { I2DCtx, PointProps, Shape } from "./type"

interface RectangleProps {
  x: number
  y: number
  w: number
  h: number
}

const with_border_rect = (point: PointProps) => {
  const size = BORDER_RECT_SIZE

  const ps: PointProps[] = [
    { x: -size, y: -size },
    { x: size, y: -size },
    { x: size, y: size },
    { x: -size, y: size },
  ]

  return ps.map(p => {
    const np: PointProps = {
      x: p.x + point.x,
      y: p.y + point.y,
    }

    return np
  })
}

export class Rectangle implements Shape {
  props: RectangleProps
  hasFocus = false

  constructor(props: RectangleProps) {
    this.props = props
  }

  renderBorder(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.props

    const outerPoints: PointProps[] = [
      { x: x, y: y },
      { x: x + w, y: y },
      { x: x + w, y: y + h },
      { x: x, y: y + h },
    ]

    const paddingPoints = with_padding(outerPoints)
    draw_points(ctx, paddingPoints)

    for (const point of paddingPoints) {
      const rectPoints = with_border_rect(point)
      draw_points(ctx, rectPoints)
    }

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

  render(ctx: I2DCtx) {
    ctx.beginPath()

    const { x, y, w, h } = this.props

    ctx.rect(x, y, w, h)
    ctx.fill()
  }

  draw(ctx: I2DCtx) {
    this.render(ctx)

    if (this.hasFocus) {
      this.renderBorder(ctx)
    }
  }
}
