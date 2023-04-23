import { Playfield } from "./playfield"
import { Point } from "./type"

type Func = () => void

export class Sys {
  hasMouseDown: boolean = false
  mouseDownPoint: Point = { x: 0, y: 0 }
  mouseMovePoint: Point = { x: 0, y: 0 }

  ctx: CanvasRenderingContext2D
  playfield: Playfield

  private endList: Func[] = []

  constructor(ctx: CanvasRenderingContext2D, playfield: Playfield) {
    this.ctx = ctx
    this.playfield = playfield

    this.setup()
  }

  private setup() {
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)

    this.ctx.canvas.addEventListener('touchstart', this.onStart)
    this.ctx.canvas.addEventListener('touchmove', this.onMove)
    this.ctx.canvas.addEventListener('touchend', this.onEnd)
  }

  private onStart(e: TouchEvent) {
    this.hasMouseDown = true
    const { pageX, pageY } = e.touches[0]
    this.mouseDownPoint = { x: pageX, y: pageY }
    this.mouseMovePoint = { x: pageX, y: pageY }
  }

  private onMove(e: TouchEvent) {
    const { pageX, pageY } = e.touches[0]
    this.mouseMovePoint = { x: pageX, y: pageY }
  }

  private onEnd() {
    this.hasMouseDown = false

    for (const fn of this.endList) {
      fn()
    }
  }

  public registerEnd(fn: Func) {
    this.endList.push(fn)
  }
}

