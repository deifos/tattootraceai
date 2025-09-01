export interface GalleryItem {
  id: string
  type: 'base' | 'tattoo' | 'result'
  imageUrl: string
  thumbnail: string
  name?: string
  bodyPart?: string
  timestamp: number
}

const GALLERY_STORAGE_KEY = 'tattoo-gallery'
const MAX_ITEMS_PER_TYPE = 10

class GalleryStorage {
  private getItems(): GalleryItem[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private saveItems(items: GalleryItem[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.warn('Failed to save to localStorage, attempting cleanup:', error)
      
      // If storage is full, aggressively clean up old items
      if (error instanceof DOMException && (error.code === 22 || error.name === 'QuotaExceededError')) {
        // Perform emergency cleanup without a specific new item
        const cleanedItems = this.performEmergencyCleanupGeneric(items)
        try {
          localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(cleanedItems))
        } catch (retryError) {
          console.error('Emergency cleanup failed, clearing all storage:', retryError)
          localStorage.removeItem(GALLERY_STORAGE_KEY)
        }
      } else {
        throw error // Re-throw if it's not a quota error
      }
    }
  }

  private saveItemsWithRetry(items: GalleryItem[], newItem: GalleryItem): void {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.warn('Failed to save to localStorage, performing emergency cleanup:', error)
      
      if (error instanceof DOMException && (error.code === 22 || error.name === 'QuotaExceededError')) {
        // Emergency cleanup: keep only 3 most recent of each type + the new item
        const cleanedItems = this.performEmergencyCleanup(items, newItem)
        
        try {
          localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(cleanedItems))
          // console.log(`Emergency cleanup successful: ${items.length} → ${cleanedItems.length} items`)
        } catch (retryError) {
          console.error('Emergency cleanup failed, clearing all storage:', retryError)
          localStorage.removeItem(GALLERY_STORAGE_KEY)
          // Save just the new item
          try {
            localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify([newItem]))
          } catch (finalError) {
            console.error('Could not save even single item:', finalError)
          }
        }
      } else {
        throw error
      }
    }
  }

  private performEmergencyCleanupGeneric(items: GalleryItem[]): GalleryItem[] {
    // console.log('Performing emergency cleanup - storage quota exceeded (generic)')
    
    // Keep only the 3 most recent items of each type
    const cleanedItems: GalleryItem[] = []
    const types: Array<GalleryItem['type']> = ['base', 'tattoo', 'result']
    
    types.forEach(type => {
      const itemsOfType = items
        .filter(item => item.type === type)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 3) // Keep only 3 most recent
      
      cleanedItems.push(...itemsOfType)
    })
    
    return cleanedItems
  }

  private performEmergencyCleanup(items: GalleryItem[], newItem: GalleryItem): GalleryItem[] {
    // console.log('Performing emergency cleanup - storage quota exceeded')
    
    // Keep only the 3 most recent items of each type (excluding the new item)
    const cleanedItems: GalleryItem[] = []
    const types: Array<GalleryItem['type']> = ['base', 'tattoo', 'result']
    
    types.forEach(type => {
      const itemsOfType = items
        .filter(item => item.type === type && item.id !== newItem.id)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 3) // Keep only 3 most recent (not including new item)
      
      cleanedItems.push(...itemsOfType)
    })
    
    // Always include the new item
    cleanedItems.push(newItem)
    
    return cleanedItems
  }

  /**
   * Generate optimized thumbnail for gallery display
   * - For external URLs: use original (already optimized)
   * - For data URLs: create smaller version to save localStorage space
   */
  private async generateThumbnail(imageUrl: string): Promise<string> {
    // Skip thumbnail generation for external URLs - they're already optimized
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }

    // Only generate thumbnails for data URLs (user uploads)
    return this.createThumbnailFromDataUrl(imageUrl)
  }

  private createThumbnailFromDataUrl(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          resolve(dataUrl)
          return
        }

        // Simple 150x150 thumbnail with aspect ratio preserved
        const size = 150
        canvas.width = size
        canvas.height = size
        
        // Calculate scale to fit image in square
        const scale = Math.min(size / img.width, size / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        
        // Center image in canvas
        const x = (size - scaledWidth) / 2
        const y = (size - scaledHeight) / 2
        
        // White background for non-square images
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, size, size)
        
        // Draw scaled image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
        
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      
      img.onerror = () => resolve(dataUrl)
      img.src = dataUrl
    })
  }

  async addItem(
    type: GalleryItem['type'], 
    imageUrl: string, 
    name?: string, 
    bodyPart?: string
  ): Promise<GalleryItem> {
    // console.log('Adding item to gallery:', { type, imageUrl: imageUrl.substring(0, 50), name, isExternal: imageUrl.startsWith('http') })
    
    const items = this.getItems()
    
    // Check if the same image URL already exists for this type
    const existingItem = items.find(item => item.type === type && item.imageUrl === imageUrl)
    if (existingItem) {
      console.log('Image already exists in gallery, returning existing item:', existingItem.id)
      return existingItem
    }
    
    // Generate optimized thumbnail (handles both external URLs and data URLs)
    const thumbnail = await this.generateThumbnail(imageUrl)
    
    const newItem: GalleryItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      type,
      imageUrl,
      thumbnail,
      name,
      bodyPart,
      timestamp: Date.now()
    }
    
    // Remove oldest items if we exceed the limit for this type
    const itemsOfType = items.filter(item => item.type === type)
    if (itemsOfType.length >= MAX_ITEMS_PER_TYPE) {
      const toRemove = itemsOfType
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, itemsOfType.length - MAX_ITEMS_PER_TYPE + 1)
      
      toRemove.forEach(item => {
        const index = items.findIndex(i => i.id === item.id)
        if (index > -1) items.splice(index, 1)
      })
    }

    // Add new item
    items.push(newItem)
    
    // Try to save, with automatic cleanup on quota exceeded
    this.saveItemsWithRetry(items, newItem)
    
    return newItem
  }

  getItemsByType(type: GalleryItem['type']): GalleryItem[] {
    return this.getItems()
      .filter(item => item.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  getAllItems(): GalleryItem[] {
    return this.getItems().sort((a, b) => b.timestamp - a.timestamp)
  }

  removeItem(id: string): void {
    const items = this.getItems().filter(item => item.id !== id)
    this.saveItems(items)
  }

  clearAll(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GALLERY_STORAGE_KEY)
    }
  }

  clearByType(type: GalleryItem['type']): void {
    const items = this.getItems().filter(item => item.type !== type)
    this.saveItems(items)
  }
}

export const galleryStorage = new GalleryStorage()