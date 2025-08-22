"use client"

import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import {Textarea} from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs"
import { Wand2, Crown, Skull, Heart, Star, Palette, Type, Brush, Upload, X, Loader2 } from "lucide-react"
import { useFileReader } from "@/hooks/useFileReader"
import { useCreditsStore } from "@/lib/credits-store"
import { FalAIService } from "@/services/fal-ai"

const tattooStyles = [
  { 
    name: "Traditional", 
    icon: Crown, 
    color: "bg-red-500",
    promptSuffix: "traditional American tattoo style, bold black outlines, solid colors, classic imagery, old school tattoo"
  },
  { 
    name: "Realism", 
    icon: Palette, 
    color: "bg-blue-500",
    promptSuffix: "photorealistic tattoo style, highly detailed, lifelike shading, realistic proportions, fine line work"
  },
  { 
    name: "Tribal", 
    icon: Skull, 
    color: "bg-gray-800",
    promptSuffix: "tribal tattoo style, bold black geometric patterns, flowing curves, traditional Polynesian/Celtic inspired"
  },
  { 
    name: "Calligraphy", 
    icon: Type, 
    color: "bg-purple-500",
    promptSuffix: "calligraphy tattoo style, elegant lettering, flowing script, beautiful typography, decorative flourishes"
  },
  { 
    name: "Graffiti", 
    icon: Brush, 
    color: "bg-orange-500",
    promptSuffix: "graffiti tattoo style, street art inspired, bold lettering, urban aesthetic, spray paint effect"
  },
  { 
    name: "Minimalist", 
    icon: Heart, 
    color: "bg-pink-500",
    promptSuffix: "minimalist tattoo style, simple clean lines, elegant simplicity, fine line work, subtle design"
  },
  { 
    name: "Geometric", 
    icon: Star, 
    color: "bg-green-500",
    promptSuffix: "geometric tattoo style, precise angular shapes, mathematical patterns, symmetrical design, clean lines"
  },
  { 
    name: "Watercolor", 
    icon: Palette, 
    color: "bg-cyan-500",
    promptSuffix: "watercolor tattoo style, soft flowing colors, paint splash effects, artistic brushstrokes, vibrant hues"
  },
]

interface TattooGeneratorProps {
  tattooImage: string | null
  onTattooImageChange: (dataUrl: string, file: File) => void
  onTattooImageRemove?: () => void
  onError?: (error: string) => void
  disabled?: boolean
}

