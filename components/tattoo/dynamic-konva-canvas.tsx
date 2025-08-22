"use client"

import dynamic from "next/dynamic"
import {Button, } from "@heroui/button";
import { RotateCcw, Download, Loader2 } from "lucide-react"
import { Card, CardBody, CardHeader } from "@heroui/card";

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

// Dynamically import the Konva component with no SSR
const KonvaCanvas = dynamic(
  () => import("./konva-preview-canvas").then((mod) => ({ default: mod.KonvaPreviewCanvas })),
  { 
    ssr: false,
    loading: () => (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span>Preview Canvas</span>
            <div className="flex gap-2">
              <Button size="sm" disabled>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button  size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center w-full bg-gray-100 rounded-lg" style={{ minHeight: '500px' }}>
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-gray-500">Loading canvas...</p>
            </div>
          </div>
        </CardBody>
      </Card>
    )
  }
)

export function DynamicKonvaCanvas(props: KonvaPreviewCanvasProps) {
  return <KonvaCanvas {...props} />
}