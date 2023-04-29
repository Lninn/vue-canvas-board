## 画板文档

### 操作

+ 创建一个元素
+ 移动一个元素的位置
+ 改变一个元素的大小

### Rectangle

```ts
interface Props {
  x: number
  y: number
  w: number
  h: number
}
```

### Circle

```ts
interface Props {
  x: number
  y: number
  rx: number
  ry: number
}
```


### 样式

```ts
interface Style {
  strokeStyle: any
  fillStyle: any
}
```


### 通过 class 实现主要逻辑复用

```ts

const rect1Props: RectangleProps = { x: 0, y: 0, w: 10, h: 10 }
const circle1Props: CircleProps = { x: 10, y: 10, rx: 10, ry: 10 }

 interface IElement<P> {
  readonly name: string
  style: CanvasApplyStyle
  activePlacement: Placement | null
  borderPlacement: number

  props: P

  draw: (ctx: I2DCtx) => void
  on_size: (down_point: PointProps, move_point: PointProps) => void
  on_move: (down_point: PointProps, move_point: PointProps) => void
}

class Scene {
  private ctx: I2DCtx
  private elements: Element[]
  private action: DrawAction

  private active_element: Element | null

  constructor(ctx: I2DCtx) {
    this.elements = []
    this.ctx = ctx
    this.action = DrawAction.Create

    this.active_element = null
  }

  private createElement() {
    const e = new Circle(circle1Props)
    this.elements.push(e)
  }

  public update() {
    if (!this.active_element) return

    const down: PointProps ={ x: 0, y: 0 }
    const move: PointProps ={ x: 0, y: 0 }

    switch (this.action) {
      case DrawAction.Create:
        this.createElement()
        break
      case DrawAction.Move:
        this.active_element.on_move(down ,move)
        break
      case DrawAction.Reize:
        this.active_element.on_size(down, move)
        break
    }
  }

  public draw() {
    for (const element of this.elements) {
      element.draw(this.ctx)
    }
  }
}

class Element<P = unknown> implements IElement<P> {
  name: string
  style: CanvasApplyStyle

  activePlacement: Placement | null;
  borderPlacement: number;

  props: P;

  constructor(name: string, props: P, style: CanvasApplyStyle) {
    this.name = name
    this.style = style

    this.activePlacement = null
    this.borderPlacement = 100
    this.props = props
  }

  public on_move(down: PointProps, move: PointProps) {
    const props: P = createProps(down, move)
    this.translate(props)
  }

  public on_size(down: PointProps, move: PointProps) {
    const props: P = createProps(down, move)
    this.translate(props)
  }

  private translate(props: P) {
    this.props = props
    this.borderPlacement = 123
  }

  public draw (ctx: I2DCtx) {
    this.draw_border(ctx)
  }

  private draw_border(ctx: I2DCtx) {
    draw_points(ctx, [])
  }
}

interface RectangleProps {
  x: number
  y: number
  w: number
  h: number
}

class Rectangle extends Element {
  constructor(props: RectangleProps) {
    super('rectangle', props, { strokeStyle: 'red' })
  }

  public draw(ctx: I2DCtx): void {
    super.draw(ctx)

    draw_points(ctx, [])
  }
}

interface CircleProps {
  x: number
  y: number
  rx: number
  ry: number
}

class Circle extends Element {
  constructor(props: CircleProps) {
    super('circle', props, { strokeStyle: 'blue' })
  }
}

const createProps = <P, >(down: PointProps, move: PointProps) => {
  return { down, move } as P
}

const rect1 = new Rectangle(rect1Props)
const circle1 = new Circle(circle1Props)

console.log({
  rect1,
  circle1,
});


```


### 测试代码

```ts
interface IElement {
  onAdd: (a: number) => void
}

class Base {
  private a = 1

  public draw() {}

  public update() {}
}

class Element extends Base implements IElement {
  private list: number[] = []
  private b =2

  onAdd(a: number) {
    this.list.push(a)
  }
}

class Rect extends Element {
  name = 'rect'
}

const rect = new Rect()
console.log(rect);


```
