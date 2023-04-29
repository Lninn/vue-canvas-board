export type I2DCtx = CanvasRenderingContext2D

export interface PointProps {
  x: number
  y: number
}

export type CanvasApplyStyle = Partial<Pick<I2DCtx, 'strokeStyle' | 'fillStyle'>>

export const enum Placement {
  TopLeft = 'TopLeft',
  LeftTop = 'LeftTop',

  Top = 'Top',

  TopRight = 'TopRight',
  RightTop = 'RightTop',

  Right = 'Right',

  BottomRight = 'BottomRight',
  RightBottom = 'RightBottom',

  Bottom = 'Bottom',

  BottomLeft = 'BottomLeft',
  LeftBottom = 'LeftBottom',

  Left = 'Left',
}

export const enum DrawAction {
  Create = '建造模式',
  Move = '移动位置',
  Reize = '改变大小',
}

export type CoordsRange = [PointProps, PointProps, PointProps, PointProps]

export type BorderPlacementMap = Record<Placement, PointProps[]>

export const enum ShapeType {
  RectAngle = 'rectangle',
  Circle = 'circle',
}

export interface CoreState {
  shape_type: ShapeType
}
