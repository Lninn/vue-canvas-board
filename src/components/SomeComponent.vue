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

// get length from two point
const getLength = (p1: Point, p2: Point) => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  return Math.sqrt(dx * dx + dy * dy)
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
  startPoint: Point,
  endPoint: Point,
) => {
  switch (appState.shape) {
    case 'rectangle':
      const rect: Rect = {
        x: Math.min(startPoint.x, endPoint.x),
        y: Math.min(startPoint.y, endPoint.y),
        width: Math.abs(startPoint.x - endPoint.x),
        height: Math.abs(startPoint.y - endPoint.y),
        shape: 'rectangle'
      }

      return rect

    case 'circle':
      const circle: Circle = {
        x: startPoint.x,
        y: startPoint.y,
        radius: getLength(startPoint, endPoint),
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

    if (currentElement && mode === 'draw') {
      drawElement(ctx, currentElement)
    }
  }

  let hasMouseDown = false

  let mouseDownPoint: Point = { x: 0, y: 0 }
  let mouseMovePoint: Point = { x: 0, y: 0 }
  let mouseUpPoint: Point = { x: 0, y: 0 }

  let mode = 'none'

  function update() {
    handleCursor(mouseMovePoint)

    if (mode === 'move' && hasMouseDown) {
      const deltaX = mouseMovePoint.x - mouseDownPoint.x
      const deltaY = mouseMovePoint.y - mouseDownPoint.y

     if (currentElement) {
       currentElement.x = deltaX
      currentElement.y = deltaY
     }
        
    } else if (mode === 'draw') {
      currentElement = createShape(mouseDownPoint, mouseMovePoint) as Element
    }
  }

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

  const handleMouseDown = (event: MouseEvent) => {
    mouseDownPoint = getMousePos(event)
    hasMouseDown = true

    const element = elements.find(
      element => pointerInElement(mouseDownPoint, element)
    )

    if (element) {
      currentElement = element

      mouseDownPoint.x -= element.x
      mouseDownPoint.y -= element.y
      mode = 'move'
    } else {
      currentElement = createShape(mouseDownPoint, mouseUpPoint) as Element
      mode = 'draw'
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    mouseMovePoint = getMousePos(event)
  }

  const handleMouseUp = (event: MouseEvent) => {
    mouseUpPoint = getMousePos(event)
    hasMouseDown = false

    if (mode === 'move') {
      // do nothing
    } else if (mode === 'draw') {
      elements.push(currentElement as Element)
      currentElement = null
      mode = 'none'
    }
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    update()

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
