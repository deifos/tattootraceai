"use client"

import { useState, useRef, useEffect } from "react"
import Konva from "konva"
import { useCanvasComposer } from "@/hooks/useCanvasComposer"
import { useFalAI } from "@/hooks/useFalAI"
import { useImageLoader } from "@/hooks/useImageLoader"
import { useKeyboardEvents } from "@/hooks/useKeyboardEvents"
import { useStageSize } from "@/hooks/useStageSize"

// Components
import { CanvasControlButtons } from "./canvas-control-buttons"
import { GeneratedImageView } from "./generated-image-view"
import { LoadingView } from "./loading-view"
import { KonvaStage } from "./konva-stage"
import { EmptyState } from "./empty-state"
import { Card, CardBody, CardHeader } from "@heroui/card"

interface KonvaPreviewCanvasProps {
  baseImage: string | null
  tattooImage: string | null
  bodyPart?: string
  onApplyTattoo: () => void
  isApplying: boolean
  onError?: (error: string) => void
  onGeneratedResult?: (imageUrl: string) => void
  onTattooRemove?: () => void
  userId?: string
}


// Helper function to calculate appropriate scale for tattoo image
const calculateTattooScale = (tattooImg: HTMLImageElement, stageWidth: number, stageHeight: number) => {
  const maxSize = Math.min(stageWidth, stageHeight) * 0.3
  const tattooAspectRatio = tattooImg.width / tattooImg.height
  let targetWidth = maxSize
  let targetHeight = maxSize / tattooAspectRatio
  
  if (targetHeight > maxSize) {
    targetHeight = maxSize
    targetWidth = maxSize * tattooAspectRatio
  }
  
  return Math.min(targetWidth / tattooImg.width, targetHeight / tattooImg.height)
}

