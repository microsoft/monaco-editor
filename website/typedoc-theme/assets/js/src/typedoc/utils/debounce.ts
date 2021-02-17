export const debounce = (fn: Function, wait: number = 100) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => fn(args), wait)
    }
}
