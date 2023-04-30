import { ref, watchEffect } from "vue"
import { CanvasApplyStyle, DrawAction, ISceneState, ShapeType } from "./type"

export const BORDER_PADDING = 20

export const BORDER_RECT_SIZE = 10

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const RECTANGLE_STYLE: CanvasApplyStyle = {
  strokeStyle: '#f7a400',
}
export const ELLIPSE_STYLE: CanvasApplyStyle = {
  strokeStyle: 'blue',
}

const INITIAL_SHAPE_TYPE = ShapeType.None

export const scene_state: ISceneState = {
  active_action: DrawAction.Auto,
  shape_type: INITIAL_SHAPE_TYPE,
  center_line_visible: false,
  grid: {
    visible: false,
    horiztal_size: BORDER_RECT_SIZE * 5,
    vertical_size: BORDER_RECT_SIZE * 5,
  },
  cross_area_visile: true,
}

export const update_scene_state = (ps: Partial<ISceneState>) => {
  Object.assign(scene_state, ps)
}

