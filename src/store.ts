import { CanvasApplyStyle, DrawAction, ShapeType } from "./type"
import { IXXXOption } from "./components"
import { ref, watchEffect } from "vue"

export const BORDER_PADDING = 20

export const BORDER_RECT_SIZE = 10

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const RECTANGLE_STYLE: CanvasApplyStyle = {
  strokeStyle: '#f7a400',
}
export const ELLIPSE_STYLE: CanvasApplyStyle = {
  strokeStyle: 'blue',
}

interface IConfig {
  center_line_visible: boolean
  grid: {
    visible: boolean
    horiztal_size: number
    vertical_size: number
  }
  cross_area_visile: boolean
}

export const TOOL_PANEL_OPTS: IXXXOption<ShapeType>[] = [
  { label: '选择', value: ShapeType.Select },
  { label: '矩形', value: ShapeType.Rectangle },
  { label: '圆形', value: ShapeType.Circle },
]

interface IState {
  active_action: DrawAction
  shape_type: ShapeType
  shape_count: number
}

const intial_state: IState = {
  active_action: DrawAction.Create,
  shape_type: ShapeType.Rectangle,
  shape_count: 0,
}

export const state_ref = ref<IState>(intial_state)

export class SceneState {
  public config: IConfig

  private active_action: DrawAction
  private shape_type: ShapeType
  private shape_count: number

  constructor(active_action: DrawAction, shape_type: ShapeType) {
    this.active_action = active_action
    this.shape_type = shape_type
    this.shape_count = 0

    state_ref.value = {
      active_action,
      shape_type,
      shape_count: 0,
    }

    this.config = {
      center_line_visible: false,
      grid: {
        visible: false,
        horiztal_size: BORDER_RECT_SIZE * 5,
        vertical_size: BORDER_RECT_SIZE * 5,
      },
      cross_area_visile: true,
    }
  }

  public update_state(s: Partial<IState>) {
    Object.assign(this, s)

    state_ref.value = this.get_state()
  }

  public get_action() {
    return this.active_action
  }

  public get_shape_type() {
    return this.shape_type
  }

  private get_state() {
    return {
      active_action: this.active_action,
      shape_type: this.shape_type,
      shape_count: this.shape_count,
    }
  }
}

export const current_scene_state = new SceneState(
  intial_state.active_action,
  intial_state.shape_type,
)

export const activeOpt = ref(intial_state.shape_type)
watchEffect(() => {
  switch (activeOpt.value) {
    case ShapeType.Select:
      current_scene_state.update_state({
        active_action: DrawAction.Auto,
        shape_type: ShapeType.Select,
      })
      break
    case ShapeType.Rectangle:
      current_scene_state.update_state({
        active_action: DrawAction.Create,
        shape_type: ShapeType.Rectangle,
      })
      break
    case ShapeType.Circle:
      current_scene_state.update_state({
        active_action: DrawAction.Create,
        shape_type: ShapeType.Circle,
      })
      break
  }
})
