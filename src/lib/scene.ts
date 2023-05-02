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

const enum Placement {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
}

type Box = [PointProps, PointProps, PointProps, PointProps]
type BoxList = [Box, Box, Box, Box]

class Border {
  private box_list: BoxList | null
  private placement: Placement | null
  private active_box: Box | null

  constructor(props: RectangleProps | null) {
    this.box_list = props ? this.create_box(props) : null
    this.placement = null
    this.active_box = null
  }

  public to_json() {
    return {
      placement: this.placement,
      active_box: this.active_box,
    }
  }

  public get_current_placement() {
    return this.placement
  }

  public clear() {
    this.placement = null
    this.box_list = null
  }

  public update(props: RectangleProps) {
    this.box_list = this.create_box(props)
  }

  public draw(ctx: I2DCtx) {
    if (this.box_list) {
      this.box_list.forEach(points => {
        draw_points(ctx, points, { strokeStyle: 'blue' })
      })
    }
  }

  public check(point: PointProps) {
    const IDX_MAP: Record<number, Placement> = {
      0: Placement.Top,
      1: Placement.Right,
      2: Placement.Bottom,
      3: Placement.Left,
    }

    if (this.box_list) {
      let current_box: Box | null = null
      let idx: number = -1

      for (let i = 0; i < this.box_list.length; i++) {
        const box = this.box_list[i]
        const props = this.get_props_by_points(box)
        if (rectangle_intersection(props, point)) {
          current_box = box
          idx = i
        }
      }

      if (current_box) {
        this.placement = IDX_MAP[idx]
        this.active_box = current_box
      } else {
        this.placement = null
        this.active_box = null
      }
    }
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

  /**
   * padding size sycn to draw
   * @returns 
   */
  private create_box(props: RectangleProps) {
    const { x, y, w, h } = props
    const padding = scene_state.border_box_padding

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

    return points.map(this.create_size_box) as BoxList
  }

  private create_size_box(point: PointProps) {
    const { x, y } = point

    const size = scene_state.border_box_size

    return [
      { x: x - size, y: y - size },
      { x: x + size, y: y - size },
      { x: x + size, y: y + size },
      { x: x - size, y: y + size },
    ] as Box
  }
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
      scene_state.children.map(r => r.get_props()),
    )
    localStorage.setItem('children', children)
  }
}

export const cache = new Cache()

interface ISceneState {
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
  cursor: string
}

export const scene_state = reactive<ISceneState>({
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
  cursor: 'auto',
})
scene_state.children = cache.get_children()

export const USER_TOOL_OPTS: IXXXOption<Action>[] = [
  { label: 'Select', value: Action.Select },
  { label: 'Rectangle', value: Action.Rectangle },
]

const Cursor_Map: Record<Placement, string> = {
  [Placement.Top]: 'nwse-resize',
  [Placement.Right]: 'nesw-resize',
  [Placement.Bottom]: 'nwse-resize',
  [Placement.Left]: 'nesw-resize',
}

const config = {
  center_line: true,
  cache: true,
}

export let border = new Border(null)

export class Scene {
  private ctx: I2DCtx
  private canvas: HTMLCanvasElement
  private center: PointProps

  private props: RectangleProps | null = null

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
    scene_state.down_point = point
    scene_state.has_down = true

    switch (scene_state.action) {
      case Action.Select:
        const current_rect = this.find_child(point)
        if (current_rect) {
          scene_state.active_rectangle = current_rect
          this.props = current_rect.get_props()
          border = new Border(
            current_rect.get_props(),
          )
        } else {
          const placement = border.get_current_placement()
          if (!!placement) {
            //
          } else {
            scene_state.active_rectangle = null
            this.props = null
            border.clear()
          }
        }
        break
      case Action.Rectangle:
        break
    }
  }

  private find_child(point: PointProps) {
    for (const child of scene_state.children) {
      if (child.is_intersection(point)) {
        return child as Rectangle
      }
    }
    return null
  }

  public on_mouse_move(point: PointProps) {
    scene_state.move_point = point
  }

  public on_mouse_up() {
    switch (scene_state.action) {
      case Action.Select:
        break
      case Action.Rectangle:
        const rect = scene_state.active_rectangle
        if (rect) {
          scene_state.children.push(
            rect
          )
          if (config.cache) {
            cache.cache_children()
          }
          scene_state.active_rectangle = null
        }
        break
    }

    scene_state.has_down = false
    scene_state.down_point = null
  }

  public update() {
    const { down_point, move_point, active_rectangle } = scene_state
    if (!active_rectangle || !move_point) return

    switch (scene_state.action) {
      case Action.Select:
        if (scene_state.has_down) {
          const placement = border.get_current_placement()

          if (placement) {
            //
            
          } else {
            if (move_point) {
              if (this.props && down_point) {
                const xOffset = move_point.x - down_point.x + this.props.x
                const yOffset = move_point.y - down_point.y + this.props.y
    
                active_rectangle.move({ x: xOffset, y: yOffset })
                border.update(active_rectangle.get_props())
                if (config.cache) {
                  cache.cache_children()
                }
              }
            }
          }
        } else {
          border.check(move_point)
          scene_state.cursor = 'auto'

          for (const child of scene_state.children) {
            if (child.is_intersection(move_point)) {
              scene_state.cursor = 'move'
            }
          }

          const placement = border.get_current_placement()
          if (!!placement) {
            active_rectangle.set_style({ fillStyle: 'red' })
            scene_state.cursor = Cursor_Map[placement]
          } else {
            active_rectangle.set_style(null)
          }

          this.canvas.style.cursor = scene_state.cursor
        }
        break
      case Action.Rectangle:
        this.handle_create()
        break
    }
  }

  private handle_create() {
    const { down_point, move_point } = scene_state
    if (!down_point || !move_point) return

    this.canvas.style.cursor = 'crosshair'
    scene_state.active_rectangle = (
      new Rectangle(
        this.create_props(down_point, move_point),
      )
    )
  }

  public draw() {
    if (config.center_line) {
      this.draw_mouse_center_line()
    }
    this.draw_mouse_link_line()
    this.draw_child()
    this.draw_children()

    if (border) {
      border.draw(this.ctx)
    }
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
    for (const child of scene_state.children) {
      child.draw(this.ctx)
    }
  }

  private draw_mouse_link_line() {
    const { down_point, move_point } = scene_state
    if (!down_point || !move_point) return

    draw_line(
      this.ctx,
      down_point,
      move_point,
      { strokeStyle: 'red' }
    )
  }

  private draw_child() {
    if (scene_state.action === Action.Rectangle) {
      if (scene_state.active_rectangle) {
        scene_state.active_rectangle.draw(this.ctx)
      }
    }
  }

  private draw_mouse_center_line() {
    const { down_point, move_point } = scene_state
    if (down_point) {
      draw_line(
        this.ctx,
        this.center,
        down_point,
        { strokeStyle: scene_state.mouse_down_style },
      )
    }

    if (move_point) {
      draw_line(
        this.ctx,
        this.center,
        move_point,
        { strokeStyle: scene_state.mouse_move_style },
      )
    }
  }
}
