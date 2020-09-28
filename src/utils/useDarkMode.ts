import { useState, useEffect } from 'react'

type StorageMode = 'WindowVar' | 'LocalStorage' | 'SessionStorage'
type DarkMode = 'true' | 'false'
type ListenerFn = (val: boolean) => void

const storageKey = 'darkMode'

const isLocalStorageSupported = () => {
  const testKey = 'testLocalStorage'
  try {
    localStorage.setItem(testKey, '1')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

const isSessionStorageSupported = () => {
  const testKey = 'testSessionStorage'
  try {
    sessionStorage.setItem(testKey, '1')
    sessionStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

let storageMode: StorageMode = 'WindowVar'

try {
  if (isLocalStorageSupported()) {
    storageMode = 'LocalStorage'
  } else if (isSessionStorageSupported()) {
    storageMode = 'SessionStorage'
  }
} catch (e) {
  storageMode = 'WindowVar'
}

function getValue() {
  let val

  try {
    switch (storageMode) {
      case 'LocalStorage': {
        val = localStorage.getItem(storageKey) as DarkMode
        break
      }
      case 'SessionStorage': {
        val = sessionStorage.getItem(storageKey) as DarkMode
        break
      }
      default: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        val = (window as any)[storageKey] as DarkMode
      }
    }
  } catch (e) {
    storageMode = 'WindowVar'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val = (window as any)[storageKey] as DarkMode
  }

  return val as DarkMode
}

function setValue(val: DarkMode) {
  switch (storageMode) {
    case 'LocalStorage': {
      localStorage.setItem(storageKey, val)
      break
    }
    case 'SessionStorage': {
      sessionStorage.setItem(storageKey, val)
      break
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any)[storageKey] = val
    }
  }
}

let listeners: ListenerFn[]

const onStorageEvent = (storageEvent: StorageEvent) => {
  if (storageEvent.key === storageKey) {
    const val = getValue()
    const newVal = !!(!val || val === 'true')
    ;(listeners || []).forEach(x => x(newVal))
  }
}

const registerListener = (listener: ListenerFn) => {
  if (!listeners) {
    listeners = []
    if (storageMode === 'LocalStorage') {
      window.addEventListener('storage', onStorageEvent)
    }
  }

  listeners.push(listener)
  const curr = getValue()
  const newVal = !!(!curr || curr === 'true')
  listener(newVal)
}

const removeListener = (listener: ListenerFn) => {
  const idx = listeners.indexOf(listener)
  listeners.splice(idx, 1)
}

const useDarkMode: () => [boolean, () => void] = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

  const toggleDarkMode = () => {
    const val = getValue() === 'true' ? 'false' : 'true'
    setValue(val)

    const newVal = !!(!val || val === 'true')
    listeners.forEach(x => x(newVal))
  }

  useEffect(() => {
    let val = getValue()

    if (!val) {
      val = 'true'
      setValue(val)
    }

    const fn = (newVal: boolean) => {
      setIsDarkMode(newVal)
    }

    registerListener(fn)

    return () => {
      removeListener(fn)
    }
  }, [])

  return [isDarkMode, toggleDarkMode]
}

export default useDarkMode
