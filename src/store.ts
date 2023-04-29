type Callback = () => void

const listOfCallback: Callback[] = []

const is_fn = (val: any): val is Callback => typeof val === 'function'

export const observer = (fn: any) => {
  listOfCallback.push(fn)
}

export const emit = () => {
  for (const fn of listOfCallback) {
    if (is_fn(fn)) {
      fn()
    }
  }
}
