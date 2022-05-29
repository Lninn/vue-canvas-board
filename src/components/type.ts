export interface Cursor {
  operation: 'move' | 'create'
}

export type Shape = 'rectangle' | 'circle'

export interface AppState {
  cursor: Cursor,
  shape: Shape,
}
