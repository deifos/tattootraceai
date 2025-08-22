"use client"

import { useState, useCallback, useEffect } from "react"
import { ImageUploadCard } from "./image-upload-card"
import { TattooGenerator } from "./tattoo-generator"
import { PreviewCanvas } from "./preview-canvas"
import { ErrorBoundary } from "../error-boundary"
import { Upload } from "lucide-react"
import { galleryStorage, type GalleryItem } from "@/lib/gallery-storage"
import { DeleteConfirmationDialog, type DeleteConfirmationState } from "./delete-confirmation-dialog"
import { GallerySection } from "./gallery-section"
import { addToast } from "@heroui/toast"

interface TattooTryOnClientProps {
  userId?: string
}

export function TattooTryOnClient({ userId }: TattooTryOnClientProps) {
  const [baseImage, setBaseImage] = useState<string | null>(null)
  const [tattooImage, setTattooImage] = useState<string | null>(null)
  const [bodyPart, setBodyPart] = useState<string>("")
  const [isApplying, setIsApplying] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  
  // Confirmation dialog state
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({
    isOpen: false,
    type: 'item'
  })

  // Load gallery items on mount
  useEffect(() => {
    setGalleryItems(galleryStorage.getAllItems())
  }, [])

  const showError = useCallback((message: string) => {
    addToast({
      title: "Error",
      description: message,
      color: "danger",
    })
  }, [])

  const handleBaseImageUpload = useCallback(async (dataUrl: string, file: File) => {
    console.log('handleBaseImageUpload called with:', { fileName: file.name, bodyPart, dataUrlLength: dataUrl.length })
    setBaseImage(dataUrl)
    
    // Save to gallery
    try {
      console.log('About to call galleryStorage.addItem...')
      const result = await galleryStorage.addItem('base', dataUrl, file.name, bodyPart)
      console.log('Gallery item added successfully:', result)
      const allItems = galleryStorage.getAllItems()
      console.log('All gallery items after adding:', allItems.length, allItems.filter(i => i.type === 'base').length)
      setGalleryItems(allItems)
    } catch (error) {
      console.error('Failed to save base image to gallery:', error)
      showError('Failed to save image to gallery')
    }
  }, [bodyPart, showError])

  const handleTattooImageChange = useCallback(async (dataUrl: string, file: File) => {
    setTattooImage(dataUrl)
    
    // Save to gallery
    try {
      await galleryStorage.addItem('tattoo', dataUrl, file.name)
      setGalleryItems(galleryStorage.getAllItems())
    } catch (error) {
      console.warn('Failed to save tattoo image to gallery:', error)
    }
  }, [])

  const handleBaseImageRemove = useCallback(() => {
    setBaseImage(null)
    setBodyPart("") // Clear body part when base image is removed
  }, [])

  const handleTattooImageRemove = useCallback(() => {
    setTattooImage(null)
  }, [])

  const applyTattooToBase = async () => {
    if (!baseImage || !tattooImage) {
      showError("Please upload both a base image and a tattoo design")
      return
    }

    setIsApplying(true)
    try {
      // Simulate AI application process
      await new Promise(resolve => setTimeout(resolve, 3000))
      // In a real app, this would use AI to realistically apply the tattoo to the base image
    } catch (error) {
      console.error("Failed to apply tattoo:", error)
      showError("Failed to apply tattoo. Please try again.")
    } finally {
      setIsApplying(false)
    }
  }

  // Gallery functions
  const handleReuseImage = useCallback((item: GalleryItem) => {
    if (item.type === 'base' || item.type === 'result') {
      setBaseImage(item.imageUrl)
      if (item.bodyPart) {
        setBodyPart(item.bodyPart)
      }
    } else if (item.type === 'tattoo') {
      setTattooImage(item.imageUrl)
    }
  }, [])

  const handleDeleteFromGallery = useCallback((id: string, itemName?: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'item',
      itemId: id,
      itemName
    })
  }, [])

  const handleClearGallery = useCallback((type?: GalleryItem['type']) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'bulk',
      bulkType: type
    })
  }, [])

  const confirmDelete = useCallback(() => {
    if (deleteConfirmation.type === 'item' && deleteConfirmation.itemId) {
      galleryStorage.removeItem(deleteConfirmation.itemId)
      setGalleryItems(galleryStorage.getAllItems())
    } else if (deleteConfirmation.type === 'bulk') {
      if (deleteConfirmation.bulkType) {
        galleryStorage.clearByType(deleteConfirmation.bulkType)
      } else {
        galleryStorage.clearAll()
      }
      setGalleryItems(galleryStorage.getAllItems())
    }
    setDeleteConfirmation({ isOpen: false, type: 'item' })
  }, [deleteConfirmation])

  const cancelDelete = useCallback(() => {
    setDeleteConfirmation({ isOpen: false, type: 'item' })
  }, [])

  // Handle generated result from preview canvas
  const handleGeneratedResult = useCallback(async (imageUrl: string) => {
    try {
      await galleryStorage.addItem('result', imageUrl, 'Generated Result', bodyPart)
      setGalleryItems(galleryStorage.getAllItems())
    } catch (error) {
      console.warn('Failed to save generated result to gallery:', error)
    }
  }, [bodyPart])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Upload & Generate */}
        <div className="space-y-4">
          {/* Base Image Upload */}
          <ErrorBoundary>
            <ImageUploadCard
              title="Upload Base Image"
              image={baseImage}
              onImageUpload={handleBaseImageUpload}
              onImageRemove={handleBaseImageRemove}
              onError={showError}
              placeholder="Click or drag to upload base image"
              icon={Upload}
              disabled={isApplying}
              showBodyPartInput={true}
              bodyPart={bodyPart}
              onBodyPartChange={setBodyPart}
            />
          </ErrorBoundary>

          {/* Tattoo Design */}
          <ErrorBoundary>
            <TattooGenerator
              tattooImage={tattooImage}
              onTattooImageChange={handleTattooImageChange}
              onTattooImageRemove={handleTattooImageRemove}
              onError={showError}
              disabled={isApplying}
            />
          </ErrorBoundary>
        </div>

        {/* Center Panel - Canvas */}
        <div className="lg:col-span-2 ">
          <ErrorBoundary>
            <PreviewCanvas
              baseImage={baseImage}
              tattooImage={tattooImage}
              bodyPart={bodyPart}
              onApplyTattoo={applyTattooToBase}
              isApplying={isApplying}
              onError={showError}
              onGeneratedResult={handleGeneratedResult}
              onTattooRemove={handleTattooImageRemove}
              userId={userId}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* Gallery Section */}
      <GallerySection
        galleryItems={galleryItems}
        onReuseImage={handleReuseImage}
        onDeleteFromGallery={handleDeleteFromGallery}
        onClearGallery={handleClearGallery}
      />

      {/* Confirmation Dialog */}
      <DeleteConfirmationDialog
        deleteConfirmation={deleteConfirmation}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}