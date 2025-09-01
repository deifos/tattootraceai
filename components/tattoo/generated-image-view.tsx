"use client"

import Image from "next/image"
import { Button } from "@heroui/button"

interface GeneratedImageViewProps {
  generatedImage: string
  onBackToEditor: () => void
  maxWidth?: number
  maxHeight?: number
}

export function GeneratedImageView({ generatedImage, onBackToEditor, maxWidth, maxHeight }: GeneratedImageViewProps) {
  const containerStyle = {
    maxWidth: maxWidth ? `${maxWidth}px` : '100%',
    maxHeight: maxHeight ? `${maxHeight}px` : '100%',
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div style={containerStyle} className="relative">
        <Image
          src={generatedImage}
          alt="Generated tattoo result"
          width={maxWidth || 800}
          height={maxHeight || 600}
          className="max-w-full max-h-full object-contain rounded"
          unoptimized
          priority
        />
        <Button
          size="sm"
          className="absolute top-2 right-2"
          onPress={onBackToEditor}
          title="Back to editor"
        >
          Edit
        </Button>
      </div>
    </div>
  )
}