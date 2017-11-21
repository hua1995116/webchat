const KEY = 'webchat_app'
const localStorage = window.localStorage
let storeStorage

function store() {
  try {
    if (!storeStorage) {
      storeStorage = JSON.parse(localStorage.getItem(KEY) || '{}')
    } else {
      localStorage.setItem(KEY, JSON.stringify(storeStorage))
    }
  } catch (e) {
    console.log(e)
  }
}

store()

export function has(key) {
  return Object.hasOwnProperty.call(storeStorage, key)
}

export function getItem(key) {
  if (!has(key)) {
    return false
  }

  const { value, duration, time } = storeStorage[key] || {}

  if (Date.now() - time <= duration) {
    return value
  }

  removeItem(key)
  return false
}

export function setItem(key, value, duration = Number.MAX_SAFE_INTEGER) {
  storeStorage[key] = {
    value,
    duration,
    time: Date.now()
  }
  store()
}

export function removeItem(key) {
  if (has(key)) {
    delete storeStorage[key]
    store()
  }
}

export function clear() {
  storeStorage = {}
  store()
}
