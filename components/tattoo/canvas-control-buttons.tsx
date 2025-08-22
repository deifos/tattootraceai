"use client"

import { Button } from "@heroui/button"
import { Zap, RotateCcw, Download, Loader2 } from "lucide-react"
import { DownloadButton } from "@/components/ui/download-button"

interface CanvasControlButtonsProps {
  baseImage: string | null
  tattooImage: string | null
  generatedImage: string | null
  isApplying: boolean
  isGenerating: boolean
  onApplyTattoo: () => void
  onReset: () => void
  onExportCanvas: () => void
}

export function CanvasControlButtons({
  baseImage,
  tattooImage,
  generatedImage,
  isApplying,
  isGenerating,
  onApplyTattoo,
  onReset,
  onExportCanvas,
}: CanvasControlButtonsProps) {
  return (
    <div className="flex gap-2">
      {(baseImage || generatedImage) && tattooImage && (
        <Button onPress={onApplyTattoo} disabled={isApplying || isGenerating}>
          {isApplying || isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      )}
      <Button variant="bordered" size="sm" onPress={onReset}>
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      <Button variant="bordered" size="sm" onPress={onExportCanvas}>
        <Download className="w-4 h-4 mr-2" />
        Export Canvas
      </Button>
      {generatedImage && (
        <DownloadButton
          src={generatedImage}
          filename="generated-tattoo-result.png"
          variant="solid"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Result
        </DownloadButton>
      )}
    </div>
  )
}