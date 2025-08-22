"use client"

import React, { forwardRef, useEffect } from "react"
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva"
import Konva from "konva"
import { Loader2 } from "lucide-react"
import { useImageLoader } from "@/hooks/useImageLoader"

interface KonvaStageProps {
  stageSize: { width: number; height: number }
  baseImageObj: HTMLImageElement | null
  tattooImageObj: HTMLImageElement | null
  tattooScale: number
  selectedId: string | null
  isGenerating: boolean
  onStageClick: (e: Konva.KonvaEventObject<MouseEvent>) => void
  onTattooSelect: () => void
  transformerRef: React.RefObject<Konva.Transformer | null>
  tattooRef: React.RefObject<Konva.Image | null>
  generatedImage?: string | null
}

export const KonvaStage = forwardRef<Konva.Stage, KonvaStageProps>(
  ({
    stageSize,
    baseImageObj,
    tattooImageObj,
    tattooScale,
    selectedId,
    isGenerating,
    onStageClick,
    onTattooSelect,
    transformerRef,
    tattooRef,
    generatedImage,
  }, stageRef) => {
    // Load generated image using custom hook
    const generatedImageLoader = useImageLoader()
    
    // Load generated image when it changes
    useEffect(() => {
      generatedImageLoader.loadImage(generatedImage || null)
    }, [generatedImage]) // eslint-disable-line react-hooks/exhaustive-deps

    // Use generated image as base if available, otherwise use base image
    const displayImageObj = generatedImageLoader.imageObj || baseImageObj

    return (
      <div className="relative">
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          onClick={onStageClick}
          ref={stageRef}
        >
          <Layer>
            {/* Base Image (either original base or generated image) */}
            {displayImageObj && (
              <KonvaImage
                image={displayImageObj}
                width={stageSize.width}
                height={stageSize.height}
              />
            )}
            
            {/* Tattoo Image */}
            {tattooImageObj && (
              <KonvaImage
                ref={tattooRef}
                image={tattooImageObj}
                x={stageSize.width / 2}
                y={stageSize.height / 2}
                offsetX={tattooImageObj.width / 2}
                offsetY={tattooImageObj.height / 2}
                scaleX={tattooScale}
                scaleY={tattooScale}
                draggable
                name="tattoo"
                onClick={onTattooSelect}
                onTap={onTattooSelect}
              />
            )}

            {/* Transformer for tattoo */}
            {selectedId === "tattoo" && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  if (newBox.width < 20 || newBox.height < 20) {
                    return oldBox
                  }
                  return newBox
                }}
                enabledAnchors={[
                  'top-left',
                  'top-right', 
                  'bottom-left',
                  'bottom-right'
                ]}
                rotateAnchorOffset={30}
              />
            )}
          </Layer>
        </Stage>
        
        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
              <p className="text-sm font-medium text-gray-700">Generating tattoo...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>
    )
  }
)

KonvaStage.displayName = "KonvaStage"