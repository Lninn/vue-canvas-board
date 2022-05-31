<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AppState, Shape } from './type';

const { appState }  = defineProps<{ appState: AppState }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const FATOR = 1
const BORDER_WIDTH = 1

interface Element {
  x: number
  y: number

  shape: Shape
}

interface Point {
  x: number
  y: number
}

interface Rect extends Element {
  width: number
  height: number
}

interface Circle extends Element {
  radius: number
}

function getMousePos(evt: MouseEvent) {
  return {
    x: evt.clientX * FATOR,
    y: evt.clientY * FATOR
  }
}

function drawLine(ctx: CanvasRenderingContext2D, start: Point, end: Point) {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke()
}

function drawElement(ctx: CanvasRenderingContext2D, element: Element) {
  switch (element.shape) {
    case 'rectangle':
      drawRect(ctx, element as Rect)
      break

    case 'circle':
      drawCircle(ctx, element as Circle)
      break

    default:
      break
  }
}

function drawRect(ctx: CanvasRenderingContext2D, rect: Rect) {
  ctx.beginPath()
  ctx.rect(rect.x, rect.y, rect.width, rect.height)
  ctx.stroke()
}

function drawCircle(ctx: CanvasRenderingContext2D, circle: Circle) {
  ctx.beginPath()
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI)
  ctx.stroke()
}

function setCursor(canvas: HTMLCanvasElement, cursor: string) {
  canvas.style.cursor = cursor
}

function pointerInElement(point: Point, element: Element) {
  switch (element.shape) {
    case 'rectangle':
      return pointerInRect(point, element as Rect)
    
    case 'circle':
      return pointerInCircle(point, element as Circle)

    default:
      return false
  }
}

function pointerInRect(point: Point, rect: Rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width &&
    point.y >= rect.y && point.y <= rect.y + rect.height
}

function pointerInCircle(point: Point, circle: Circle) {
  const dx = point.x - circle.x
  const dy = point.y - circle.y
  return dx * dx + dy * dy <= circle.radius * circle.radius
}

const createShape = (
  mouseDownPoint: Point,
  mouseUpPoint: Point,
) => {
  switch (appState.shape) {
    case 'rectangle':
      const rect: Rect = {
        x: Math.min(mouseDownPoint.x, mouseUpPoint.x),
        y: Math.min(mouseDownPoint.y, mouseUpPoint.y),
        width: Math.abs(mouseDownPoint.x - mouseUpPoint.x),
        height: Math.abs(mouseDownPoint.y - mouseUpPoint.y),
        shape: 'rectangle'
      }

      return rect

    case 'circle':
      const circle: Circle = {
        x: Math.min(mouseDownPoint.x, mouseUpPoint.x),
        y: Math.min(mouseDownPoint.y, mouseUpPoint.y),
        radius: Math.abs(mouseDownPoint.x - mouseUpPoint.x),
        shape: 'circle'
      }

      return circle
    default:
      break
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const canvasRect = canvas.getBoundingClientRect()

  canvas.width = canvasRect.width * FATOR
  canvas.height = canvasRect.height * FATOR

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return
  }

  ctx.lineWidth = BORDER_WIDTH

  let currentElement: Element | null = null

  let elements: Element[] = []

  function draw(ctx: CanvasRenderingContext2D) {
    elements.forEach(
      element => drawElement(ctx, element)
    )
  }

  let hasMouseDown = false

  let mouseDownPoint: Point = { x: 0, y: 0 }
  let mouseMovePoint: Point = { x: 0, y: 0 }
  let mouseUpPoint: Point = { x: 0, y: 0 }

  const handleMouseDown = (event: MouseEvent) => {
    mouseDownPoint = getMousePos(event)

    const element = elements.find(
      element => pointerInElement(mouseDownPoint, element)
    )

    if (element) {
      currentElement = element
    } else {
      currentElement = null
    }

    if (currentElement) {
      mouseDownPoint.x -= currentElement.x
      mouseDownPoint.y -= currentElement.y

      hasMouseDown = true
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    mouseMovePoint = getMousePos(event)

    handleCursor(mouseMovePoint)

    if (hasMouseDown && currentElement) {
      const deltaX = mouseMovePoint.x - mouseDownPoint.x
      const deltaY = mouseMovePoint.y - mouseDownPoint.y

      currentElement.x = deltaX
      currentElement.y = deltaY
    }
  }

  const handleMouseUp = (event: MouseEvent) => {
    mouseUpPoint = getMousePos(event)
    hasMouseDown = false

    if (currentElement && pointerInElement(mouseUpPoint, currentElement)) {
      currentElement = null

      appState.cursor.operation = 'move'
    } else {
      const element = createShape(mouseDownPoint, mouseUpPoint)

      if (element) {
        elements.push(element)
      }
      
      appState.cursor.operation = 'create'
    }
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)

  const handleCursor = (movePoint: Point) => {
    const hasFocus = elements.some(
      element => pointerInElement(movePoint, element)
    )

    if (hasFocus) {
      setCursor(canvas, 'move')
    } else {
      setCursor(canvas, 'default')
    }
  }

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    draw(ctx)
  }, 0)
})
</script>

<template>
  <canvas class="canvas" ref="canvasRef" />
</template>

<style>
.canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
