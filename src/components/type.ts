export interface Cursor {
  operation: 'move' | 'create'
}

export type Shape = 'rectangle' | 'circle'

const SHAPES = [
  {
    value: "rectangle",
  },
  {
    value: "circle",
  }
] as const

export interface AppState {
  cursor: Cursor,
  shape: Shape,

  activeToll: typeof SHAPES[number]['value'],
}
