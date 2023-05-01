import { reactive } from "vue";
import { I2DCtx, PointProps, RectangleProps } from "../type";
import { draw_line, draw_rectangle } from "./shared";
import { IXXXOption } from "../components";

class Rectangle {
  private props: RectangleProps

  constructor(props: RectangleProps) {
    this.props = props
  }

  public is_intersection(point: PointProps): Boolean {
    const { x, y, w, h } = this.props

    const inX = point.x >= x && point.x <= x + w
    const inY = point.y >= y && point.y <= y + h

    return inX && inY
  }

  public draw(ctx: I2DCtx) {
    draw_rectangle(ctx, this.props, { strokeStyle: 'gray' })
  }

  public get_props() {
    return this.props
  }
}

const enum Action {
  Select = 'Select',
  Rectangle = 'Rectangle',
}

export const USER_TOOL_OPTS: IXXXOption<Action>[] = [
  { label: 'Select', value: Action.Select },
  { label: 'Rectangle', value: Action.Rectangle },
]

interface IUserState {
  mouse_down_style: string
  mouse_move_style: string
  has_down: boolean
  down_point: PointProps | null
  move_point: PointProps | null
  active_rectangle: Rectangle | null
  children: Rectangle[]
  action: Action
}

class Cache {
  public get_children(): Rectangle[] {
    const children = localStorage.getItem('children')
    if (children) {
      try {
        const propsList: RectangleProps[] = JSON.parse(children)
        return propsList.map(props => {
          return new Rectangle(props)
        })
      } catch (error) {
        return []
      }
    } else {
      return []
    }
  }
  public cache_children() {
    const children = JSON.stringify(
      user_state.children.map(r => r.get_props()),
    )
    localStorage.setItem('children', children)
  }
}

const cache = new Cache()

export const user_state = reactive<IUserState>({
  mouse_down_style: '#ff0000',
  mouse_move_style: '#0000ff',
  has_down: false,
  down_point: null,
  move_point: null,
  active_rectangle: null,
  children: cache.get_children(),
  action: Action.Select,
})

const config = {
  center_line: false,
  cache: true,
}

export class User {
  private ctx: I2DCtx
  private canvas: HTMLCanvasElement
  private center: PointProps

  constructor(ctx: I2DCtx, canvas: HTMLCanvasElement) {
    const {
      clientWidth,
      clientHeight,
    } = document.documentElement

    const center: PointProps = {
      x: clientWidth / 2,
      y: clientHeight / 2,
    }
    this.ctx = ctx
    this.canvas =canvas
    this.center = center
  }

  public on_mouse_down(point: PointProps) {
    user_state.down_point = point
    user_state.has_down = true

    if (user_state.active_rectangle) {
      user_state.active_rectangle = null
    }

    switch (user_state.action) {
      case Action.Select:
        let rect: Rectangle | null = null
        for (const child of user_state.children) {
          if (child.is_intersection(point)) {
            rect = child as any
          }
        }

        if (rect) {
          user_state.active_rectangle = rect
        }

        break
      case Action.Rectangle:
        break
    }
  }

  public on_mouse_move(point: PointProps) {
    user_state.move_point = point
  }

  public on_mouse_up() {
    switch (user_state.action) {
      case Action.Select:
        break
      case Action.Rectangle:
        const rect = user_state.active_rectangle
        if (rect) {
          user_state.children.push(
            rect
          )
          if (config.cache) {
            cache.cache_children()
          }
          user_state.active_rectangle = null
        }
        break
    }

    user_state.has_down = false
    user_state.down_point = null
  }

  public update() {
    const { down_point, move_point } = user_state

    switch (user_state.action) {
      case Action.Select:
        if (move_point) {
          let cursor = 'auto'
          for (const child of user_state.children) {
            if (child.is_intersection(move_point)) {
              cursor = 'move'
            }
          }
          this.canvas.style.cursor = cursor
        }
        break
      case Action.Rectangle:
        this.canvas.style.cursor = 'crosshair'

        if (down_point && move_point) {
          user_state.active_rectangle = (
            new Rectangle(
              this.create_props(down_point, move_point),
            )
          )
        }
        break
    }
  }

  public draw() {
    if (config.center_line) {
      this.draw_mouse_center_line()
    }
    this.draw_mouse_link_line()
    this.draw_child()
    this.draw_children()
  }

  private create_props(down: PointProps, move: PointProps) {
    const w = down.x - move.x
    const h = down.y - move.y
    const props: RectangleProps = {
      x: down.x < move.x ? down.x : move.x,
      y: down.y < move.y ? down.y : move.y,
      w: Math.abs(w),
      h: Math.abs(h),
    }
    return props
  }

  private draw_children() {
    for (const child of user_state.children) {
      child.draw(this.ctx)
    }
  }

  private draw_mouse_link_line() {
    const { down_point, move_point } = user_state
    if (!down_point || !move_point) return

    draw_line(
      this.ctx,
      down_point,
      move_point,
      { strokeStyle: 'red' }
    )
  }

  private draw_child() {
    if (user_state.action === Action.Rectangle) {
      if (user_state.active_rectangle) {
        user_state.active_rectangle.draw(this.ctx)
      }
    }
  }

  private draw_mouse_center_line() {
    const { down_point, move_point } = user_state
    if (down_point) {
      draw_line(
        this.ctx,
        this.center,
        down_point,
        { strokeStyle: user_state.mouse_down_style },
      )
    }

    if (move_point) {
      draw_line(
        this.ctx,
        this.center,
        move_point,
        { strokeStyle: user_state.mouse_move_style },
      )
    }
  }
}
