import { NUMBER_OF_ROWS, NUMBER_OF_COLUMNS } from "./config"
import { createMatrix, drawRole } from "./shared"
import { Sys } from "./sys"
import { Point } from "./type"


export class Playfield {

  private ctx: CanvasRenderingContext2D

  private matrix: number[][]

  private currentMarkPoints: Point[] = []

  sys: Sys | null = null

  constructor(
    ctx: CanvasRenderingContext2D,
  ) {
    this.ctx = ctx

    this.matrix = createMatrix()

    this.onMouseEnd = this.onMouseEnd.bind(this)
  }

  private markPoints(point: Point | Point[], status: 0 | 1) {
    const points: Point[] = Array.isArray(point) ? point : [point]

    for (const p of points) {
      const { x, y } = p
      this.matrix[x][y] = status
    }

  }

  public onMouseEnd() {
    const points = this.currentMarkPoints
    this.markPoints(points, 1)
  }

  markClick(x: number, y: number) {
    const status = this.matrix[x][y]

    this.matrix[x][y] = status === 1 ? 0 : 1
  }

  private getCurrentDynamicPoints(): Point[] {
    if (!this.sys) return []

    const {
      width,
      height,
    } = this.ctx.canvas

    const {
      mouseDownPoint,
      mouseMovePoint,
    } = this.sys

    const rowSpan = height / NUMBER_OF_ROWS
    const columnSpan = width / NUMBER_OF_COLUMNS

    const p1: Point = {
      x: Math.floor(mouseDownPoint.y / rowSpan),
      y: Math.floor(mouseDownPoint.x / columnSpan),
    }
    const p2: Point = {
      x: Math.floor(mouseMovePoint.y / rowSpan),
      y: Math.floor(mouseMovePoint.x / columnSpan),
    }

    const xMin = Math.min(p1.x, p2.x)
    const xMax = Math.max(p1.x, p2.x)

    const yMin = Math.min(p1.y, p2.y)
    const yMax = Math.max(p1.y, p2.y)

    const points: Point[] = []

    for (let xIdx = xMin; xIdx <= xMax; xIdx++) {
      for (let yIdx = yMin; yIdx <= yMax; yIdx++) {
        const p: Point = { x: xIdx, y: yIdx }
        points.push(p)
      }
    }

    return points
  }

  update() {
    if (!this.sys) return

    if (this.sys.hasMouseDown) {
      const points = this.getCurrentDynamicPoints()

      this.currentMarkPoints = points
    }

  }

  private drawMatrix2() {
    for (const p of this.currentMarkPoints) {
      const { x, y } = p
      drawRole(
        this.ctx,
        [x, y],
      )
    }
  }

  private drawMatrix() {
    for (let i = 0; i < NUMBER_OF_ROWS; i++) {
      for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
        const flag = this.matrix[i][j]

        if (flag === 1) {
          drawRole(
            this.ctx,
            [i, j],
          )
        }
      }
    }
  }

  draw() {
    this.drawMatrix2()
    this.drawMatrix()
  }

}
