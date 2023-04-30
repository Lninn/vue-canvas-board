import { SCENE_STATE, RECTANGLE_STYLE } from "./constant"
import { DrawElement } from "./element"
import {
  create_rectangle_props,
  draw_line,
} from "./shared"
import {
  I2DCtx,
  DrawAction,
  PointProps,
  CanvasApplyStyle,
  RectangleProps,
} from "./type"

import { ref } from 'vue'

const INITIAL_DRAW_ACTION = DrawAction.Create

export const action_ref = ref(INITIAL_DRAW_ACTION)
export const count_ref = ref(0)

export class Scene {
  private ctx: I2DCtx
  private children: DrawElement[]
  private selected: DrawElement | null
  private action: DrawAction
  private active_props: RectangleProps | null
  private has_down: boolean
  private down_point: PointProps | null
  private move_point: PointProps | null
  private width: number
  private height: number
  private center: PointProps

  constructor(ctx: I2DCtx) {
    const { clientWidth, clientHeight } = document.documentElement

    const c: PointProps = { x: clientWidth / 2, y: clientHeight / 2 }

    this.width = clientWidth
    this.height = clientHeight
    this.center = c
    this.children = []
    this.selected = null
    this.ctx = ctx
    this.action = INITIAL_DRAW_ACTION
    this.active_props = null
    this.has_down = false
    this.down_point = null
    this.move_point = null
  }

  public remove_active_child() {
    if (this.selected) {
      const idx = this.children.findIndex(c => c === this.selected)
      if (idx !== -1) {
        this.children.splice(idx, 1)
      }

      this.selected = null
      count_ref.value = this.children.length
    }
  }

  public on_pointer_down(p: PointProps) {
    this.down_point = p
    this.has_down = true

    if (this.selected) {
      this.selected = null
    }

    const selIdx = this.children.findIndex((rect) => {
      return rect.check_intersect(p)
    })

    if (selIdx !== -1) {
      const selectRectangle = this.children[selIdx]

      if (selectRectangle.has_placement()) {
        this.action = DrawAction.Reize

        this.active_props = selectRectangle.getProps()
      } else {
        this.action = DrawAction.Move

        this.active_props = selectRectangle.getProps()
      }

      this.selected = selectRectangle
    } else {
      const element = DrawElement.get_instance(
        SCENE_STATE.shape_type,
        { x: p.x, y: p.y, w: 0, h: 0 },
        RECTANGLE_STYLE,
      )
  
      this.selected = element
      this.action = DrawAction.Create
    }

    action_ref.value = this.action
  }

  public on_move(p: PointProps) {
    if (this.has_down) {
      this.move_point = p
    }
  }

  public on_pointer_up() {
    this.has_down = false
    this.down_point = null
    this.move_point = null

    switch (this.action) {
      case DrawAction.Create:
        if (this.selected) {
          if (this.selected.is_valid()) {
            this.children.push(this.selected)
            count_ref.value = this.children.length
          } else {
            //
          }

          this.selected = null
          this.active_props = null
        }
        break
      case DrawAction.Move:
        this.active_props = null
      case DrawAction.Reize:
        if (this.selected) {
          this.selected.on_blur()
        }

        this.active_props = null
        break
    }
  }

  public update() {
    const { down_point, move_point } = this
    if (!down_point || !move_point) return

    switch (this.action) {
      case DrawAction.Create:
        if (this.selected) {
          const props = create_rectangle_props(down_point, move_point)

          this.selected.update_props(props)
          this.active_props = props
        }
        break
      case DrawAction.Move:
        if (this.selected && this.active_props) {
          const offsetX = down_point.x - this.active_props.x
          const offsetY = down_point.y - this.active_props.y

          const offset_down: PointProps = { x: offsetX, y: offsetY }

          this.selected.on_move(offset_down, move_point)
        }
        break
      case DrawAction.Reize:
        if (this.selected && this.active_props) {
          this.selected.on_size(
            this.active_props,
            move_point,
          )
        }
        break
    }
  }

  public draw(ctx: I2DCtx) {
    if (SCENE_STATE.center_line_visible) {
      this.renderGuideLines(ctx)
    }

    for (const c of this.children) {
      c.draw(this.ctx, c === this.selected)
    }

    if (this.selected) {
      this.selected.draw(ctx)
    }

    if (SCENE_STATE.grid.visible) {
      this.draw_grid(ctx)
    }
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

  private draw_grid(ctx: I2DCtx) {
    const { horiztal_size, vertical_size } = SCENE_STATE.grid

    for (let i = 1; i < this.width / horiztal_size; i++) {
      draw_line(
        ctx,
        { x: i * horiztal_size, y: 0 },
        { x: i * horiztal_size, y: this.height },
        { strokeStyle: '#00b341' },
      )
    }

    for (let i = 1; i < this.height / vertical_size; i++) {
      draw_line(
        ctx,
        { x: 0, y: i * vertical_size },
        { x: this.width, y: i * vertical_size },
        { strokeStyle: '#00b341' },
      )
    }
  }
}