export function TattooGenerator({ 
  tattooImage, 
  onTattooImageChange, 
  onTattooImageRemove,
  onError,
  disabled = false 
}: TattooGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTab, setSelectedTab] = useState("upload")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { dataUrl, file, error, isLoading, readFile, reset } = useFileReader()
  const { decrementCredits } = useCreditsStore()

  // Memoize tattoo styles to prevent recreation
  const memoizedTattooStyles = useMemo(() => tattooStyles, [])

  // Handle file upload success
  useEffect(() => {
    if (dataUrl && file) {
      onTattooImageChange(dataUrl, file)
      reset()
    }
  }, [dataUrl, file, onTattooImageChange, reset])

  // Handle file upload errors
  useEffect(() => {
    if (error) {
      onError?.(error)
      reset()
    }
  }, [error, onError, reset])

  const handleFileInputClick = useCallback(() => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click()
    }
  }, [disabled, isLoading])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && !disabled) {
      readFile(file)
    }
    e.target.value = '' // Reset input
  }, [readFile, disabled])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled || isLoading) return
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files[0]
    if (imageFile) {
      readFile(imageFile)
    }
  }, [readFile, disabled, isLoading])

  const handleRemove = useCallback(() => {
    onTattooImageRemove?.()
  }, [onTattooImageRemove])

  const generateTattooDesign = useCallback(async () => {
    if (!prompt.trim() || disabled || isGenerating) {
      if (!prompt.trim()) {
        onError?.("Please describe your tattoo design")
      }
      return
    }

    setIsGenerating(true)
    try {
      // Find the selected style object to get the prompt suffix
      const selectedStyleObj = selectedStyle ? 
        memoizedTattooStyles.find(style => style.name === selectedStyle) : 
        null

      // Generate tattoo design using FAL AI
      const response = await FalAIService.generateTattooDesign({
        prompt: prompt.trim(),
        style: selectedStyle || undefined,
        stylePromptSuffix: selectedStyleObj?.promptSuffix,
        image_size: "square",
        num_inference_steps: 30,
        guidance_scale: 2.5,
        enable_safety_checker: true,
        output_format: "png"
      })

      if (response.images && response.images.length > 0) {
        const generatedImageUrl = response.images[0].url
        
        // Record generation and deduct credits
        try {
          const recordResponse = await fetch('/api/record-generation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl: generatedImageUrl,
              baseImageUrl: undefined, // No base image for tattoo design
              tattooImageUrl: undefined, // This IS the generated tattoo
              bodyPart: undefined, // No body part for tattoo design
              prompt: prompt.trim(),
            }),
          })

          if (recordResponse.ok) {
            // Update local credit state for immediate UI feedback
            decrementCredits(1)
          } else {
            const errorData = await recordResponse.json()
            console.error('Failed to record tattoo design generation:', errorData.error)
            // Still proceed with showing the image even if recording fails
          }
        } catch (creditError) {
          console.error('Credit recording failed:', creditError)
          // Still proceed with showing the image even if recording fails
        }
        
        // Convert the generated image URL to a File object
        const imageFile = await FalAIService.convertUrlToFile(generatedImageUrl, 'generated-tattoo.png')
        
        // Call the parent handler with the image URL and file
        onTattooImageChange(generatedImageUrl, imageFile)
      } else {
        throw new Error('No images returned from AI generation')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate tattoo design. Please try again."
      onError?.(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, selectedStyle, disabled, isGenerating, onTattooImageChange, onError, memoizedTattooStyles, decrementCredits])

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Tattoo Design</h3>
      <Tabs aria-label="Tattoo options" selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
        <Tab key="upload" title="Upload">
          <Card>
            <CardBody>
              <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors min-h-[200px] flex items-center justify-center ${
                disabled || isLoading
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 cursor-pointer hover:border-primary'
              }`}
              onClick={handleFileInputClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
                  <p className="text-sm text-gray-500">Processing image...</p>
                </div>
              ) : tattooImage ? (
                <div className="relative group">
                  <Image
                    src={tattooImage}
                    alt="Tattoo design"
                    width={400}
                    height={192}
                    className="w-full h-48 object-contain bg-gray-50 rounded hover:opacity-90 transition-opacity"
                    unoptimized
                  />
                  {onTattooImageRemove && !disabled && (
                    <Button
                      color="danger"
                      variant="solid"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity min-w-6"
                      onPress={handleRemove}
                      title="Remove tattoo image"
                      isIconOnly
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
                  <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click or drag to upload tattoo stencil or design
                  </p>
                  {!disabled && (
                    <p className="text-xs text-gray-500 mt-1">
                      Max 10MB • JPG, PNG, GIF, WebP
                    </p>
                  )}
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || isLoading}
            />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="generate" title="Generate">
          <Card shadow="sm">
            <CardBody className="space-y-4">
            <div>
              <Textarea
                id="prompt"
                label="Describe your tattoo"
                placeholder="e.g., A fierce dragon with intricate scales, breathing fire..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={disabled || isGenerating}
                // variant="bordered"
                minRows={3}
                maxRows={6}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tattoo Styles</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {memoizedTattooStyles.map((style) => {
                  const Icon = style.icon
                  return (
                    <Button
                      key={style.name}
                      variant={selectedStyle === style.name ? "solid" : "bordered"}
                      size="sm"
                      onPress={() => setSelectedStyle(style.name)}
                      className="justify-start"
                      disabled={disabled || isGenerating}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {style.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            <Button onPress={generateTattooDesign} disabled={!prompt.trim() || isGenerating || disabled} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  )
}