export type I2DCtx = CanvasRenderingContext2D

export interface PointProps {
  x: number
  y: number
}

export type CanvasApplyStyle = Partial<Pick<I2DCtx, 'strokeStyle' | 'fillStyle'>>

export const enum DrawAction {
  Create = '建造模式',
  Move = '移动位置',
  Reize = '改变大小',
  Auto = '自由模式',
}

export type CoordsRange = [PointProps, PointProps, PointProps, PointProps]

export const enum ShapeType {
  Select = 'select',
  Rectangle = 'rectangle',
  Circle = 'circle',
}

export interface RectangleProps {
  x: number
  y: number
  w: number
  h: number
}

export interface EllipsePath {
  x: number
  y: number
  rx: number
  ry: number
}
