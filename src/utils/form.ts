export function parseForm <T> (target: HTMLFormElement): T {
  const formData = new FormData(target)
  return Object.fromEntries(formData) as T
}