/**
 * Smart image processing utilities for optimizing large images (especially iPhone photos)
 * Only processes images that are too large, preserving smaller images unchanged
 */

export interface ProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxFileSizeMB?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export interface ProcessingResult {
  processedFile: File
  originalSize: number
  processedSize: number
  wasProcessed: boolean
  dimensions: {
    original: { width: number; height: number }
    processed: { width: number; height: number }
  }
}

const DEFAULT_OPTIONS: Required<ProcessingOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85, // 85% quality - visually indistinguishable but much smaller
  maxFileSizeMB: 2, // Only process files larger than 2MB
  format: 'jpeg'
}

/**
 * Determines if an image needs processing based on file size and dimensions
 */
function shouldProcessImage(
  file: File, 
  imageDimensions: { width: number; height: number }, 
  options: Required<ProcessingOptions>
): boolean {
  const fileSizeMB = file.size / (1024 * 1024)
  const needsResizing = imageDimensions.width > options.maxWidth || imageDimensions.height > options.maxHeight
  const isTooLarge = fileSizeMB > options.maxFileSizeMB
  
  return needsResizing || isTooLarge
}

/**
 * Calculates new dimensions while preserving aspect ratio
 */
function calculateNewDimensions(
  originalWidth: number, 
  originalHeight: number, 
  maxWidth: number, 
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight
  
  let newWidth = originalWidth
  let newHeight = originalHeight
  
  // Scale down if width is too large
  if (newWidth > maxWidth) {
    newWidth = maxWidth
    newHeight = newWidth / aspectRatio
  }
  
  // Scale down if height is still too large
  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = newHeight * aspectRatio
  }
  
  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight)
  }
}

/**
 * Processes an image file by resizing and/or compressing if needed
 */
export async function processImage(
  file: File, 
  options: ProcessingOptions = {}
): Promise<ProcessingResult> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  
  // Create image element to get dimensions
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = URL.createObjectURL(file)
  })
  
  const originalDimensions = { width: img.width, height: img.height }
  
  // Check if processing is needed
  if (!shouldProcessImage(file, originalDimensions, config)) {
    // Return original file if no processing needed
    URL.revokeObjectURL(img.src)
    return {
      processedFile: file,
      originalSize: file.size,
      processedSize: file.size,
      wasProcessed: false,
      dimensions: {
        original: originalDimensions,
        processed: originalDimensions
      }
    }
  }
  
  // Calculate new dimensions
  const newDimensions = calculateNewDimensions(
    originalDimensions.width,
    originalDimensions.height,
    config.maxWidth,
    config.maxHeight
  )
  
  // Create canvas for processing
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    URL.revokeObjectURL(img.src)
    throw new Error('Canvas context not available')
  }
  
  // Set canvas dimensions
  canvas.width = newDimensions.width
  canvas.height = newDimensions.height
  
  // Draw image on canvas with new dimensions
  ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height)
  
  // Clean up
  URL.revokeObjectURL(img.src)
  
  // Convert canvas to blob with compression
  const processedBlob = await new Promise<Blob>((resolve, reject) => {
    const mimeType = config.format === 'png' ? 'image/png' : 'image/jpeg'
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to process image'))
        }
      },
      mimeType,
      config.quality
    )
  })
  
  // Create new file from processed blob
  const processedFile = new File(
    [processedBlob], 
    file.name.replace(/\.[^/.]+$/, `.${config.format === 'png' ? 'png' : 'jpg'}`),
    { 
      type: processedBlob.type,
      lastModified: Date.now()
    }
  )
  
  return {
    processedFile,
    originalSize: file.size,
    processedSize: processedFile.size,
    wasProcessed: true,
    dimensions: {
      original: originalDimensions,
      processed: newDimensions
    }
  }
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Creates processing summary message
 */
export function createProcessingSummary(result: ProcessingResult): string {
  if (!result.wasProcessed) {
    return 'Image uploaded successfully'
  }
  
  const savings = ((result.originalSize - result.processedSize) / result.originalSize * 100).toFixed(0)
  return `Image optimized: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.processedSize)} (${savings}% smaller)`
}