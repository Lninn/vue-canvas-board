import { BORDER_PADDING, BORDER_RECT_SIZE } from './constant'
import { RectangleProps } from './rectangle'
import { CanvasApplyStyle, Placement, I2DCtx, PointProps, CoordsRange, BorderPlacementMap } from './type'

export const with_padding = (points: PointProps[]) => {
  const p = BORDER_PADDING

  const appendPaddingPoints: PointProps[] = [
    { x: -p, y: -p },
    { x: +p, y: -p },
    { x: p, y: p },
    { x: -p, y: p },
  ]

  return points.map((p, i) => {
    const { x, y } = p

    const ap = appendPaddingPoints[i]

    return { x: x + ap.x, y: y + ap.y }
  })
}

export const draw_points = (ctx: I2DCtx, points: PointProps[], style?: CanvasApplyStyle) => {
  const [start, ...restPoints] = points

  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  restPoints.forEach((p) => {
    ctx.lineTo(p.x, p.y)
  })
  ctx.closePath()

  apply_canvas_style(ctx, style)
}

export const to_rad = (deg: number) => (deg * Math.PI) / 180

export const get_length = (s: PointProps, e: PointProps) => {
  const xP = Math.pow(s.x - e.x, 2)
  const yP = Math.pow(s.y - e.y, 2)

  return Math.sqrt(xP + yP)
}

export const create_canvas_by_id = <T = HTMLElement>(id: string) => {
  const e = document.getElementById(id)
  if (e) {
    return e as T
  } else {

    const element = document.createElement('canvas')
    document.body.append(element)
    return element
  }
}

export const get_canvas_center = (el: HTMLCanvasElement): PointProps => {
  const { width, height } = el

  const p: PointProps = {
    x: width / 2,
    y: height / 2,
  }

  return p
}

export const rectangle_intersection = (rect: RectangleProps, p: PointProps) => {
  const { x, y, w, h } = rect

  const inX = p.x >= x && p.x <= w + x
  const inY = p.y >= y && p.y <= h + y

  return inX && inY
}

/**
 * @description p1 - p2
 *
 */
export const point_sub = (p1: PointProps, p2: PointProps) => {
  const p: PointProps = {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  }

  return p
}

export const create_canvas = () => {
  const canvas = create_canvas_by_id<HTMLCanvasElement>('canvas')

  if (!canvas) return null

  const { clientWidth, clientHeight } = document.documentElement

  canvas.width = clientWidth
  canvas.height = clientHeight

  canvas.style.width = clientWidth + 'px'
  canvas.style.height = clientHeight + 'px'

  const ctx = canvas.getContext('2d') as I2DCtx

  return { canvas, ctx }
}

export const draw_line = (
  ctx: I2DCtx,
  start: PointProps,
  end: PointProps,
  style?: CanvasApplyStyle,
) => {
  ctx.beginPath()

  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)

  apply_canvas_style(ctx, style)

  ctx.closePath()
}

export const apply_canvas_style = (ctx: I2DCtx, style?: CanvasApplyStyle) => {
  if (!style) return

  const { strokeStyle, fillStyle } = style

  const prevStrokeStyle = ctx.strokeStyle
  const prevFillStyle = ctx.fillStyle

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle
    ctx.stroke()

    ctx.strokeStyle = prevStrokeStyle
  }

  if (fillStyle) {
    ctx.fillStyle = fillStyle
    ctx.fill()

    ctx.fillStyle = prevFillStyle
  }
}
export const create_rectangle_props = (
  down_point: PointProps,
  move_point: PointProps,
) => {
  const sizeOfHorizontal = move_point.x - down_point.x
  const sizeOfVertical = move_point.y - down_point.y

  const props: RectangleProps = {
    x: sizeOfHorizontal < 0 ? down_point.x + sizeOfHorizontal : down_point.x,
    y: sizeOfVertical < 0 ? down_point.y + sizeOfVertical : down_point.y,
    w: Math.abs(sizeOfHorizontal),
    h: Math.abs(sizeOfVertical),
  }

  return props
}
export const draw_rectangle = (ctx: I2DCtx, props: RectangleProps, style?: CanvasApplyStyle) => {
  const { x, y, w, h } = props
  ctx.beginPath()
  ctx.rect(x, y, w, h)

  apply_canvas_style(ctx, style)
}

export const adjust_rectangle_props = (props: RectangleProps) => {
  const { x, y, w, h } = props

  let xPartProps: Pick<RectangleProps, 'x' | 'w'> | null = null
  let yPartProps: Pick<RectangleProps, 'y' | 'h'> | null = null

  if (w < 0) xPartProps = { x: w + x, w: Math.abs(w) }
  if (h < 0) yPartProps = { y: y + h, h: Math.abs(h) }

  let finalProps: RectangleProps = props
  if (xPartProps) finalProps = { ...finalProps, ...xPartProps }
  if (yPartProps) finalProps = { ...finalProps, ...yPartProps }

  return finalProps
}

export const get_rectangle_next_size = (
  placement: Placement,
  meta: CoordsRange,
  move_point: PointProps
): [PointProps, PointProps] => {
  const [p1, p2, p3, p4] = meta

  switch (placement) {
    case Placement.TopLeft:
    case Placement.LeftTop:
      return [move_point, p3]

    case Placement.Top:
      return [{ x: p1.x, y: move_point.y }, p3]

    case Placement.TopRight:
    case Placement.RightTop:
      return [move_point, p4]

    case Placement.Right:
      return [{ x: move_point.x, y: p3.y }, p1]

    case Placement.BottomRight:
    case Placement.RightBottom:
      return [move_point, p1]

    case Placement.Bottom:
      return [{ x: p3.x, y: move_point.y }, p1]

    case Placement.BottomLeft:
    case Placement.LeftBottom:
      return [move_point, p2]

    case Placement.Left:
      return [{ x: move_point.x, y: p1.y }, p3]
  }
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

export const create_border_rects = (props: RectangleProps, cornerPoints: PointProps[]) => {
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

export const create_rectangle_meta_list = (props: RectangleProps): CoordsRange => {
  const { x, y, w, h } = props

  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
  ]
}
