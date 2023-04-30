import {
  CanvasApplyStyle,
  CoordsRange,
  EllipsePath,
  Placement,
  PointProps,
  RectangleProps,
  ShapeType,
} from '../type'
import { Border } from './border';
import {
  create_ellipse_path,
  create_rectangle_props,
  draw_ellipse_path,
  draw_rectangle,
  rectangle_intersection,
} from './shared';

class Coords {
  private props: RectangleProps
  private relative_props: RectangleProps

  constructor(props: RectangleProps) {
    this.props = props
    this.relative_props = this.parse_props(props)
  }

  public get_props() {
    return this.props
  }

  public get_relative_props() {
    return this.relative_props
  }

  public update_props(props: RectangleProps) {
    this.props = props
    this.relative_props = this.parse_props(props)
  }

  private parse_props (props: RectangleProps): RectangleProps {
    const { x, y, w, h } = props
  
    let xPartProps: Pick<RectangleProps, 'x' | 'w'> | null = null
    let yPartProps: Pick<RectangleProps, 'y' | 'h'> | null = null
  
    if (w < 0) xPartProps = { x: w + x, w: Math.abs(w) }
    if (h < 0) yPartProps = { y: y + h, h: Math.abs(h) }
  
    let finalProps: RectangleProps = props
    if (xPartProps) finalProps = { ...finalProps, ...xPartProps }
    if (yPartProps) finalProps = { ...finalProps, ...yPartProps }
  
    return finalProps
  }
}

export class DrawElement {
  private type: ShapeType
  private coords: Coords
  private path: EllipsePath | RectangleProps
  private style: CanvasApplyStyle
  private activePlacement: Placement | null
  private border: Border

  constructor(type: ShapeType, p: RectangleProps, style: CanvasApplyStyle) {
    this.type = type
    this.coords = new Coords(p)
    this.style = style
    this.activePlacement = null
    this.border = new Border(this.coords.get_relative_props())
    this.path = this.create_path(p)
  }

  static get_instance(type: ShapeType, props: RectangleProps, style: CanvasApplyStyle) {
    return new this(type, props, style)
  }

  private get props() {
    return this.coords.get_props()
  }

  public getProps() {
    return this.coords.get_props()
  }

  public has_placement() {
    return !!this.activePlacement
  }

  public on_blur() {
    this.activePlacement = null
  }

  public is_valid() {
    return this.props.w > 0 && this.props.h > 0
  }

  public update_props(props: RectangleProps) {
    this.coords.update_props(props)
    this.path = this.create_path(props)
    this.border.update(this.coords.get_relative_props())
  }

  public on_move(down_point: PointProps, move_point: PointProps) {
    const xOffset = move_point.x - down_point.x
    const yOffset = move_point.y - down_point.y

    const props = { ...this.props, x: xOffset, y: yOffset }
    this.update_props(props)
  }

  public on_size(currentProps: RectangleProps, move_point: PointProps) {
    if (!this.activePlacement) return

    const result= this.coord_transform(
      currentProps,
      move_point,
    )

    if (!result) return

    const [_move, _down] = result

    const props = create_rectangle_props(_move, _down)
    this.update_props(props)
  }

  private create_path (props: RectangleProps) {
    if (this.type === ShapeType.Circle) {
      return create_ellipse_path(props)
    } else {
      return props
    }
  }

  private coord_transform(currentProps: RectangleProps, move_point: PointProps) {
    const [p1, p2, p3, p4] = this.create_points_by_props(currentProps)

    switch (this.activePlacement) {
      case Placement.TopLeft:
      case Placement.LeftTop:
        return [move_point, p3]

      case Placement.Top:
        return [{ x: p1.x, y: move_point.y }, p3]

      case Placement.TopRight:
      case Placement.RightTop:
        return [move_point, p4]

      case Placement.Right:
        return [{ x: move_point.x, y: p3.y }, p1]

      case Placement.BottomRight:
      case Placement.RightBottom:
        return [move_point, p1]

      case Placement.Bottom:
        return [{ x: p3.x, y: move_point.y }, p1]

      case Placement.BottomLeft:
      case Placement.LeftBottom:
        return [move_point, p2]

      case Placement.Left:
        return [{ x: move_point.x, y: p1.y }, p3]
    }

    return false
  }

  private create_points_by_props(props: RectangleProps): CoordsRange {
    const { x, y, w, h } = props
  
    return [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ]
  }

  public check_intersect(p: PointProps) {
    const placement = this.border.get_placement_border_if_match(p)

    if (placement) {
      this.activePlacement = placement as Placement
      return true
    }

    const intersectionInRect = rectangle_intersection(
      this.coords.get_relative_props(),
      p,
    )

    return !!intersectionInRect
  }

  public draw (ctx: CanvasRenderingContext2D, focus?: boolean) {
    if (focus) {
      this.border.draw(ctx)
    }

    if (this.type === ShapeType.Circle) {
      draw_ellipse_path(ctx, this.path as EllipsePath, this.style)
    } else {
      draw_rectangle(ctx, this.path as RectangleProps, this.style)
    }
  }
}
