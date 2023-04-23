
export function test() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  function draw() {
    ctx.fillStyle = 'red'

    ctx.moveTo(10, 10)
    ctx.lineTo(300, 10)
    ctx.lineTo(300, 300)
    ctx.lineTo(10, 300)
    ctx.fill()
  }

  function loop() {
    
    draw()

    requestAnimationFrame(loop)
  }

  function start() {
    requestAnimationFrame(loop)
  }

  start()

}
