export type I2DCtx = CanvasRenderingContext2D

export interface PointProps {
  x: number
  y: number
}

export interface Shape {
  hasFocus: boolean
  hasInteracion: (p: PointProps) => boolean
  onMove: (p: PointProps, downPoint: PointProps) => void
  draw: (ctx: I2DCtx) => void
  renderBorder: (ctx: I2DCtx) => void
  update: () => void
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

