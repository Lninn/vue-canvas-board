export type I2DCtx = CanvasRenderingContext2D

export interface PointProps {
  x: number
  y: number
}

export interface Shape {
  hasFocus: boolean
  hasInteracion: (p: PointProps) => boolean
  update: (p: PointProps) => void
  draw: (ctx: I2DCtx) => void
  renderBorder: (ctx: I2DCtx) => void
}

