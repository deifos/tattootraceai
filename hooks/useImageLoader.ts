import { useState, useCallback, useMemo } from "react"

interface ImageLoadResult {
  imageObj: HTMLImageElement | null
  isLoading: boolean
  error: string | null
}

interface UseImageLoaderOptions {
  onError?: (error: string) => void
}

// Helper function to load image with promise
const loadImagePromise = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function useImageLoader(options: UseImageLoaderOptions = {}) {
  const [result, setResult] = useState<ImageLoadResult>({
    imageObj: null,
    isLoading: false,
    error: null,
  })

  const loadImage = useCallback(async (src: string | null) => {
    if (!src) {
      setResult({ imageObj: null, isLoading: false, error: null })
      return null
    }

    setResult(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const img = await loadImagePromise(src)
      setResult({ imageObj: img, isLoading: false, error: null })
      return img
    } catch (error) {
      const errorMessage = "Failed to load image"
      setResult({ imageObj: null, isLoading: false, error: errorMessage })
      options.onError?.(errorMessage)
      return null
    }
  }, [options.onError])

  const clearImage = useCallback(() => {
    setResult({ imageObj: null, isLoading: false, error: null })
  }, [])

  return {
    ...result,
    loadImage,
    clearImage,
  }
}