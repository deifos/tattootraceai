"use client"

import { Slider } from "@heroui/slider"

interface TattooControlsProps {
  tattooSize: number[]
  tattooRotation: number[]
  onSizeChange: (value: number[]) => void
  onRotationChange: (value: number[]) => void
}

export function TattooControls({
  tattooSize,
  tattooRotation,
  onSizeChange,
  onRotationChange,
}: TattooControlsProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium">Size: {tattooSize[0]}%</div>
          <Slider
            value={tattooSize}
            onChange={(value) => onSizeChange(Array.isArray(value) ? value : [value])}
            maxValue={200}
            minValue={10}
            step={5}
            className="mt-2"
          />
        </div>
        <div>
          <span className="text-sm font-medium">Rotation: {tattooRotation[0]}°</span>
          <Slider
            value={tattooRotation}
            onChange={(value) => onRotationChange(Array.isArray(value) ? value : [value])}
            maxValue={360}
            minValue={0}
            step={5}
            className="mt-2"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Drag the tattoo to reposition, use sliders to resize and rotate
      </p>
    </div>
  )
}