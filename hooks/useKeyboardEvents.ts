import { useCallback, useEffect } from "react"

interface UseKeyboardEventsOptions {
  onDelete?: () => void
  onEscape?: () => void
  target?: Window | HTMLElement
  enabled?: boolean
}

export function useKeyboardEvents({
  onDelete,
  onEscape,
  target = window,
  enabled = true,
}: UseKeyboardEventsOptions) {
  const handleKeyDown = useCallback((e: Event) => {
    if (!enabled) return
    
    const keyboardEvent = e as KeyboardEvent
    switch (keyboardEvent.key) {
      case 'Delete':
      case 'Backspace':
        keyboardEvent.preventDefault()
        onDelete?.()
        break
      case 'Escape':
        keyboardEvent.preventDefault()
        onEscape?.()
        break
    }
  }, [onDelete, onEscape, enabled])

  useEffect(() => {
    if (!enabled || !target) return

    target.addEventListener('keydown', handleKeyDown)
    
    return () => {
      target.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, target, enabled])

  return { handleKeyDown }
}