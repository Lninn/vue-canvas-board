import { BORDER_PADDING, BORDER_RECT_SIZE } from "./store"
import { draw_points, rectangle_intersection, with_padding } from "./shared"
import { CanvasApplyStyle, I2DCtx, Placement, PointProps, RectangleProps } from "./type"

export type PlacementPointsMap = Record<Placement, PointProps[]>

export class Border {
  private map: PlacementPointsMap

  constructor(props: RectangleProps) {
    this.map = this.createMap(props)
  }

  public get_placement_border_if_match(p: PointProps) {
    if (!this.map) return null

    const entries = Object.entries(this.map) as [Placement, PointProps[]][]

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

  public update(props: RectangleProps) {
    this.map = this.createMap(props)
  }

  public draw(ctx: I2DCtx) {
    if (!this.map) return

    const style: CanvasApplyStyle = { strokeStyle: '#8f3b76' }

    for (const points of Object.values(this.map)) {
      draw_points(ctx, points, style)
    }
  }

  private createMap(props: RectangleProps): PlacementPointsMap {
    const { x, y, w, h } = props

    const outerPoints: PointProps[] = [
      { x: x, y: y },
      { x: x + w, y: y },
      { x: x + w, y: y + h },
      { x: x, y: y + h },
    ]

    const paddingPoints = with_padding(outerPoints)

    const borderPlacement = this.create_border_rects(
      props,
      paddingPoints,
    )

    return borderPlacement
  }

  private create_border_rects = (
    props: RectangleProps,
    cornerPoints: PointProps[]
  ): PlacementPointsMap => {
    return {
      ...this.create_corner_part(cornerPoints),
      ...this.create_center_part(props),
    } as PlacementPointsMap
  }

  private create_corner_part(
    cornerPoints: PointProps[]
  ): Partial<PlacementPointsMap> {
    const [p1, p2, p3, p4] = cornerPoints

    const tl = this.with_border_rect(p1)
    const tr = this.with_border_rect(p2)
    const br = this.with_border_rect(p3)
    const bl = this.with_border_rect(p4)

    return {
      TopLeft: tl,
      LeftTop: tl,

      TopRight: tr,
      RightTop: tr,
  
      RightBottom: br,
      BottomRight: br,
   
      BottomLeft: bl,
      LeftBottom: bl,
    }
  }

  private create_center_part(
    props: RectangleProps
  ): Partial<PlacementPointsMap> {
    const { x, y, w, h } = props

    const c1: PointProps = { x: x + w / 2, y: y - BORDER_PADDING }
    const c2: PointProps = { x: x + w + BORDER_PADDING, y: y + h / 2 }
    const c3: PointProps = { x: x + w / 2, y: y + h + BORDER_PADDING }
    const c4: PointProps = { x: x - BORDER_PADDING, y: y + h / 2 }

    const t = this.with_border_rect(c1)
    const r = this.with_border_rect(c2)
    const b = this.with_border_rect(c3)
    const l = this.with_border_rect(c4)

    return {
      Top: t,
      Right: r,
      Bottom: b,
      Left: l,
    }
  }

  private with_border_rect (point: PointProps) {
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
}

