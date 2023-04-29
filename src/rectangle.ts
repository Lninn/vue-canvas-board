import { BORDER_PADDING } from './constant'
import {
  adjust_rectangle_props,
  create_border_rects,
  create_rectangle_props,
  draw_points,
  draw_rectangle,
  rectangle_intersection,
  with_padding,
} from './shared'
import { BorderPlacementMap, CanvasApplyStyle, I2DCtx, Placement, PointProps } from './type'

import { ref } from 'vue'

export const moveInfo = ref<any>()

export interface RectangleProps {
  x: number
  y: number
  w: number
  h: number
}

export class Rectangle {
  public props: RectangleProps
  public activePlacement: Placement | null

  private borderPlacement: BorderPlacementMap | null
  private style: CanvasApplyStyle

  constructor(props: RectangleProps, style: CanvasApplyStyle) {
    this.props = props
    this.borderPlacement = this.createBorder()

    this.style = style
    this.activePlacement = null
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

  private get_placement_border_if_match(p: PointProps) {
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

  public check_intersect(p: PointProps) {
    const placement = this.get_placement_border_if_match(p)

    if (placement) {
      this.activePlacement = placement as Placement
      // TODO
      // document.body.style.cursor = 'n-resize'
      return true
    }

    const intersectionInRect = rectangle_intersection(adjust_rectangle_props(this.props), p)

    return intersectionInRect
  }

  private translate(props: RectangleProps) {
    moveInfo.value = props

    this.props = props
    this.borderPlacement = this.createBorder()
  }

  public on_size(move_point: PointProps, down_point: PointProps) {
    const props = create_rectangle_props(move_point, down_point)

    this.translate(props)
  }

  public on_move(down_point: PointProps, move_point: PointProps) {
    const xOffset = move_point.x - down_point.x
    const yOffset = move_point.y - down_point.y

    const props = { ...this.props, x: xOffset, y: yOffset }
    this.translate(props)
  }

  private render_border(ctx: CanvasRenderingContext2D) {
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

  public draw(ctx: I2DCtx, hasFocus?: boolean) {
    draw_rectangle(ctx, this.props, this.style)

    if (hasFocus) {
      this.render_border(ctx)
    }
  }
}
