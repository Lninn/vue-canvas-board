import { NUMBER_OF_ROWS, NUMBER_OF_COLUMNS } from "./config"
import { Point, Position } from "./type"

export function getById<T = HTMLElement>(id: string): T | null {
  const e = document.getElementById(id)

  if (e) {
    return e as T
  } else {
    return null
  }

}

export function drawRole(
  ctx: CanvasRenderingContext2D,
  position: Position,
) {

  const [r, c] = position

  const {
    width,
    height
  } = ctx.canvas

  const rowSpan = Math.floor(height / NUMBER_OF_ROWS)
  const columnSpan = Math.floor(width / NUMBER_OF_COLUMNS)

  const p1: Point = {
    x: c * columnSpan,
    y: r * rowSpan,
  }
  const p2: Point = {
    x: (c + 1) * columnSpan,
    y: r * rowSpan,
  }
  const p3: Point = {
    x: (c + 1) * columnSpan,
    y: (r + 1) * rowSpan,
  }
  const p4: Point = {
    x: c * columnSpan,
    y: (r + 1) * rowSpan,
  }

  drawRect(ctx, p1, p2, p3, p4)
}

export function drawRect(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
) {
  ctx.beginPath()

  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.lineTo(p3.x, p3.y)
  ctx.lineTo(p4.x, p4.y)

  ctx.closePath()
  ctx.strokeStyle = 'blue'
  ctx.stroke()

  ctx.fillStyle = 'red'
  ctx.fill()
}

function drawLine(ctx: CanvasRenderingContext2D, start:Point, end: Point) {
  ctx.strokeStyle = '#ddd'

  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)

  ctx.stroke()
}

export function drawBackground(ctx: CanvasRenderingContext2D) {

  const {
    width,
    height
  } = ctx.canvas
  
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, width, height)
}

export function drawGrid(ctx: CanvasRenderingContext2D) {

  const {
    width,
    height
  } = ctx.canvas

  const rowSpan = height / NUMBER_OF_ROWS
  const columnSpan = width / NUMBER_OF_COLUMNS

  let idx = 0
  while(idx <= NUMBER_OF_ROWS) {
    const len = idx * rowSpan

    const s: Point = { x: 0, y: len }
    const e: Point = { x: width, y: len }

    drawLine(ctx, s, e)

    idx++
  }

  idx = 0
  while(idx <= NUMBER_OF_COLUMNS) {
    const len = idx * columnSpan

    const s: Point = { x: len, y: 0 }
    const e: Point = { x: len, y: height }

    drawLine(ctx, s, e)

    idx++
  }

  // console.log('[grid] ', { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS })

}

// todo
export function getPositionList(
  activePosition: Position,
  activeShape: any,
): Position[] | false {

  const [r, c] = activePosition

  const list: Position[] = []

  for (let i = 0; i < activeShape.length; i++) {
    const child = activeShape[i]

    if (typeof child === 'number') {
      const p: Position = [r, c + i]
      list.push(p)
    }

    for (let j = 0; j < child.length; j++) {
      
      const val = child[j]
      
      if (val) {
        const _r = i + r
        const _c = c + j
        
        const p: Position = [_r, _c]

        if (
          _r < 0 ||
          _r >= NUMBER_OF_ROWS ||
          _c < 0 ||
          _c >= NUMBER_OF_COLUMNS
        ) {
          return false
        }

        list.push(p)
      }
    }


  }

  return list
}

export function createMatrix() {
  const m: number[][] = []

  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    m[i] = []
    for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
      m[i][j] = 0
    }
  }

  return m
}

export function createNumbers() {
  const list = Array.from({
    length: NUMBER_OF_ROWS * NUMBER_OF_COLUMNS
  }, () => 0)

  return list
}

export function createCtx() {
  const canvas = getById<HTMLCanvasElement>('canvas')
  if (!canvas) return null

  const {
    clientWidth,
    clientHeight
  } = document.documentElement

  canvas.style.width = clientWidth + 'px'
  canvas.style.height = clientHeight + 'px'

  canvas.width = clientWidth
  canvas.height = clientHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  return ctx
}
