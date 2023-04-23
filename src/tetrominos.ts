
const s1 = [
  [ , 1,  ],
  [1, 1, 1],
]
const s2 = [
  [1],
  [1, 1],
  [1]
]
const s3 = [
  [1, 1, 1],
  [ , 1,  ],
]
const s4 = [
  [ , 1],
  [1, 1],
  [ , 1],
]

export class Tetrominos {
  data = [s1, s2, s3, s4]

  private ptr: number = 0

  rotate() {
    const len = this.data.length
    this.ptr = (this.ptr + 1) % len
  }

  getState() {
    return this.data[this.ptr]
  }
}
