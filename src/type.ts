import { Border } from "./border"

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

export const enum ShapeType {
  Rectangle = 'rectangle',
  Circle = 'circle',
}

export interface ISceneState {
  shape_type: ShapeType
  center_line_visible: boolean
  grid: {
    visible: boolean
    horiztal_size: number
    vertical_size: number
  }
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

interface IElement {
  type: ShapeType
  props: RectangleProps
  path: EllipsePath | RectangleProps
  style: CanvasApplyStyle
  activePlacement: Placement | null
  border: Border
  draw: (ctx: I2DCtx, focus?: boolean) => void
  updateProps: (props: RectangleProps) => void
  check_intersect: (p: PointProps) => boolean
  on_move: (down_point: PointProps, move_point: PointProps) => void
  on_size: (move_point: PointProps, down_point: PointProps) => void
  createPath: (props: RectangleProps) => unknown
}
