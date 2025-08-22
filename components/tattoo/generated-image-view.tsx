"use client"

import Image from "next/image"
import { Button } from "@heroui/button"

interface GeneratedImageViewProps {
  generatedImage: string
  onBackToEditor: () => void
}

export function GeneratedImageView({ generatedImage, onBackToEditor }: GeneratedImageViewProps) {
  return (
    <div className="relative">
      <Image
        src={generatedImage}
        alt="Generated tattoo result"
        width={800}
        height={600}
        className="max-w-full max-h-full object-contain rounded"
        unoptimized
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
  )
}