import { CoreState, ShapeType } from "./type"

export const BORDER_PADDING = 20

export const BORDER_RECT_SIZE = 10

export const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export let CORE_STATE: CoreState = {
  shape_type: ShapeType.RectAngle
}

export const update_state = (part_state: Partial<CoreState>) => {
  CORE_STATE = {
    ...CORE_STATE,
    ...part_state,
  }
}
