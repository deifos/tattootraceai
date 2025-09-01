import { createFalClient } from "@fal-ai/client"

const fal = createFalClient({
  credentials: () => process.env.FAL_KEY as string,
  proxyUrl: "/api/fal/proxy",
})

// Create a client for credit-requiring operations with custom headers
const falWithCredits = createFalClient({
  credentials: () => process.env.FAL_KEY as string,
  proxyUrl: "/api/fal/proxy",
  fetch: (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-requires-credits': 'true'
      }
    });
  }
})

interface FalAIRequest {
  imageUrl: string
  prompt: string
  loraUrl?: string
  seed?: number
  num_inference_steps?: number
  guidance_scale?: number
  num_images?: number
  enable_safety_checker?: boolean
  resolution_mode?: "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21" | "auto" | "match_input" | "4:5" | "5:4"
}

interface TattooDesignRequest {
  prompt: string
  style?: string
  stylePromptSuffix?: string
  aspect_ratio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9" | "9:21" | "3:2" | "2:3"
  guidance_scale?: number
  num_images?: number
  output_format?: "png" | "jpeg"
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6"
  seed?: number
}

interface FalAIResponse {
  images: Array<{
    url: string
    width?: number
    height?: number
  }>
  seed?: number
  requestId: string
}

const TATTOO_LORA_URL = 'https://huggingface.co/ilkerzgi/Tattoo-Kontext-Dev-Lora/resolve/main/tattoo-kontext-dev-lora-ilkerigz.safetensors'

export class FalAIService {
  static async generateTattooDesign(request: TattooDesignRequest): Promise<FalAIResponse> {
    try {
      // Use the detailed style prompt suffix if available, otherwise fall back to simple style name
      const stylePrompt = request.stylePromptSuffix ? 
        `, ${request.stylePromptSuffix}` : 
        (request.style ? ` in ${request.style.toLowerCase()} style` : '')
      
      const fullPrompt = `${request.prompt}${stylePrompt}, tattoo design, black ink on white background, high quality, detailed`

      const result = await falWithCredits.subscribe("fal-ai/flux-pro/kontext/text-to-image", {
        input: {
          prompt: fullPrompt,
          guidance_scale: request.guidance_scale || 3.5,
          num_images: request.num_images || 1,
          output_format: request.output_format || "jpeg",
          safety_tolerance: request.safety_tolerance || "2",
          aspect_ratio: request.aspect_ratio || "1:1",
          seed: request.seed,
        },
        logs: false,
        onQueueUpdate: (update) => {
          // if (update.status === "IN_PROGRESS") {
          //   update.logs.map((log) => log.message).forEach(console.log);
          // }
        },
      })

      const images = result.data?.images || (result as any).images || []
      if (!images?.[0]) {
        throw new Error("No image generated")
      }

      return {
        images,
        seed: result.data?.seed || (result as any).seed,
        requestId: result.requestId || ''
      }
    } catch (error) {
      console.error('FAL AI Design Generation Error:', error)
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to generate tattoo design. Please try again.'
      )
    }
  }

  static async generateTattoo(request: FalAIRequest): Promise<FalAIResponse> {
    try {
      const loras = request.loraUrl ? [{ path: request.loraUrl, scale: 1 }] : [{ path: TATTOO_LORA_URL, scale: 1 }]
      // console.log(request)
      
      const result = await falWithCredits.subscribe("fal-ai/flux-kontext-lora", {
        input: {
          image_url: request.imageUrl,
          prompt: `place this tattoo, ${request.prompt}`,
          loras,
          num_inference_steps: request.num_inference_steps || 30,
          guidance_scale: request.guidance_scale || 3.5,
          num_images: request.num_images || 1,
          enable_safety_checker: false,
          resolution_mode: request.resolution_mode || "match_input",
          seed: request.seed,

        },
        logs: false,
        onQueueUpdate: (update) => {
          // if (update.status === "IN_PROGRESS") {
          //   update.logs.map((log) => log.message).forEach(console.log);
          // }
        },
      })

      // Handle different possible response structures
      const images = result.data?.images || (result as any).images || []
      if (!images?.[0]) {
        throw new Error("No image generated")
      }

      return {
        images,
        seed: result.data?.seed || (result as any).seed,
        requestId: result.requestId || ''
      }
    } catch (error) {
      console.error('FAL AI API Error:', error)
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to generate tattoo. Please try again.'
      )
    }
  }

  static async convertUrlToFile(imageUrl: string, filename: string = 'generated-tattoo.png'): Promise<File> {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`)
      }
      
      const blob = await response.blob()
      return new File([blob], filename, { type: blob.type || 'image/png' })
    } catch (error) {
      console.error('Error converting URL to file:', error)
      throw new Error('Failed to convert generated image to file')
    }
  }

  static async uploadImageAsDataUrl(dataUrl: string): Promise<string> {
    // console.log('uploadImageAsDataUrl called with:', { 
    //   hasDataUrl: !!dataUrl, 
    //   length: dataUrl?.length,
    //   startsWithData: dataUrl?.startsWith('data:')
    // })

    // Validate input
    if (!dataUrl || !dataUrl.startsWith('data:')) {
      console.error('Invalid data URL provided:', { dataUrl: dataUrl?.substring(0, 50) })
      throw new Error('Invalid data URL provided')
    }

    // Convert data URL to blob and upload to FAL storage
    try {
      const response = await fetch(dataUrl)
      
      const blob = await response.blob()
      
      // Upload to FAL storage
      const uploadResult = await fal.storage.upload(blob)
      
      // Handle both string and object responses
      let imageUrl: string
      if (typeof uploadResult === 'string') {
        imageUrl = uploadResult
      } else if (uploadResult && typeof uploadResult === 'object' && 'url' in uploadResult) {
        imageUrl = (uploadResult as { url: string }).url
      } else {
        console.error('Upload result is invalid:', uploadResult)
        throw new Error('Upload failed - no URL returned')
      }
      
      if (!imageUrl) {
        throw new Error('Upload failed - empty URL returned')
      }
      
      return imageUrl
    } catch (error) {
      console.error('Image upload error:', error)
      // Fallback to data URL if upload fails
      // console.log('Falling back to data URL:', dataUrl.substring(0, 50) + '...')
      return dataUrl
    }
  }
}