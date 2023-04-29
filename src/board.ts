import { Player } from './player'
import {
  draw_line,
} from './shared'
import { CanvasApplyStyle, I2DCtx , PointProps } from './type'

import { ref } from 'vue'

export const down_point_ref = ref<PointProps>()
export const move_point_ref = ref<PointProps>()

export class Board {
  private has_down: boolean
  private down_point: PointProps | null
  private move_point: PointProps | null

  private width: number
  private height: number

  private center: PointProps

  private player: Player

  constructor(player: Player) {
    const { clientWidth, clientHeight } = document.documentElement

    const c: PointProps = { x: clientWidth / 2, y: clientHeight / 2 }
    this.width = clientWidth
    this.height = clientHeight
    this.center = c
    this.has_down = false
    this.down_point = null
    this.move_point = null
    this.player = player
  }

  public on_pointer_down(crtP: PointProps) {
    this.down_point = crtP
    this.has_down = true

    this.player.on_pointer_down(crtP)
  }

  public on_move(p: PointProps) {
    if (this.has_down) {
      this.move_point = p
    }
  }

  public on_up() {
    this.has_down = false
    this.down_point = null
    this.move_point = null

    this.player.on_pointer_up()
  }

  private renderGuideLines(ctx: I2DCtx) {
    const { width, height, center, down_point, move_point } = this

    const style1 = { strokeStyle: 'blue' }
    draw_line(ctx, { x: 0, y: height / 2 }, { x: width, y: height / 2 }, style1)
    draw_line(ctx, { x: width / 2, y: 0 }, { x: width / 2, y: height }, style1)

    if (!down_point || !move_point) return

    const style: CanvasApplyStyle = { strokeStyle: '#0040ff' }
    draw_line(ctx, down_point, move_point, style)

    draw_line(ctx, center, down_point, { strokeStyle: '#ff0000' })
    draw_line(ctx, center, move_point, { strokeStyle: '#00b341' })
  }

  public update() {
    const { down_point, move_point } = this
    if (down_point && move_point) {
      this.player.update(down_point, move_point)
    }
  }

  public draw(ctx: I2DCtx) {
    this.renderGuideLines(ctx)
    this.player.draw()
  }
}
