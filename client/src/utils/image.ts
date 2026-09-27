export const MAX_IMAGE_SOURCE_SIZE_BYTES = 5 * 1024 * 1024

const MAX_OUTPUT_SIZE_BYTES = 100 * 1024
const MAX_IMAGE_DIMENSION = 512
const MIN_IMAGE_DIMENSION = 128
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const WEBP_QUALITIES = [0.8, 0.65, 0.5, 0.35]

export const isSupportedImageType = (type: string) =>
  SUPPORTED_IMAGE_TYPES.includes(type)

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read image'))
    }
    image.src = objectUrl
  })

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Could not optimize image')),
      'image/webp',
      quality
    )
  })

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read optimized image'))
    reader.readAsDataURL(blob)
  })

export const optimizeImage = async (file: File): Promise<string> => {
  const image = await loadImage(file)
  const initialScale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight)
  )
  let width = Math.max(1, Math.round(image.naturalWidth * initialScale))
  let height = Math.max(1, Math.round(image.naturalHeight * initialScale))

  while (true) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not optimize image')
    context.drawImage(image, 0, 0, width, height)

    for (const quality of WEBP_QUALITIES) {
      const blob = await canvasToBlob(canvas, quality)
      if (blob.size <= MAX_OUTPUT_SIZE_BYTES) return blobToDataUrl(blob)
    }

    const largestDimension = Math.max(width, height)
    if (largestDimension <= MIN_IMAGE_DIMENSION) break
    const resizeScale = Math.max(0.75, MIN_IMAGE_DIMENSION / largestDimension)
    width = Math.round(width * resizeScale)
    height = Math.round(height * resizeScale)
  }

  throw new Error('Image could not be reduced below 100KB')
}
