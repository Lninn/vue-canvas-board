import { Rectangle, RectangleProps, create_rectangle_meta_list } from "./rectangle"
import { create_rectangle_props, draw_rectangle_meta, get_rectangle_next_size } from "./shared"
import { I2DCtx, DrawAction, PointProps, CanvasApplyStyle, CoordsRange } from "./type"

import { ref } from 'vue'

const INITIAL_DRAW_ACTION = DrawAction.Create

export const action_ref = ref(INITIAL_DRAW_ACTION)

const RECTANGLE_STYLE: CanvasApplyStyle = {
  strokeStyle: '#f7a400',
}

export class Player {
  private ctx: I2DCtx
  private children: Rectangle[]
  private selected: Rectangle | null
  private action: DrawAction

  private active_props: RectangleProps | null
  private active_coords: CoordsRange | null

  constructor(ctx: I2DCtx) {
    this.children = []
    this.selected = null
    this.ctx = ctx
    this.action = INITIAL_DRAW_ACTION

    this.active_props = null
    this.active_coords = null
  }

  public on_pointer_down(p: PointProps) {
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

        this.active_coords = selectRectangle.coords
        this.active_props = selectRectangle.props
      } else {
        this.action = DrawAction.Move

        this.active_coords = selectRectangle.coords
        this.active_props = selectRectangle.props
      }

      this.selected = selectRectangle
    } else {
      this.action = DrawAction.Create
    }

    action_ref.value = this.action
  }

  public on_pointer_up() {
    switch (this.action) {
      case DrawAction.Create:
        if (this.active_props && this.active_coords) {
          const r = new Rectangle(this.active_props, this.active_coords, RECTANGLE_STYLE)
          this.children.push(r)

          this.active_coords = null
          this.active_props = null
        }
        break
      case DrawAction.Move:
        this.active_coords = null
        this.active_props = null
      case DrawAction.Reize:
        if (this.selected) {
          this.selected.activePlacement = null
        }

        this.active_coords = null
        this.active_props = null
        break
    }
  }

  public update(down_point: PointProps, move_point: PointProps) {
    switch (this.action) {
      case DrawAction.Create:
        const props = create_rectangle_props(down_point, move_point)
        const meta = create_rectangle_meta_list(props)

        this.active_props = props
        this.active_coords = meta
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
          if (!activePlacement) return

          if (!this.active_coords) return

          const [_move, _down] = get_rectangle_next_size(
            activePlacement,
            this.active_coords,
            move_point,
          )

          this.selected.on_size(_move, _down)
        }
        break
    }
  }

  public draw() {
    for (const c of this.children) {
      const focus = c === this.selected
      c.draw(this.ctx, focus)
    }

    if (this.active_coords && this.action === DrawAction.Create) {
      draw_rectangle_meta(this.ctx, this.active_coords, RECTANGLE_STYLE)
    }
  }
}
