import { draw_points, with_padding } from "./shared"
import { I2DCtx, PointProps, Shape } from "./type"

interface RectangleProps {
  x: number
  y: number
  w: number
  h: number
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

    draw_points(ctx, with_padding(outerPoints))
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
