import {
  I2DCtx,
  PointProps,
  RectangleProps,
} from "../type";
import { Action, Border, Placement, Rectangle, scene_state } from "./app";


function scene_setup(ctx: I2DCtx) {
  const {
    canvas,
  } = ctx

  const Cursor_Map: Record<Placement, string> = {
    [Placement.Top]: 'nwse-resize',
    [Placement.Right]: 'nesw-resize',
    [Placement.Bottom]: 'nwse-resize',
    [Placement.Left]: 'nesw-resize',
  }

  function update() {

    if (scene_state.has_down) {
      switch (scene_state.action) {
        case Action.Select:
          const { down_point, move_point } = scene_state

          const placement = scene_state.border.get_current_placement()

          if (down_point && move_point) {
            const x_move_offset = move_point.x - down_point.x
            const y_move_offset = move_point.y - down_point.y

            if (placement) {
              change_element(placement, x_move_offset, y_move_offset)
            } else {
              if (scene_state.active_rectangle) {
                move_element(x_move_offset, y_move_offset)
              } else {
                handle_move_style()
              }
            }
          }

          break
        case Action.Rectangle:
          create_element()
          break
      }
    } else {
      handle_move_style()
    }
  }

  function draw() {
    if (scene_state.action === Action.Rectangle) {
      if (scene_state.active_rectangle) {
        scene_state.active_rectangle.draw(ctx)
      }
    }

    for (const child of scene_state.children) {
      child.draw(ctx)
    }

    if (scene_state.border) {
      scene_state.border.draw(ctx)
    }
  }

  function handle_pointer_down() {
    const placement = scene_state.border.get_current_placement()
    if (placement) {
      // 更新到最新的 props
      if (scene_state.active_rectangle) {
        scene_state.old_props = scene_state.active_rectangle.get_props()
      }
    } else {
      const current_rect = find_child(scene_state.down_point)
      if (current_rect) {
        scene_state.active_rectangle = current_rect
        scene_state.old_props = current_rect.get_props()
        scene_state.border = new Border(
          current_rect.get_props(),
        )
      } else {
        scene_state.active_rectangle = null
        scene_state.old_props = null
        scene_state.border.clear()
      }
    }
  }

  function create_element() {
    const { down_point, move_point } = scene_state
    if (!down_point || !move_point) return

    canvas.style.cursor = 'crosshair'
    scene_state.active_rectangle = (
      new Rectangle(
        create_props(down_point, move_point),
      )
    )
  }

  function move_element(
    x_move_offset: number,
    y_move_offset: number,
  ) {
    if (scene_state.old_props) {
      const xOffset = x_move_offset + scene_state.old_props.x
      const yOffset = y_move_offset + scene_state.old_props.y

      if (scene_state.active_rectangle) {
        scene_state.active_rectangle.move({ x: xOffset, y: yOffset })
        scene_state.border.update(scene_state.active_rectangle.get_props())
      }
    }
  }

  function change_element(
    placement: Placement,
    x_move_offset: number,
    y_move_offset: number,
  ) {
    if (!scene_state.old_props || !scene_state.active_rectangle) return

    let final_move: PointProps | null = null

    const top = scene_state.old_props.y
    const right = scene_state.old_props.x + scene_state.old_props.w
    const bottom = scene_state.old_props.y + scene_state.old_props.h
    const left = scene_state.old_props.x

    switch (placement) {
      case Placement.Top:
        final_move = {
          x: left,
          y: top,
        }
        break
      case Placement.Right:
        final_move = {
          x: right,
          y: top,
        }
        break
      case Placement.Bottom:
        final_move = {
          x: right,
          y: bottom,
        }
        break
      case Placement.Left:
        final_move = {
          x: left,
          y: bottom,
        }
        break
    }

    const is_right_or_bottom = placement === Placement.Right || placement === Placement.Bottom
    const is_left_or_bottom = placement === Placement.Left || placement === Placement.Bottom
    const props = create_props(
      {
        x: is_right_or_bottom ? left : right,
        y: is_left_or_bottom ? top : bottom,
      },
      {
        x: x_move_offset + final_move.x,
        y: y_move_offset + final_move.y,
      }
    )

    if (scene_state.active_rectangle) {
      scene_state.active_rectangle.resize(props)
      scene_state.border.update(scene_state.active_rectangle.get_props())
    }
  }

  function handle_move_style() {
    const { move_point, active_rectangle } = scene_state
    if (!move_point) return

    scene_state.border.check(move_point)
    scene_state.cursor = 'auto'

    for (const child of scene_state.children) {
      if (child.is_intersection(move_point)) {
        scene_state.cursor = 'move'
      }
    }

    const placement = scene_state.border.get_current_placement()
    if (active_rectangle) {
      if (!!placement) {
        active_rectangle.set_style({ fillStyle: '#0000001a' })
        scene_state.cursor = Cursor_Map[placement]
      } else {
        active_rectangle.set_style(null)
      }
    }

    canvas.style.cursor = scene_state.cursor
  }

  function create_props(down: PointProps, move: PointProps) {
    const w = down.x - move.x
    const h = down.y - move.y
    const props: RectangleProps = {
      x: down.x < move.x ? down.x : move.x,
      y: down.y < move.y ? down.y : move.y,
      w: Math.abs(w),
      h: Math.abs(h),
    }
    return props
  }

  function find_child(point: PointProps | null) {
    if (point === null) return null

    for (const child of scene_state.children) {
      if (child.is_intersection(point)) {
        return child as Rectangle
      }
    }

    return null
  }

  return { update, draw, handle_pointer_down }
}

export default scene_setup