export function KonvaPreviewCanvas({
  baseImage,
  tattooImage,
  bodyPart,
  isApplying,
  onError,
  onGeneratedResult,
  onTattooRemove,
  userId,
}: KonvaPreviewCanvasProps) {
  // State
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tattooScale, setTattooScale] = useState(1)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  // Refs
  const stageRef = useRef<Konva.Stage>(null)
  const tattooRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Custom hooks
  const baseImageLoader = useImageLoader({ onError })
  const tattooImageLoader = useImageLoader({ onError })
  const { stageSize, calculateInitialSize } = useStageSize({ 
    containerRef, 
    baseImage: baseImageLoader.imageObj 
  })

  // Hooks for canvas composition and FAL AI
  const { composeImages } = useCanvasComposer()
  const { generateTattoo, isGenerating } = useFalAI({
    onSuccess: (imageUrl) => {
      setGeneratedImage(imageUrl)
      onGeneratedResult?.(imageUrl)
      // Clear the tattoo from preview since it's now applied to the generated image
      onTattooRemove?.()
    },
    onError: (error) => {
      onError?.(error)
    },
    userId,
    baseImageUrl: baseImage || undefined,
    tattooImageUrl: tattooImage || undefined,
    bodyPart
  })

  // Keyboard events
  useKeyboardEvents({
    onDelete: () => {
      if (selectedId === 'tattoo') {
        onTattooRemove?.()
      }
    },
    enabled: selectedId === 'tattoo'
  })

  // Load base image when it changes
  useEffect(() => {
    if (baseImage) {
      setGeneratedImage(null)
      baseImageLoader.loadImage(baseImage).then((img) => {
        if (img) {
          calculateInitialSize(img)
        }
      })
    } else {
      baseImageLoader.clearImage()
      setGeneratedImage(null)
    }
  }, [baseImage]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load tattoo image when it changes
  useEffect(() => {
    if (tattooImage) {
      tattooImageLoader.loadImage(tattooImage).then((img) => {
        if (img && stageSize.width && stageSize.height) {
          const scale = calculateTattooScale(img, stageSize.width, stageSize.height)
          setTattooScale(scale)
        }
      })
    } else {
      tattooImageLoader.clearImage()
      setSelectedId(null)
    }
  }, [tattooImage, stageSize.width, stageSize.height]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update tattoo scale when stage size changes
  useEffect(() => {
    if (tattooImageLoader.imageObj && stageSize.width && stageSize.height) {
      const scale = calculateTattooScale(tattooImageLoader.imageObj, stageSize.width, stageSize.height)
      setTattooScale(scale)
    }
  }, [tattooImageLoader.imageObj, stageSize])



  // Handle transformer attachment
  useEffect(() => {
    if (selectedId === "tattoo" && tattooRef.current && transformerRef.current) {
      transformerRef.current.nodes([tattooRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [selectedId])

  // Handle stage click (deselect)
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  // Handle tattoo selection
  const handleTattooSelect = () => {
    setSelectedId("tattoo")
  }

  // Apply tattoo using AI
  const handleApplyTattoo = async () => {
    if ((!baseImage && !generatedImage) || !tattooImage) {
      onError?.("Please upload both a base image and a tattoo design")
      return
    }

    try {
      // Check if stage is available
      if (!stageRef.current) {
        throw new Error('Canvas stage not available')
      }

      // Compose the canvas images into a single image
      const composition = await composeImages(stageRef as React.RefObject<Konva.Stage>)
      
      
      // Generate the tattoo application using FAL AI
      const prompt = bodyPart ? `Apply this tattoo to the ${bodyPart}` : 'Apply this tattoo to the person'
      await generateTattoo(composition.dataUrl, prompt)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to apply tattoo. Please try again."
      onError?.(errorMessage)
    }
  }

  // Reset canvas
  const resetCanvas = () => {
    setSelectedId(null)
    setGeneratedImage(null)
    
    // Reset tattoo position and scale
    if (tattooRef.current && tattooImageLoader.imageObj) {
      tattooRef.current.position({
        x: stageSize.width / 2,
        y: stageSize.height / 2
      })
      const scale = calculateTattooScale(tattooImageLoader.imageObj, stageSize.width, stageSize.height)
      tattooRef.current.scale({ x: scale, y: scale })
      tattooRef.current.rotation(0)
      tattooRef.current.getLayer()?.batchDraw()
    }
  }

  // Export canvas image
  const exportImage = () => {
    if (!stageRef.current) {
      onError?.("Canvas not available for export")
      return
    }

    try {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 })
      
      // Create download link
      const link = document.createElement('a')
      link.download = 'tattoo-canvas.png'
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Failed to export canvas image:", error)
      onError?.("Failed to export canvas image")
    }
  }


  // Handle back to editor
  const handleBackToEditor = () => {
    setGeneratedImage(null)
    // Re-select tattoo when returning to editor with a small delay
    setTimeout(() => {
      if (tattooImageLoader.imageObj) {
        setSelectedId("tattoo")
      }
    }, 100)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        Preview Canvas
      </CardHeader>
      <CardBody>
        <div 
          ref={containerRef}
          className="w-full bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center"
          style={{ minHeight: '500px' }}
        >
          {baseImageLoader.isLoading || tattooImageLoader.isLoading || (stageSize.width === 0 && (baseImage || generatedImage)) ? (
            <LoadingView />
          ) : generatedImage && !tattooImage ? (
            <GeneratedImageView 
              generatedImage={generatedImage}
              onBackToEditor={handleBackToEditor}
            />
          ) : (baseImage || generatedImage) ? (
            <KonvaStage
              ref={stageRef}
              stageSize={stageSize}
              baseImageObj={baseImageLoader.imageObj}
              tattooImageObj={tattooImageLoader.imageObj}
              tattooScale={tattooScale}
              selectedId={selectedId}
              isGenerating={isGenerating}
              onStageClick={handleStageClick}
              onTattooSelect={handleTattooSelect}
              transformerRef={transformerRef}
              tattooRef={tattooRef}
              generatedImage={generatedImage}
            />
          ) : (
            <EmptyState />
          )}
        </div>

        {(baseImage || generatedImage) && tattooImage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              Click on the tattoo to select it, then drag to move or use the handles to resize and rotate.
              Press Delete or Backspace to remove the selected tattoo from preview.
              {generatedImage && " You can add tattoos to generated images."}
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="mt-4 flex justify-center">
          <CanvasControlButtons
            baseImage={baseImage}
            tattooImage={tattooImage}
            generatedImage={generatedImage}
            isApplying={isApplying}
            isGenerating={isGenerating}
            onApplyTattoo={handleApplyTattoo}
            onReset={resetCanvas}
            onExportCanvas={exportImage}
          />
        </div>
      </CardBody>
    </Card>
  )
}