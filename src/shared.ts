import { BORDER_PADDING } from './constant'
import { CanvasApplyStyle, I2DCtx, PointProps, RectangleProps, EllipsePath } from './type'

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

export const create_ellipse_path = (props: RectangleProps): EllipsePath => {
  const { x, y, w, h } = props

  return {
    x: x + w / 2,
    y: y + h / 2,
    rx: w / 2,
    ry: h / 2,
  }
}

export const draw_ellipse_path = (ctx: I2DCtx, path: EllipsePath, style?: CanvasApplyStyle) => {
  ctx.beginPath()

  ctx.ellipse(
    path.x,
    path.y,
    path.rx,
    path.ry,
    0,
    0,
    Math.PI * 2,
    false,
  )

  apply_canvas_style(ctx, style)
}

export const append_point = (p1: PointProps, p2: PointProps) => {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  } as PointProps
}
