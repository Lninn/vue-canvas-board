import { BORDER_PADDING, BORDER_RECT_SIZE } from './constant'
import {
  adjust_rectangle_props,
  draw_points,
  draw_rectangle,
  rectangle_intersection,
  with_padding,
} from './shared'
import { CanvasApplyStyle, I2DCtx, PointProps } from './type'

export const enum Placement {
  TopLeft = 'TopLeft',
  LeftTop = 'LeftTop',

  Top = 'Top',

  TopRight = 'TopRight',
  RightTop = 'RightTop',

  Right = 'Right',

  BottomRight = 'BottomRight',
  RightBottom = 'RightBottom',

  Bottom = 'Bottom',

  BottomLeft = 'BottomLeft',
  LeftBottom = 'LeftBottom',

  Left = 'Left',
}

type BorderPlacementMap = Record<Placement, PointProps[]>

const create_border_rects = (props: RectangleProps, cornerPoints: PointProps[]) => {
  const { x, y, w, h } = props

  const [p1, p2, p3, p4] = cornerPoints

  const c1: PointProps = { x: x + w / 2, y: y - BORDER_PADDING }
  const c2: PointProps = { x: x + w + BORDER_PADDING, y: y + h / 2 }
  const c3: PointProps = { x: x + w / 2, y: y + h + BORDER_PADDING }
  const c4: PointProps = { x: x - BORDER_PADDING, y: y + h / 2 }

  const tl = with_border_rect(p1)
  const tr = with_border_rect(p2)
  const br = with_border_rect(p3)
  const bl = with_border_rect(p4)

  const map: BorderPlacementMap = {
    TopLeft: tl,
    LeftTop: tl,

    Top: with_border_rect(c1),

    TopRight: tr,
    RightTop: tr,

    Right: with_border_rect(c2),

    RightBottom: br,
    BottomRight: br,

    Bottom: with_border_rect(c3),

    BottomLeft: bl,
    LeftBottom: bl,

    Left: with_border_rect(c4),
  }

  return map
}

const with_border_rect = (point: PointProps) => {
  const size = BORDER_RECT_SIZE

  const ps: PointProps[] = [
    { x: -size, y: -size },
    { x: size, y: -size },
    { x: size, y: size },
    { x: -size, y: size },
  ]

  return ps.map((p) => {
    const np: PointProps = {
      x: p.x + point.x,
      y: p.y + point.y,
    }

    return np
  })
}

export interface RectangleProps {
  x: number
  y: number
  w: number
  h: number
}

export const isRectangle = (obj: any): obj is Rectangle => {
  return obj && 'type' in obj && obj['type'] === 'rectangle'
}

export class Rectangle {
  public typp = 'rectangle'
  public props: RectangleProps
  private hasFocus = false

  private borderPlacement: BorderPlacementMap | null
  private activePlacement: Placement | null

  private style: CanvasApplyStyle

  constructor(props: RectangleProps, style: CanvasApplyStyle) {
    this.props = props

    this.activePlacement = null
    this.borderPlacement = this.createBorder()
    this.style = style
  }

  private createBorder() {
    const { x, y, w, h } = adjust_rectangle_props(this.props)

    const outerPoints: PointProps[] = [
      { x: x, y: y },
      { x: x + w, y: y },
      { x: x + w, y: y + h },
      { x: x, y: y + h },
    ]

    const paddingPoints = with_padding(outerPoints)

    const borderPlacement = create_border_rects(adjust_rectangle_props(this.props), paddingPoints)

    return borderPlacement
  }

  private getPlacementBorderIfMatch(p: PointProps) {
    const map = this.borderPlacement

    if (!map) return null

    const entries = Object.entries(map) as [Placement, PointProps[]][]

    for (const borderItem of entries) {
      const [placement, points] = borderItem

      const [topLeftCornerPoint] = points

      const rectProps: RectangleProps = {
        x: topLeftCornerPoint.x,
        y: topLeftCornerPoint.y,
        w: BORDER_PADDING,
        h: BORDER_PADDING,
      }

      if (rectangle_intersection(rectProps, p)) {
        return placement
      }
    }

    return null
  }

  public focus_toggle(val: boolean) {
    this.hasFocus = val
  }

  public reset() {
    this.activePlacement = null
  }

  public has_placement() {
    return !!this.activePlacement
  }

  public hasInteracion(p: PointProps) {
    const placement = this.getPlacementBorderIfMatch(p)

    if (placement) {
      this.activePlacement = placement as Placement
      // TODO
      // document.body.style.cursor = 'n-resize'
      return true
    }

    const intersectionInRect = rectangle_intersection(adjust_rectangle_props(this.props), p)

    return intersectionInRect
  }

  public onMove(down_point: PointProps, move_point: PointProps) {
    const offsetX = move_point.x - down_point.x
    const offsetY = move_point.y - down_point.y

    this.props.x = offsetX
    this.props.y = offsetY
  }

  private renderBorder(ctx: CanvasRenderingContext2D) {
    const map = this.borderPlacement
    if (!map) return

    const style: CanvasApplyStyle = { strokeStyle: '#8f3b76' }

    for (const points of Object.values(map)) {
      draw_points(ctx, points, style)
    }

    const placement = this.activePlacement
    if (placement) {
      const points = map[placement]

      draw_points(ctx, points, { fillStyle: 'red' })
    }
  }

  public update() {
    if (this.hasFocus) {
      this.borderPlacement = this.createBorder()
    }
  }

  public draw(ctx: I2DCtx) {
    draw_rectangle(ctx, this.props, this.style)

    if (this.hasFocus) {
      this.renderBorder(ctx)
    }
  }
}
