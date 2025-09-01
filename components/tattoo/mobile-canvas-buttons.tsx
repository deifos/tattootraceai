"use client";

import { Button } from "@heroui/button";
import { Upload, Palette, Zap, RotateCcw, Loader2, Download } from "lucide-react";
import { DownloadButton } from "@/components/ui/download-button";

interface MobileCanvasButtonsProps {
  baseImage: string | null;
  tattooImage: string | null;
  generatedImage: string | null;
  isApplying: boolean;
  isGenerating: boolean;
  onUploadDrawerOpen?: () => void;
  onTattooDrawerOpen?: () => void;
  onApplyTattoo: () => void;
  onReset: () => void;
}

// Split into separate components for above and below canvas positioning
export function MobileUploadButtons({
  isApplying,
  onUploadDrawerOpen,
  onTattooDrawerOpen,
}: {
  isApplying: boolean;
  onUploadDrawerOpen?: () => void;
  onTattooDrawerOpen?: () => void;
}) {
  if (!onUploadDrawerOpen || !onTattooDrawerOpen) {
    return null;
  }

  return (
    <div className="lg:hidden flex gap-2 mb-4">
      <Button
        color="primary"
        variant="shadow"
        startContent={<Upload className="w-4 h-4" />}
        className="flex-1"
        onPress={onUploadDrawerOpen}
        disabled={isApplying}
        size="sm"
      >
        Upload Body
      </Button>
      <Button
        color="secondary"
        variant="shadow"
        startContent={<Palette className="w-4 h-4" />}
        className="flex-1"
        onPress={onTattooDrawerOpen}
        disabled={isApplying}
        size="sm"
      >
        Upload/Gen. Tattoo
      </Button>
    </div>
  );
}

export function MobileControlButtons({
  baseImage,
  tattooImage,
  generatedImage,
  isApplying,
  isGenerating,
  onApplyTattoo,
  onReset,
}: {
  baseImage: string | null;
  tattooImage: string | null;
  generatedImage: string | null;
  isApplying: boolean;
  isGenerating: boolean;
  onApplyTattoo: () => void;
  onReset: () => void;
}) {
  // Show buttons only when there's something meaningful to control
  if (!((baseImage || generatedImage) && tattooImage) && !generatedImage) {
    return null;
  }

  return (
    <div className="lg:hidden flex gap-2 mt-2">
      {/* Generate button - only show when both base and tattoo exist */}
      {(baseImage || generatedImage) && tattooImage && (
        <Button
          onPress={onApplyTattoo}
          disabled={isApplying || isGenerating}
          className="flex-1"
          color="primary"
          variant="shadow"
          size="sm"
        >
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
      
      {/* Reset button - show when there's a tattoo to reset OR when there's a generated image */}
      {((baseImage || generatedImage) && tattooImage) || generatedImage ? (
        <Button
          variant="shadow"
          onPress={onReset}
          className="flex-1"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      ) : null}
      
      {generatedImage && (
        <DownloadButton
          src={generatedImage}
          filename="generated-tattoo-result.png"
          variant="solid"
          size="sm"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </DownloadButton>
      )}
    </div>
  );
}

// Keep original component for backward compatibility
export function MobileCanvasButtons({
  baseImage,
  tattooImage,
  generatedImage,
  isApplying,
  isGenerating,
  onApplyTattoo,
  onReset,
}: Omit<MobileCanvasButtonsProps, 'onUploadDrawerOpen' | 'onTattooDrawerOpen'>) {
  return (
    <MobileControlButtons
      baseImage={baseImage}
      tattooImage={tattooImage}
      generatedImage={generatedImage}
      isApplying={isApplying}
      isGenerating={isGenerating}
      onApplyTattoo={onApplyTattoo}
      onReset={onReset}
    />
  );
}