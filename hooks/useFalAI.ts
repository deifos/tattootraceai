import { useState, useCallback } from 'react'
import { FalAIService } from '@/services/fal-ai'
import { useCreditsStore } from '@/lib/credits-store'
import { addToast } from '@heroui/toast'

interface UseFalAIOptions {
  onSuccess?: (imageUrl: string) => void
  onError?: (error: string) => void
  userId?: string
  baseImageUrl?: string
  tattooImageUrl?: string
  bodyPart?: string
}

interface FalAIResult {
  imageUrl: string | null
  isGenerating: boolean
  error: string | null
  requestId: string | null
  seed: number | null
}

export function useFalAI(options: UseFalAIOptions = {}) {
  const { decrementCredits } = useCreditsStore()
  const [result, setResult] = useState<FalAIResult>({
    imageUrl: null,
    isGenerating: false,
    error: null,
    requestId: null,
    seed: null,
  })

  const generateTattoo = useCallback(async (
    compositeImageDataUrl: string,
    additionalPrompt: string = ''
  ) => {
    setResult(prev => ({ ...prev, isGenerating: true, error: null }))

    try {

      // Upload or prepare the composite image
      // console.log('Uploading composite image...')
      // console.log('Input data URL length:', compositeImageDataUrl?.length)
      // console.log('Input data URL starts with data:', compositeImageDataUrl?.startsWith('data:'))
      
      const imageUrl = await FalAIService.uploadImageAsDataUrl(compositeImageDataUrl)
      // console.log('Uploaded image URL:', imageUrl)
      
      if (!imageUrl) {
        throw new Error('Upload returned undefined/null image URL')
      }

      // Generate the tattoo (proxy will check credits server-side)
      const response = await FalAIService.generateTattoo({
        imageUrl: imageUrl,
        prompt: additionalPrompt,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      })

      if (response.images && response.images.length > 0) {
        const generatedImageUrl = response.images[0].url
        
        // Record generation and deduct credits via API if user is authenticated
        if (options.userId) {
          try {
            const recordResponse = await fetch('/api/record-generation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl: generatedImageUrl,
                baseImageUrl: options.baseImageUrl,
                tattooImageUrl: options.tattooImageUrl,
                bodyPart: options.bodyPart,
                prompt: additionalPrompt,
              }),
            })

            if (recordResponse.ok) {
              // Update local credit state
              decrementCredits(1)
              addToast({
                title: "Tattoo Generated!",
                description: "Your tattoo has been successfully applied and saved to your gallery.",
                color: "success",
              })
            } else {
              const errorData = await recordResponse.json()
              console.error('Failed to record generation:', errorData.error)
              // Don't show another toast since we already generated successfully
              // Just log the error - the generation itself was successful
            }
          } catch (creditError) {
            console.error('Generation recording failed:', creditError)
            // Still allow the generation to complete, but log the error
          }
        }
        
        setResult({
          imageUrl: generatedImageUrl,
          isGenerating: false,
          error: null,
          requestId: response.requestId,
          seed: response.seed || null,
        })

        options.onSuccess?.(generatedImageUrl)
      } else {
        throw new Error('No images returned from FAL AI')
      }
    } catch (error) {
      let errorMessage = 'Failed to generate tattoo'
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Handle insufficient credits error from proxy
        if (error.message.includes('Insufficient credits')) {
          addToast({
            title: "Insufficient Credits",
            description: "Please purchase more credits to continue generating tattoos.",
            color: "danger",
          })
        } else {
          // Show generic error toast for other failures
          addToast({
            title: "Generation Failed",
            description: errorMessage,
            color: "danger",
          })
        }
      }
      
      setResult({
        imageUrl: null,
        isGenerating: false,
        error: errorMessage,
        requestId: null,
        seed: null,
      })

      options.onError?.(errorMessage)
    }
  }, [options])

  const reset = useCallback(() => {
    setResult({
      imageUrl: null,
      isGenerating: false,
      error: null,
      requestId: null,
      seed: null,
    })
  }, [])

  return {
    ...result,
    generateTattoo,
    reset,
  }
}