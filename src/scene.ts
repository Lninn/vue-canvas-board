import { CORE_STATE, ELLIPSE_STYLE, RECTANGLE_STYLE } from "./constant"
import { DrawElement } from "./element"
import {
  create_ellipse_path,
  create_rectangle_props,
  draw_ellipse_path,
  draw_line,
  draw_rectangle,
} from "./shared"
import {
  I2DCtx,
  DrawAction,
  PointProps,
  CanvasApplyStyle,
  ShapeType,
  RectangleProps,
  EllipsePath,
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
  private ellipse_path: EllipsePath | null

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
    this.ellipse_path = null

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

      if (selectRectangle.is_focus()) {
        this.action = DrawAction.Reize

        this.active_props = selectRectangle.getProps()
      } else {
        this.action = DrawAction.Move

        this.active_props = selectRectangle.getProps()
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
        this.active_props = null
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

  private create() {
    if (!this.active_props) return

    const element = DrawElement.get_instance(
      CORE_STATE.shape_type,
      this.active_props,
      RECTANGLE_STYLE,
    )

    this.children.push(element)
    count_ref.value = this.children.length
  }

  public update() {
    const { down_point, move_point } = this

    if (!down_point || !move_point) {
      return
    }

    switch (this.action) {
      case DrawAction.Create:
        const props = create_rectangle_props(down_point, move_point)

        const path = create_ellipse_path(props)
        this.ellipse_path = path

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
    this.renderGuideLines(ctx)

    for (const c of this.children) {
      const focus = c === this.selected
      c.draw(this.ctx, focus)
    }

    if (this.active_props && this.action === DrawAction.Create) {
      
      if (this.action === DrawAction.Create) {
        draw_rectangle(this.ctx, this.active_props, RECTANGLE_STYLE)

        if (CORE_STATE.shape_type === ShapeType.Circle) {
          if (this.ellipse_path) {
            draw_ellipse_path(ctx, this.ellipse_path, ELLIPSE_STYLE)
          }
        }
      }
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
