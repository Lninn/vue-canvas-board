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
  Auto = '自由模式',
}

export type CoordsRange = [PointProps, PointProps, PointProps, PointProps]

export const enum ShapeType {
  None = 'none',
  Rectangle = 'rectangle',
  Circle = 'circle',
}

export interface ISceneState {
  active_action: DrawAction
  shape_type: ShapeType
  center_line_visible: boolean
  grid: {
    visible: boolean
    horiztal_size: number
    vertical_size: number
  }
  /**
   * draw a rectangle of both down and move point
   */
  cross_area_visile: boolean
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
