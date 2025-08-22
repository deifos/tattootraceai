import { useCallback } from 'react'
import Konva from 'konva'

export interface CanvasComposition {
  dataUrl: string
  width: number
  height: number
}

export function useCanvasComposer() {
  const composeImages = useCallback(async (
    stageRef: React.RefObject<Konva.Stage>
  ): Promise<CanvasComposition> => {
    return new Promise((resolve, reject) => {
      if (!stageRef.current) {
        reject(new Error('Canvas stage not available'))
        return
      }

      try {
        const stage = stageRef.current
        const width = stage.width()
        const height = stage.height()

        // Hide transformer before export
        const transformer = stage.findOne('Transformer')
        const wasVisible = transformer?.visible()
        if (transformer) {
          transformer.visible(false)
        }

        // Generate the composite image
        const dataUrl = stage.toDataURL({
          mimeType: 'image/png',
          quality: 1.0,
          pixelRatio: 1,
        })

        // Restore transformer visibility
        if (transformer && wasVisible) {
          transformer.visible(true)
        }

        resolve({
          dataUrl,
          width,
          height,
        })
      } catch (error) {
        reject(new Error('Failed to compose canvas images'))
      }
    })
  }, [])

  return {
    composeImages,
  }
}