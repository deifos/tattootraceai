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
  tattooTransform?: {
    x: number
    y: number
    scaleX: number
    scaleY: number
    rotation: number
  }
  selectedId: string | null
  isGenerating: boolean
  onStageClick: (e: Konva.KonvaEventObject<MouseEvent>) => void
  onTattooSelect: () => void
  onTattooDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void
  onTattooDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void
  onTransformEnd?: (transform: { x: number; y: number; scaleX: number; scaleY: number; rotation: number }) => void
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
    tattooTransform,
    selectedId,
    isGenerating,
    onStageClick,
    onTattooSelect,
    onTattooDragMove,
    onTattooDragEnd,
    onTransformEnd,
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
          onTap={onStageClick}
          ref={stageRef}
        >
          <Layer>
            {/* Base Image (either original base or generated image) */}
            {displayImageObj && (() => {
              // Calculate dimensions to maintain aspect ratio
              const imgAspectRatio = displayImageObj.width / displayImageObj.height;
              const stageAspectRatio = stageSize.width / stageSize.height;
              
              let renderWidth = stageSize.width;
              let renderHeight = stageSize.height;
              let offsetX = 0;
              let offsetY = 0;
              
              if (imgAspectRatio > stageAspectRatio) {
                // Image is wider than stage
                renderHeight = stageSize.width / imgAspectRatio;
                offsetY = (stageSize.height - renderHeight) / 2;
              } else {
                // Image is taller than stage
                renderWidth = stageSize.height * imgAspectRatio;
                offsetX = (stageSize.width - renderWidth) / 2;
              }
              
              return (
                <KonvaImage
                  image={displayImageObj}
                  x={offsetX}
                  y={offsetY}
                  width={renderWidth}
                  height={renderHeight}
                  listening={false}
                  imageSmoothingEnabled={true}
                  imageSmoothingQuality="high"
                />
              );
            })()}
            
            {/* Tattoo Image with enhanced mobile touch handling */}
            {tattooImageObj && (
              <KonvaImage
                ref={tattooRef}
                image={tattooImageObj}
                x={tattooTransform?.x || stageSize.width / 2}
                y={tattooTransform?.y || stageSize.height / 2}
                offsetX={tattooImageObj.width / 2}
                offsetY={tattooImageObj.height / 2}
                scaleX={tattooTransform?.scaleX || tattooScale}
                scaleY={tattooTransform?.scaleY || tattooScale}
                rotation={tattooTransform?.rotation || 0}
                draggable
                name="tattoo"
                onClick={onTattooSelect}
                onTap={onTattooSelect}
                onDblClick={onTattooSelect}
                onDblTap={onTattooSelect}
                onDragMove={onTattooDragMove}
                onDragEnd={onTattooDragEnd}
                onTransformEnd={(e) => {
                  const node = e.target as Konva.Image;
                  if (onTransformEnd && node) {
                    onTransformEnd({
                      x: node.x(),
                      y: node.y(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                      rotation: node.rotation(),
                    });
                  }
                }}
                onMouseDown={onTattooSelect}
                onTouchStart={onTattooSelect}
                onTouchEnd={onTattooSelect}
                listening={true}
                perfectDrawEnabled={false}
                preventDefault={false}
              />
            )}

            {/* Transformer for tattoo with enhanced mobile support */}
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
                anchorSize={20}
                anchorStroke="#4285f4"
                anchorFill="white"
                anchorStrokeWidth={3}
                anchorCornerRadius={2}
                borderStroke="#4285f4"
                borderStrokeWidth={2}
                rotateEnabled={true}
                rotationSnaps={[0, 90, 180, 270]}
                rotationSnapTolerance={10}
                keepRatio={true}
                centeredScaling={false}
                ignoreStroke={true}
                shouldOverdrawWholeArea={true}
                listening={true}
                flipEnabled={false}
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