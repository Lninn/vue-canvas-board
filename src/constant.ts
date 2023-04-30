import { ref, watchEffect } from "vue"
import { CanvasApplyStyle, ISceneState, ShapeType } from "./type"

export const BORDER_PADDING = 20

export const BORDER_RECT_SIZE = 10

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const RECTANGLE_STYLE: CanvasApplyStyle = {
  strokeStyle: '#f7a400',
}
export const ELLIPSE_STYLE: CanvasApplyStyle = {
  strokeStyle: 'blue',
}

export const INITIAL_SHAPE_TYPE = ShapeType.Rectangle

export const SCENE_STATE: ISceneState = {
  shape_type: INITIAL_SHAPE_TYPE,
  center_line_visible: true,
  grid: {
    visible: false,
    horiztal_size: BORDER_RECT_SIZE * 5,
    vertical_size: BORDER_RECT_SIZE * 5,
  }
}

export const current_type_ref = ref(INITIAL_SHAPE_TYPE)
watchEffect(() => {
  SCENE_STATE.shape_type = current_type_ref.value
})
