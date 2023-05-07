import { I2DCtx } from "../type"

export const create_canvas_by_id = <T = HTMLElement>(id: string) => {
  const e = document.getElementById(id)
  if (e) {
    return e as T
  } else {

    const element = document.createElement('canvas')
    document.body.append(element)
    return element
  }
}

export const create_canvas = () => {
  const canvas = create_canvas_by_id<HTMLCanvasElement>('canvas')

  if (!canvas) return null

  const { clientWidth, clientHeight } = document.documentElement

  canvas.width = clientWidth
  canvas.height = clientHeight

  canvas.style.width = clientWidth + 'px'
  canvas.style.height = clientHeight + 'px'

  const ctx = canvas.getContext('2d') as I2DCtx

  return { canvas, ctx }
}
