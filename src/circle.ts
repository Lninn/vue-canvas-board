import { draw_points, get_length, to_rad, with_padding } from "./shared"
import { I2DCtx, PointProps, Shape } from "./type"

interface CircleProps {
  x: number
  y: number
  r: number
}

export class Circle implements Shape {
  props: CircleProps
  hasFocus = false

  constructor(props: CircleProps) {
    this.props = props
  }

  private getPoint(deg: number) {
    const { x, y, r } = this.props

    const _r = r

    const rad = to_rad(deg)
    const p: PointProps = {
      x: _r * Math.cos(rad) + x,
      y: _r * Math.sin(rad) + y,
    }

    return p
  }

  renderBorder(ctx: I2DCtx) {

    const p1 = this.getPoint(45)
    const p2 = this.getPoint(135)
    const p3 = this.getPoint(225)
    const p4 = this.getPoint(315)
    const innerPoints = [p1, p2, p3, p4]

    const { x, y, r } = this.props
    const outerPoints: PointProps[] = [
      { x: x - r, y: y - r },
      { x: x + r, y: y - r },
      { x: x + r, y: y + r },
      { x: x - r, y: y + r },
    ]

    draw_points(ctx, with_padding(outerPoints))
    draw_points(ctx, innerPoints)

  }

  private render(ctx: I2DCtx) {
    const { x, y, r } = this.props

    ctx.fillStyle = '#5698c3'

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
    if (this.hasFocus) {
      this.renderBorder(ctx)
    }
  }
}