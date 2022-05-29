export interface Cursor {
  operation: 'move' | 'create'
}

export interface AppState {
  cursor: Cursor
}
