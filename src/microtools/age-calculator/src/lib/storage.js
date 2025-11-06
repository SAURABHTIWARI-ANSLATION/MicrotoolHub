const KEY = 'age_history'

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addHistoryItem(item) {
  const arr = getHistory()
  arr.unshift(item)
  const capped = arr.slice(0, 10)
  try {
    localStorage.setItem(KEY, JSON.stringify(capped))
  } catch (e) {}
  return capped
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
