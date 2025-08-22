import { useState, useCallback } from "react"

interface FileValidationOptions {
  maxSizeInMB?: number
  allowedTypes?: string[]
  maxWidth?: number
  maxHeight?: number
  onSuccess?: (dataUrl: string, file: File) => void
  onError?: (error: string) => void
}

interface FileReadResult {
  dataUrl: string | null
  file: File | null
  error: string | null
  isLoading: boolean
}

const DEFAULT_OPTIONS: FileValidationOptions = {
  maxSizeInMB: 10,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  maxWidth: 4000,
  maxHeight: 4000,
}

export function useFileReader(options: FileValidationOptions = {}) {
  const [result, setResult] = useState<FileReadResult>({
    dataUrl: null,
    file: null,
    error: null,
    isLoading: false,
  })

  const config = { ...DEFAULT_OPTIONS, ...options }

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!config.allowedTypes?.includes(file.type)) {
      return `Invalid file type. Allowed types: ${config.allowedTypes?.join(', ')}`
    }

    // Check file size
    const maxSizeInBytes = (config.maxSizeInMB || 10) * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      return `File size too large. Maximum size: ${config.maxSizeInMB}MB`
    }

    return null
  }, [config])

  const validateImageDimensions = useCallback((img: HTMLImageElement): string | null => {
    if (config.maxWidth && img.width > config.maxWidth) {
      return `Image width too large. Maximum width: ${config.maxWidth}px`
    }

    if (config.maxHeight && img.height > config.maxHeight) {
      return `Image height too large. Maximum height: ${config.maxHeight}px`
    }

    return null
  }, [config])

  const readFile = useCallback(async (file: File): Promise<void> => {
    setResult(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Basic file validation
      const fileError = validateFile(file)
      if (fileError) {
        setResult({
          dataUrl: null,
          file: null,
          error: fileError,
          isLoading: false,
        })
        
        // Call error callback if provided
        if (config.onError) {
          config.onError(fileError)
        }
        return
      }

      // Read file as data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          resolve(result)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })

      // Validate image dimensions
      if (file.type.startsWith('image/')) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.onerror = () => reject(new Error('Failed to load image'))
          image.src = dataUrl
        })

        const dimensionError = validateImageDimensions(img)
        if (dimensionError) {
          setResult({
            dataUrl: null,
            file: null,
            error: dimensionError,
            isLoading: false,
          })
          
          // Call error callback if provided
          if (config.onError) {
            config.onError(dimensionError)
          }
          return
        }
      }

      setResult({
        dataUrl,
        file,
        error: null,
        isLoading: false,
      })

      // Call success callback if provided
      if (config.onSuccess) {
        config.onSuccess(dataUrl, file)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file'
      setResult({
        dataUrl: null,
        file: null,
        error: errorMessage,
        isLoading: false,
      })
      
      // Call error callback if provided
      if (config.onError) {
        config.onError(errorMessage)
      }
    }
  }, [validateFile, validateImageDimensions])

  const reset = useCallback(() => {
    setResult({
      dataUrl: null,
      file: null,
      error: null,
      isLoading: false,
    })
  }, [])

  return {
    ...result,
    readFile,
    reset,
  }
}