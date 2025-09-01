import { useCallback } from 'react'
import Konva from 'konva'

export interface CanvasComposition {
  dataUrl: string
  width: number
  height: number
}

export function useCanvasComposer() {
  const composeImages = useCallback(async (
    stageRef: React.RefObject<Konva.Stage>,
    baseImageObj?: HTMLImageElement | null
  ): Promise<CanvasComposition> => {
    return new Promise((resolve, reject) => {
      if (!stageRef.current) {
        reject(new Error('Canvas stage not available'))
        return
      }

      try {
        const stage = stageRef.current
        const currentWidth = stage.width()
        const currentHeight = stage.height()
        
        // Use original image dimensions if available
        let exportWidth = currentWidth
        let exportHeight = currentHeight
        let needsResize = false
        
        if (baseImageObj) {
          exportWidth = baseImageObj.width
          exportHeight = baseImageObj.height
          needsResize = true
        }

        // Hide transformer before export
        const transformer = stage.findOne('Transformer')
        const wasVisible = transformer?.visible()
        if (transformer) {
          transformer.visible(false)
        }
        
        let dataUrl: string
        
        if (needsResize && baseImageObj) {
          // Create a temporary offscreen stage at original dimensions
          const offscreenStage = new Konva.Stage({
            container: document.createElement('div'),
            width: exportWidth,
            height: exportHeight,
          })
          
          const offscreenLayer = new Konva.Layer()
          offscreenStage.add(offscreenLayer)
          
          // Add base image at full size
          const baseImage = new Konva.Image({
            image: baseImageObj,
            x: 0,
            y: 0,
            width: exportWidth,
            height: exportHeight,
          })
          offscreenLayer.add(baseImage)
          
          // Find and copy tattoo with scaled position
          const tattooNode = stage.findOne('.tattoo') || stage.findOne('Image[name="tattoo"]')
          if (tattooNode && tattooNode instanceof Konva.Image) {
            const scaleFactorX = exportWidth / currentWidth
            const scaleFactorY = exportHeight / currentHeight
            
            const tattooImage = new Konva.Image({
              image: tattooNode.image() as HTMLImageElement,
              x: tattooNode.x() * scaleFactorX,
              y: tattooNode.y() * scaleFactorY,
              offsetX: tattooNode.offsetX(),
              offsetY: tattooNode.offsetY(),
              scaleX: tattooNode.scaleX() * scaleFactorX,
              scaleY: tattooNode.scaleY() * scaleFactorY,
              rotation: tattooNode.rotation(),
            })
            offscreenLayer.add(tattooImage)
          }
          
          // Export at original resolution
          dataUrl = offscreenStage.toDataURL({
            mimeType: 'image/png',
            quality: 1.0,
            pixelRatio: 1, // Already at full resolution
          })
          
          // Clean up
          offscreenStage.destroy()
        } else {
          // Fall back to current stage export
          dataUrl = stage.toDataURL({
            mimeType: 'image/png',
            quality: 1.0,
            pixelRatio: 2,
          })
        }

        // Restore transformer visibility
        if (transformer && wasVisible) {
          transformer.visible(true)
        }

        resolve({
          dataUrl,
          width: exportWidth,
          height: exportHeight,
        })
      } catch (error) {
        reject(new Error('Failed to compose canvas images: ' + (error as Error).message))
      }
    })
  }, [])

  return {
    composeImages,
  }
}