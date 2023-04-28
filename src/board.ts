import { Rectangle, RectangleProps } from './rectangle'
import { draw_line, draw_rectangle } from './shared'
import { CanvasApplyStyle, I2DCtx, PointProps } from './type'

const RECTANGLE_STYLE: CanvasApplyStyle = {
  strokeStyle: '#f7a400',
}

const enum DrawAction {
  Create,
  Move,
  Reize,
}

export class Board {
  private has_down: boolean
  private down_point: PointProps | null
  private click_down_pont: PointProps | null
  private move_point: PointProps | null

  private width: number
  private height: number

  private center: PointProps
  private currentRectangleProps: RectangleProps | null
  private rectangleList: Rectangle[]
  private currentRectangle: Rectangle | null

  private action: DrawAction

  constructor() {
    const { clientWidth, clientHeight } = document.documentElement

    const c: PointProps = { x: clientWidth / 2, y: clientHeight / 2 }
    this.width = clientWidth
    this.height = clientHeight
    this.center = c
    this.has_down = false
    this.down_point = null
    this.click_down_pont = null
    this.move_point = null
    this.currentRectangleProps = null
    this.rectangleList = []
    this.currentRectangle = null
    this.action = DrawAction.Create
  }

  public on_pointer_down(crtP: PointProps) {
    this.reset_rectangle()

    const r = this.try_find_rectangle(crtP)

    if (r) {
      r.focus_toggle(true)
      this.currentRectangle = r

      const offsetX = crtP.x - r.props.x
      const offsetY = crtP.y - r.props.y

      this.down_point = { x: offsetX, y: offsetY }
      this.action = DrawAction.Move

      if (r.has_placement()) {
        this.action = DrawAction.Reize
        // TODO
        console.log(r)
      }
    } else {
      this.action = DrawAction.Create
      this.down_point = crtP
    }

    this.has_down = true
    this.click_down_pont = crtP
  }

  public on_move(p: PointProps) {
    if (this.has_down) {
      this.move_point = p
    }
  }

  public on_up() {
    const props = this.getCurrentRectangleProps()

    switch (this.action) {
      case DrawAction.Create:
        if (props) {
          const r = new Rectangle(props, RECTANGLE_STYLE)
          this.rectangleList.push(r)
        }
        break
      case DrawAction.Move:
        break
    }

    this.has_down = false
    this.down_point = null
    this.move_point = null
  }

  private try_find_rectangle(p: PointProps) {
    const r = this.rectangleList.find((rect) => {
      return rect.hasInteracion(p)
    })

    return r
  }

  private reset_rectangle() {
    const rectangle = this.currentRectangle
    if (rectangle) {
      rectangle.focus_toggle(false)
      rectangle.reset()
    }
  }

  private getCurrentRectangleProps() {
    const { down_point, move_point } = this

    if (!down_point || !move_point) return null

    const sizeOfHorizontal = move_point.x - down_point.x
    const sizeOfVertical = move_point.y - down_point.y

    const props: RectangleProps = {
      x: down_point.x,
      y: down_point.y,
      w: sizeOfHorizontal,
      h: sizeOfVertical,
    }

    return props
  }

  private renderCurrentRectangleList(ctx: I2DCtx) {
    for (const rectangle of this.rectangleList) {
      rectangle.draw(ctx)
    }
  }

  private renderRectangle(ctx: I2DCtx) {
    const props = this.currentRectangleProps

    if (props) {
      draw_rectangle(ctx, props, RECTANGLE_STYLE)
    }
  }

  private renderLineOfMousePoint(ctx: I2DCtx) {
    const { down_point, move_point } = this
    if (!down_point || !move_point) return

    const style: CanvasApplyStyle = { strokeStyle: '#0040ff' }
    draw_line(ctx, down_point, move_point, style)
  }

  private renderGuideLines(ctx: I2DCtx) {
    const { width, height } = this

    const style1 = { strokeStyle: 'blue' }

    draw_line(ctx, { x: 0, y: height / 2 }, { x: width, y: height / 2 }, style1)
    draw_line(ctx, { x: width / 2, y: 0 }, { x: width / 2, y: height }, style1)

    if (this.down_point) draw_line(ctx, this.center, this.down_point, { strokeStyle: '#ff0000' })
    if (this.move_point) draw_line(ctx, this.center, this.move_point, { strokeStyle: '#00b341' })
    if (this.click_down_pont)
      draw_line(ctx, this.center, this.click_down_pont, { strokeStyle: '#000' })
  }

  public update() {
    const { currentRectangle, rectangleList, down_point, move_point } = this
    const nextProps = this.getCurrentRectangleProps()
    switch (this.action) {
      case DrawAction.Create:
        this.currentRectangleProps = nextProps
        break
      case DrawAction.Move:
        if (currentRectangle && down_point && move_point) {
          currentRectangle.onMove(down_point, move_point)
        }
        break
      case DrawAction.Reize:
        //
        break
    }

    for (const rectangle of rectangleList) {
      rectangle.update()
    }
  }

  public draw(ctx: I2DCtx) {
    this.renderGuideLines(ctx)
    this.renderLineOfMousePoint(ctx)
    this.renderRectangle(ctx)
    this.renderCurrentRectangleList(ctx)
  }
}
