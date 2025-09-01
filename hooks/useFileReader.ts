import { useState, useCallback } from "react"
import { processImage, type ProcessingOptions, type ProcessingResult } from "@/lib/image-processor"

interface FileValidationOptions {
  maxSizeInMB?: number
  allowedTypes?: string[]
  maxWidth?: number
  maxHeight?: number
  enableProcessing?: boolean
  processingOptions?: ProcessingOptions
  onSuccess?: (dataUrl: string, file: File) => void
  onError?: (error: string) => void
  onProcessingComplete?: (result: ProcessingResult) => void
}

interface FileReadResult {
  dataUrl: string | null
  file: File | null
  error: string | null
  isLoading: boolean
}

const DEFAULT_OPTIONS: FileValidationOptions = {
  maxSizeInMB: 50,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  maxWidth: 4000,
  maxHeight: 4000,
  enableProcessing: true,
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

      let finalFile = file
      let processingResult: ProcessingResult | null = null

      // Process image if it's an image file and processing is enabled
      if (file.type.startsWith('image/') && config.enableProcessing) {
        try {
          processingResult = await processImage(file, config.processingOptions)
          finalFile = processingResult.processedFile
          
          // Call processing complete callback if provided
          if (config.onProcessingComplete) {
            config.onProcessingComplete(processingResult)
          }
        } catch (processingError) {
          console.warn('Image processing failed, using original file:', processingError)
          // Continue with original file if processing fails
          finalFile = file
        }
      }

      // Read final file as data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          resolve(result)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(finalFile)
      })

      // Validate image dimensions (using processed dimensions if available)
      if (finalFile.type.startsWith('image/')) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.onerror = () => reject(new Error('Failed to load image'))
          image.src = dataUrl
        })

        // Only validate dimensions if no processing was done (processed images are already within limits)
        if (!processingResult?.wasProcessed) {
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
      }

      setResult({
        dataUrl,
        file: finalFile,
        error: null,
        isLoading: false,
      })

      // Call success callback if provided
      if (config.onSuccess) {
        config.onSuccess(dataUrl, finalFile)
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
  }, [validateFile, validateImageDimensions, config])

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