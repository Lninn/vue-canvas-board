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
