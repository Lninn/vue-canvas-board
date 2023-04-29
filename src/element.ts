import {
  CanvasApplyStyle,
  EllipsePath,
  Placement,
  PointProps,
  RectangleProps,
  ShapeType,
} from './type'
import { Border } from './border';
import {
  adjust_rectangle_props,
  create_ellipse_path,
  create_rectangle_meta_list,
  create_rectangle_props,
  draw_ellipse_path,
  draw_rectangle,
  get_rectangle_next_size,
  rectangle_intersection,
} from './shared';

export class DrawElement {
  private type: ShapeType
  private props: RectangleProps
  private path: EllipsePath | RectangleProps
  private style: CanvasApplyStyle
  private activePlacement: Placement | null
  private border: Border

  constructor(type: ShapeType, p: RectangleProps, style: CanvasApplyStyle) {
    this.type = type
    this.props = p
    this.style = style
    this.activePlacement = null
    this.border = new Border(p)
    this.path = this.create_path(p)
  }

  static get_instance(type: ShapeType, props: RectangleProps, style: CanvasApplyStyle) {
    return new this(type, props, style)
  }

  private create_path (props: RectangleProps) {
    if (this.type === ShapeType.Circle) {
      return create_ellipse_path(props)
    } else {
      return props
    }
  }

  private update_props(props: RectangleProps) {
    this.props = props
    this.path = this.create_path(props)
    this.border.update(props)
  }

  public getProps() {
    return this.props
  }

  public is_focus() {
    return !!this.activePlacement
  }

  public on_blur() {
    this.activePlacement = null
  }

  public on_move(down_point: PointProps, move_point: PointProps) {
    const xOffset = move_point.x - down_point.x
    const yOffset = move_point.y - down_point.y

    const props = { ...this.props, x: xOffset, y: yOffset }
    this.update_props(props)
  }

  public on_size(currentProps: RectangleProps, move_point: PointProps) {
    if (!this.activePlacement) return

    const [_move, _down] = get_rectangle_next_size(
      this.activePlacement,
      create_rectangle_meta_list(currentProps),
      move_point,
    )

    const props = create_rectangle_props(_move, _down)
    this.update_props(props)
  }

  public check_intersect(p: PointProps) {
    const placement = this.border.get_placement_border_if_match(p)

    if (placement) {
      this.activePlacement = placement as Placement
      return true
    }

    const intersectionInRect = rectangle_intersection(
      adjust_rectangle_props(this.props),
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
