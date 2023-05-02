import {
  CanvasApplyStyle,
  I2DCtx,
  PointProps,
  RectangleProps,
} from "../type";
import {
  draw_line,
  draw_points,
  draw_rectangle,
  rectangle_intersection,
} from "./shared";
import { IXXXOption } from "../components";
import { reactive } from "vue";


export const enum Action {
  Select = 'Select',
  Rectangle = 'Rectangle',
}

interface IUserState {
  border_box_size: number
  border_box_padding: number
  mouse_down_style: string
  mouse_move_style: string
  has_down: boolean
  down_point: PointProps | null
  move_point: PointProps | null
  active_rectangle: Rectangle | null
  children: Rectangle[]
  action: Action
}

export class Rectangle {
  private props: RectangleProps
  private defalt_style: CanvasApplyStyle = { strokeStyle: 'gray' }
  private current_style: CanvasApplyStyle | null

  constructor(props: RectangleProps) {
    this.props = props
    this.current_style = null
  }

  public is_intersection(point: PointProps): Boolean {
    return rectangle_intersection(this.props, point)
  }

  public move(point: PointProps) {
    this.props = Object.assign({}, this.props, point)
  }

  public draw(ctx: I2DCtx) {
    const style = this.current_style ? this.current_style : this.defalt_style
    draw_rectangle(ctx, this.props, style)
  }

  public set_style(stl: CanvasApplyStyle | null) {
    this.current_style = stl
  }

  public get_props() {
    return this.props
  }
}

class Cache {
  public get_children(): Rectangle[] {
    const children = localStorage.getItem('children')
    if (children) {
      try {
        const propsList: RectangleProps[] = JSON.parse(children)
        const childList = propsList.map(props => {
          return new Rectangle(props)
        })
        return childList
      } catch (error) {
        console.log('error ', error);
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

export const cache = new Cache()

export const user_state = reactive<IUserState>({
  border_box_size: 20,
  border_box_padding: 30,
  mouse_down_style: '#ff0000',
  mouse_move_style: '#0000ff',
  has_down: false,
  down_point: null,
  move_point: null,
  active_rectangle: null,
  children: [],
  action: Action.Select,
})
user_state.children = cache.get_children()

export const USER_TOOL_OPTS: IXXXOption<Action>[] = [
  { label: 'Select', value: Action.Select },
  { label: 'Rectangle', value: Action.Rectangle },
]

const config = {
  center_line: true,
  cache: true,
}

export class User {
  private ctx: I2DCtx
  private canvas: HTMLCanvasElement
  private center: PointProps

  private props: RectangleProps | null = null
  private box_list: PointProps[][] | null = null
  private active_box: PointProps[] | null = null

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

    switch (user_state.action) {
      case Action.Select:
        const box = this.get_box_by_point(point)
        this.active_box = box

        let rect: Rectangle | null = null
        for (const child of user_state.children) {
          if (child.is_intersection(point)) {
            rect = child as Rectangle
          }
        }

        if (rect) {
          user_state.active_rectangle = rect
          this.props = rect.get_props()
          this.box_list = this.create_box(this.props)
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
        user_state.active_rectangle = null
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
          const box = this.get_box_by_point(move_point)
          if (box) {
            cursor = 'nw-resize'
          }
          this.canvas.style.cursor = cursor

          if (this.active_box) {
            this.handle_resize()
          } else {
            this.handle_move()
          }
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

  private handle_move() {
    const {
      down_point,
      move_point,
      active_rectangle,
    } = user_state
    if (!down_point || !move_point || !active_rectangle) return

    if (this.props) {
      const xOffset = move_point.x - down_point.x + this.props.x
      const yOffset = move_point.y - down_point.y + this.props.y

      active_rectangle.move({ x: xOffset, y: yOffset })
      this.box_list = this.create_box(
        active_rectangle.get_props()
      )
      if (config.cache) {
        cache.cache_children()
      }
    }
  }

  private handle_resize() {
    const { active_rectangle } = user_state
    if (!active_rectangle) return

    active_rectangle.set_style({ fillStyle: 'red' })
  }

  public draw() {
    if (config.center_line) {
      this.draw_mouse_center_line()
    }
    this.draw_mouse_link_line()
    this.draw_child()
    this.draw_children()

    this.draw_size_box()
  }

  private draw_size_box() {
    if (this.box_list) {
      this.box_list.forEach(points => {
        draw_points(this.ctx, points, { strokeStyle: 'blue' })
      })
    }
  }

  /**
   * padding size sycn to draw
   * @returns 
   */
  private create_box(props: RectangleProps) {
    const { x, y, w, h } = props
    const padding = user_state.border_box_padding

    const top = y
    const right = x + w
    const bottom = h + y
    const left = x

    const points: PointProps[] = [
      {
        x: left - padding,
        y: top - padding,
      },
      {
        x: right + padding,
        y: top - padding,
      },
      {
        x: right + padding,
        y: bottom + padding,
      },
      {
        x: left - padding,
        y: bottom + padding,
      },
    ]

    return points.map(this.create_size_box)
  }

  private create_size_box(point: PointProps) {
    const { x, y } = point

    const size = user_state.border_box_size

    return [
      { x: x - size, y: y - size },
      { x: x + size, y: y - size },
      { x: x + size, y: y + size },
      { x: x - size, y: y + size },
    ] as PointProps[]
  }

  private get_box_by_point(point: PointProps) {
    if (this.box_list) {
      for (const box of this.box_list) {
        const props = this.get_props_by_points(box)
        if (this.is_in_rect(point, props)) {
          return box
        }
      }
    }

    return null
  }

  private get_props_by_points(points: PointProps[]): RectangleProps {
    const [p1, p2, p3] = points

    const w = Math.abs(p1.x - p2.x)
    const h = Math.abs(p1.y - p3.y)

    return {
      x: p1.x,
      y: p1.y,
      w,
      h,
    }
  }

  private is_in_rect(point: PointProps, rect: RectangleProps): Boolean {
    const { x, y, w, h } = rect

    const inX = point.x >= x && point.x <= x + w
    const inY = point.y >= y && point.y <= y + h

    return inX && inY
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
