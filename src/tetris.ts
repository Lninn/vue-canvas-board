import { NUMBER_OF_ROWS, NUMBER_OF_COLUMNS } from './config'
import { Tetrominos } from './tetrominos'
import { Position } from './type'
import { drawRole, drawBackground, drawGrid, getPositionList, createCtx } from './shared'
import { Playfield } from './playfield'
import { Sys } from './sys'

import './style.css'


export function main() {

  const ctx = createCtx()
  if (!ctx) return

  const tetrominos = new Tetrominos()
  const player = new Player(tetrominos)

  const playfield = new Playfield(ctx)
  const sys = new Sys(ctx, playfield)
  playfield.sys = sys

  sys.registerEnd(
    playfield.onMouseEnd
  )

  const timer = new Timer()

  const {
    width,
    height,
  } = ctx.canvas

  timer.update = () => {
    playfield.update()
  }

  timer.draw = () => {
    ctx.clearRect(0, 0, width, height)

    drawBackground(ctx)
    drawGrid(ctx)
    player.draw(ctx)

    playfield.draw()
  }

  timer.start()

  function handleKeyUp(e: KeyboardEvent) {
    const { code } = e

    if (code === 'KeyW') {
      player.up()
    }

    if (code === 'KeyS') {
      player.down()
    }

    if (code === 'KeyA') {
      player.left()
    }

    if (code === 'KeyD') {
      player.right()
    }

    if (code === "Space") {
      tetrominos.rotate()
    }
  }

  function handleClick(e: MouseEvent) {
    if (!ctx) return

    const { pageX, pageY } = e

    const {
      width,
      height,
    } = ctx.canvas

    const rowSpan = height / NUMBER_OF_ROWS
    const columnSpan = width / NUMBER_OF_COLUMNS

    const x = Math.floor(pageY / rowSpan)
    const y = Math.floor(pageX / columnSpan)

    playfield.markClick(x, y)
  }

  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('click', handleClick)
}

class Player {
  private activePosition: Position
  private tetrominos: Tetrominos

  constructor(tetrominos: Tetrominos) {
    this.activePosition = [0, 0]
    this.tetrominos = tetrominos
  }

  check(position: Position) {
    const state = this.tetrominos.getState()

    const list = getPositionList(
      position,
      state,
    )

    return list
  }

  left() {
    let p = [...this.activePosition] as Position
    p[1] = p[1] - 1

    if (this.check(p)) {
      this.activePosition = p
    }
  }

  right() {
    let p = [...this.activePosition] as Position
    p[1] = p[1] + 1

    if (this.check(p)) {
      this.activePosition = p
    }
  }

  up() {
    let p = [...this.activePosition] as Position
    p[0] = p[0] - 1

    if (this.check(p)) {
      this.activePosition = p
    }
  }

  down() {
    let p = [...this.activePosition] as Position
    p[0] = p[0] + 1

    if (this.check(p)) {
      this.activePosition = p
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const {
      activePosition,
      tetrominos,
    } = this

    const state = tetrominos.getState()

    const list = getPositionList(activePosition, state)
    if (list) {
      ctx.fillStyle = 'red'
      list.forEach(position => {
        drawRole(
          ctx,
          position,
        )
      })
    }
  }

}

class Timer {
  id: ReturnType<typeof requestAnimationFrame> | null = null

  constructor() {
    this.loop = this.loop.bind(this)
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
  }

  toggle() {
    if (this.id) {
      console.log('cance');

      cancelAnimationFrame(this.id)
    } else {
      this.start()
    }
  }

  start() {
    this.id = window.requestAnimationFrame(this.loop)
  }

  update() { }
  draw() { }

  loop() {
    this.update()
    this.draw()

    this.id = requestAnimationFrame(this.loop)
  }
}

