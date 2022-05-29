<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AppState } from './type';

const { appState }  = defineProps<{ appState: AppState }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const FATOR = 1
const BORDER_WIDTH = 1

interface Point {
  x: number
  y: number
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

function getMousePos(evt: MouseEvent) {
  return {
    x: evt.clientX * FATOR,
    y: evt.clientY * FATOR
  }
}

function drawLine(ctx: CanvasRenderingContext2D, point1: Point, point2: Point) {
  ctx.beginPath()
  ctx.moveTo(point1.x, point1.y)
  ctx.lineTo(point2.x, point2.y)
  ctx.stroke()
}

function drawRect(ctx: CanvasRenderingContext2D, rect: Rect) {
  ctx.beginPath()
  ctx.rect(rect.x, rect.y, rect.width, rect.height)
  ctx.stroke()
}

function setCursor(canvas: HTMLCanvasElement, cursor: string) {
  canvas.style.cursor = cursor
}

function pointerInRect(point: Point, rect: Rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width &&
    point.y >= rect.y && point.y <= rect.y + rect.height
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

  let currentElement: Rect | null = null

  let elements: Rect[] = []

  function draw(ctx: CanvasRenderingContext2D) {
    elements.forEach(
      element => drawRect(ctx, element)
    )
  }

  let hasMouseDown = false

  let mouseDownPoint: Point = { x: 0, y: 0 }
  let mouseMovePoint: Point = { x: 0, y: 0 }
  let mouseUpPoint: Point = { x: 0, y: 0 }

  const handleMouseDown = (event: MouseEvent) => {
    mouseDownPoint = getMousePos(event)

    const element = elements.find(
      element => pointerInRect(mouseDownPoint, element)
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

    const hasElement = elements.some(
      element => pointerInRect(mouseMovePoint, element)
    )

    if (hasElement) {
      setCursor(canvas, 'move')
    } else {
      setCursor(canvas, 'default')
    }

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


    if (currentElement && pointerInRect(mouseUpPoint, currentElement)) {
      currentElement = null

      appState.cursor.operation = 'move'

    } else {
      const rect: Rect = {
        x: Math.min(mouseDownPoint.x, mouseUpPoint.x),
        y: Math.min(mouseDownPoint.y, mouseUpPoint.y),
        width: Math.abs(mouseDownPoint.x - mouseUpPoint.x),
        height: Math.abs(mouseDownPoint.y - mouseUpPoint.y)
      }

      elements.push(rect)
      
      appState.cursor.operation = 'create'
    }
  }

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)

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
