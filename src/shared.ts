import { BORDER_PADDING } from './constant'
import { MetaList, Rectangle, RectangleProps } from './rectangle'
import { CanvasApplyStyle, Placement, I2DCtx, PointProps } from './type'

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
  down_point: PointProps | null,
  move_point: PointProps | null,
) => {
  if (!down_point || !move_point) return null

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
export const draw_rectangle_meta = (ctx: I2DCtx, meta: MetaList, style?: CanvasApplyStyle) => {
  draw_points(ctx, meta, style)
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

export const mutate_rectangle_size = (rectangle: Rectangle, move_point: PointProps | null) => {
  if (!move_point) return

  const { placement, meta } = rectangle.get_meta_and_placement()

  const [p1, p2, p3, p4] = meta

  switch (placement) {
    case Placement.TopLeft:
    case Placement.LeftTop:
      rectangle.on_size(move_point, p3)
      break

    case Placement.Top:
      break

    case Placement.TopRight:
    case Placement.RightTop:
      rectangle.on_size(move_point, p4)
      break

    case Placement.Right:
      break

    case Placement.BottomRight:
    case Placement.RightBottom:
      rectangle.on_size(move_point, p1)
      break

    case Placement.Bottom:
      break

    case Placement.BottomLeft:
    case Placement.LeftBottom:
      rectangle.on_size(move_point, p2)
      break

    case Placement.Left:
      break
  }
}
