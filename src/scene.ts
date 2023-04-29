// import { Circle } from "./circle"
import { CORE_STATE } from "./constant"
import { Rectangle, RectangleProps } from "./rectangle"
import { create_rectangle_meta_list, create_rectangle_props, draw_line, draw_rectangle, get_rectangle_next_size } from "./shared"
import { I2DCtx, DrawAction, PointProps, CanvasApplyStyle, ShapeType } from "./type"

import { ref } from 'vue'

const INITIAL_DRAW_ACTION = DrawAction.Create

export const down_point_ref = ref<PointProps>()
export const move_point_ref = ref<PointProps>()
export const action_ref = ref(INITIAL_DRAW_ACTION)
export const count_ref = ref(0)

const RECTANGLE_STYLE: CanvasApplyStyle = {
  strokeStyle: '#f7a400',
}

export class Scene {
  private ctx: I2DCtx
  private children: Rectangle[]
  private selected: Rectangle | null
  private action: DrawAction

  private active_props: RectangleProps | null

  private has_down: boolean
  private down_point: PointProps | null
  private move_point: PointProps | null
  private width: number
  private height: number
  private center: PointProps

  constructor(ctx: I2DCtx) {
    this.children = []
    this.selected = null
    this.ctx = ctx
    this.action = INITIAL_DRAW_ACTION

    this.active_props = null

    const { clientWidth, clientHeight } = document.documentElement

    const c: PointProps = { x: clientWidth / 2, y: clientHeight / 2 }

    this.width = clientWidth
    this.height = clientHeight
    this.center = c
    this.has_down = false
    this.down_point = null
    this.move_point = null
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

      if (selectRectangle.activePlacement) {
        this.action = DrawAction.Reize

        this.active_props = selectRectangle.props
      } else {
        this.action = DrawAction.Move

        this.active_props = selectRectangle.props
      }

      this.selected = selectRectangle
    } else {
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
        this.create()

        count_ref.value = this.children.length

        this.active_props = null
        break
      case DrawAction.Move:
        this.active_props = null
      case DrawAction.Reize:
        if (this.selected) {
          this.selected.activePlacement = null
        }

        this.active_props = null
        break
    }
  }

  private create() {
    if (this.active_props) {
      if (CORE_STATE.shape_type === ShapeType.Circle) {
        // const r = new Circle({ x: this.active_props.x, y: this.active_props.y, r: 100 })
        // this.children.push(r)
      } else {
        const r = new Rectangle(this.active_props, RECTANGLE_STYLE)
        this.children.push(r)
      }

    }
  }

  public update() {
    const { down_point, move_point } = this

    if (!down_point || !move_point) {
      return
    }

    switch (this.action) {
      case DrawAction.Create:
        const props = create_rectangle_props(down_point, move_point)

        this.active_props = props
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
        if (this.selected) {
          const { activePlacement } = this.selected
          if (!activePlacement || !this.active_props) return

          const [_move, _down] = get_rectangle_next_size(
            activePlacement,
            create_rectangle_meta_list(this.active_props),
            move_point,
          )

          this.selected.on_size(_move, _down)
        }
        break
    }
  }

  public draw(ctx: I2DCtx) {
    this.renderGuideLines(ctx)

    for (const c of this.children) {
      const focus = c === this.selected
      c.draw(this.ctx, focus)
    }

    if (this.active_props && this.action === DrawAction.Create) {
      draw_rectangle(this.ctx, this.active_props, RECTANGLE_STYLE)
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

}
