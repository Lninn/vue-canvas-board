import { CanvasApplyStyle, CoreState, ShapeType } from "./type"

export const BORDER_PADDING = 20

export const BORDER_RECT_SIZE = 10

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export const RECTANGLE_STYLE: CanvasApplyStyle = {
  strokeStyle: '#f7a400',
}
export const ELLIPSE_STYLE: CanvasApplyStyle = {
  strokeStyle: 'blue',
}

export const INITIAL_SHAPE_TYPE = ShapeType.Circle

export let CORE_STATE: CoreState = {
  shape_type: INITIAL_SHAPE_TYPE
}

export const update_state = (part_state: Partial<CoreState>) => {
  CORE_STATE = {
    ...CORE_STATE,
    ...part_state,
  }
}
