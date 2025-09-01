"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Modal, ModalContent, ModalBody } from "@heroui/react"
import { Button } from "@heroui/button"
import { X, ChevronLeft, ChevronRight, Download, RotateCw } from "lucide-react"
import { DownloadButton } from "./download-button"

export interface LightboxImage {
  id: string
  imageUrl: string
  name: string
  type?: 'base' | 'tattoo' | 'result'
  bodyPart?: string
}

interface ImageLightboxProps {
  images: LightboxImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate?: (index: number) => void
}

export function ImageLightbox({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNavigate 
}: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastTap, setLastTap] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)
  const startTouchRef = useRef({ x: 0, y: 0, distance: 0 })

  const currentImage = images[currentIndex]

  // Reset zoom and position when image changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate?.(currentIndex - 1)
    }
  }, [currentIndex, onNavigate])

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate?.(currentIndex + 1)
    }
  }, [currentIndex, images.length, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goToPrevious, goToNext])

  // Touch/Mouse handlers for zoom and pan
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
        setIsDragging(true)
        startTouchRef.current = { x: touch.clientX, y: touch.clientY, distance: 0 }
      } else if (e.touches.length === 2) {
        // Pinch start
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        startTouchRef.current = { 
          x: (touch1.clientX + touch2.clientX) / 2, 
          y: (touch1.clientY + touch2.clientY) / 2, 
          distance 
        }
      }
    } else {
      // Mouse event
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      setIsDragging(true)
    }
  }, [position])

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()

    if ('touches' in e) {
      if (e.touches.length === 1 && isDragging && scale > 1) {
        // Single touch drag (only when zoomed)
        const touch = e.touches[0]
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        })
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        if (startTouchRef.current.distance > 0) {
          const scaleChange = distance / startTouchRef.current.distance
          const newScale = Math.min(Math.max(scale * scaleChange, 0.5), 4)
          setScale(newScale)
          
          // Update start distance for next calculation
          startTouchRef.current.distance = distance
        }
      }
    } else if (isDragging && scale > 1) {
      // Mouse drag (only when zoomed)
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, scale, dragStart])

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(false)

    if ('touches' in e && e.touches.length === 0) {
      // Handle double tap to zoom
      const now = Date.now()
      const timeDiff = now - lastTap
      
      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap detected
        if (scale === 1) {
          setScale(2)
        } else {
          setScale(1)
          setPosition({ x: 0, y: 0 })
        }
      }
      setLastTap(now)

      // Handle swipe navigation
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - startTouchRef.current.x
      const deltaY = Math.abs(touch.clientY - startTouchRef.current.y)
      
      // Only trigger swipe if not zoomed and horizontal swipe is significant
      if (scale === 1 && Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0) {
          goToPrevious()
        } else {
          goToNext()
        }
      }
    }
  }, [lastTap, scale, goToPrevious, goToNext])

  // Reset zoom
  const handleReset = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  if (!currentImage) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="full"
      backdrop="blur"
      hideCloseButton
      classNames={{
        base: "bg-black/95",
        backdrop: "bg-black/50"
      }}
    >
      <ModalContent>
        <ModalBody className="p-0 relative overflow-hidden">
          {/* Header with controls */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm opacity-75">
                {currentIndex + 1} of {images.length}
              </span>
              {currentImage.name && (
                <span className="text-sm font-medium">{currentImage.name}</span>
              )}
              {currentImage.bodyPart && (
                <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded">
                  {currentImage.bodyPart}
                </span>
              )}
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation buttons */}
          {currentIndex > 0 && (
            <Button
              isIconOnly
              variant="light"
              onPress={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          )}
          
          {currentIndex < images.length - 1 && (
            <Button
              isIconOnly
              variant="light"
              onPress={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          )}

          {/* Image container */}
          <div
            ref={imageRef}
            className="w-full h-screen flex items-center justify-center cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
            >
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.name}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain pointer-events-none select-none"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 p-4 bg-gradient-to-t from-black/50 to-transparent">
            {scale > 1 && (
              <Button
                isIconOnly
                variant="light"
                onPress={handleReset}
                className="text-white hover:bg-white/20"
                title="Reset zoom"
              >
                <RotateCw className="w-5 h-5" />
              </Button>
            )}
            <DownloadButton
              src={currentImage.imageUrl}
              filename={`${currentImage.name || 'image'}.png`}
              variant="light"
              className="text-white hover:bg-white/20"
            >
              <Download className="w-5 h-5" />
            </DownloadButton>
          </div>

          {/* Instructions overlay */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 text-center text-white/75 text-xs">
            <p>Double tap to zoom • Pinch to zoom • Swipe to navigate</p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}