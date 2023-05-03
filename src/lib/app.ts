import { create_canvas, draw_points, draw_rectangle, rectangle_intersection } from './shared'
import { CanvasApplyStyle, I2DCtx, PointProps, RectangleProps } from '../type'
import { reactive } from 'vue'
import { IXXXOption } from '../components'
import scene_setup from './scene'

export const enum Placement {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
}

type Box = [PointProps, PointProps, PointProps, PointProps]
type BoxList = [Box, Box, Box, Box]

export class Border {
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

  public resize(props: RectangleProps) {
    this.props = props
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

export const enum Action {
  Select = 'Select',
  Rectangle = 'Rectangle',
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
  old_props: RectangleProps | null
  children: Rectangle[]
  action: Action
  cursor: string
  border: Border
}

export const scene_state = reactive<ISceneState>({
  border_box_size: 5,
  border_box_padding: 10,
  mouse_down_style: '#ff0000',
  mouse_move_style: '#0000ff',
  has_down: false,
  down_point: null,
  move_point: null,
  active_rectangle: null,
  old_props: null,
  children: [],
  action: Action.Select,
  cursor: 'auto',
  border: new Border(null),
})
scene_state.children = cache.get_children()

export const USER_TOOL_OPTS: IXXXOption<Action>[] = [
  { label: 'Select', value: Action.Select },
  { label: 'Rectangle', value: Action.Rectangle },
]

export function main() {
  const payload = create_canvas()
  if (!payload) return

  const { canvas, ctx } = payload
  const scene = scene_setup(ctx)

  const clear = () => {
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }
  const update = () => {
    scene.update()
  }
  const draw = () => {
    scene.draw()
  }
  const loop = () => {
    clear()
    update()
    draw()

    requestAnimationFrame(loop)
  }
  const start = () => {
    requestAnimationFrame(loop)
  }

  const handleMouseDown = (ev: MouseEvent) => {
    const point = to_pc_point(ev)

    scene_state.down_point = point
    scene_state.has_down = true

    scene.handle_pointer_down()
  }

  const handleMouseMove = (ev: MouseEvent) => {
    const crtP = to_pc_point(ev)
    scene_state.move_point = crtP
  }

  const handleMouseUp = () => {
    scene_state.has_down = false
    scene_state.down_point = null

    switch (scene_state.action) {
      case Action.Select:
        break
      case Action.Rectangle:
        const rect = scene_state.active_rectangle
        if (rect) {
          scene_state.children.push(
            rect
          )
          cache.cache_children()
          scene_state.active_rectangle = null
        }
        break
    }
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)

  start()
}

const to_pc_point = (ev: MouseEvent) => {
  const p: PointProps = { x: ev.pageX, y: ev.pageY }

  return p
}
