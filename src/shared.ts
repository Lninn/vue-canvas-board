import { BORDER_PADDING } from "./constant"
import { I2DCtx, PointProps } from "./type"

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

export const draw_points = (ctx: I2DCtx,points: PointProps[]) => {
  const [start, ...restPoints] = points

  ctx.strokeStyle = '#ee3f4d'
  ctx.lineWidth = 1
  // ctx.setLineDash([12, 3, 3])

  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  restPoints.forEach(p => { ctx.lineTo(p.x, p.y) })

  ctx.closePath()

  ctx.stroke()
}

export const to_rad = (deg: number) => deg * Math.PI / 180

export const get_length = (s: PointProps, e: PointProps) => {
  const xP = Math.pow(s.x - e.x, 2)
  const yP = Math.pow(s.y - e.y, 2)

  return Math.sqrt(xP + yP)
}

export const get_by_id = <T = HTMLElement, >(id: string) => {
  const e = document.getElementById(id)
  if (e) {
    return e as T
  } else {
    return null
  }
}

export const get_canvas_center = (el: HTMLCanvasElement): PointProps => {
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


