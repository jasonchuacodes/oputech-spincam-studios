import { useRef, useState, type DragEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import {
  isSupportedImageType,
  MAX_IMAGE_SOURCE_SIZE_BYTES,
  optimizeImage,
} from '../../utils/image'

interface ImageDropzoneProps {
  value?: string
  onChange: (value: string) => void
  onError?: (message: string) => void
  disabled?: boolean
  maxSizeBytes?: number
  className?: string
}

export const ImageDropzone = ({
  value,
  onChange,
  onError,
  disabled,
  maxSizeBytes = MAX_IMAGE_SOURCE_SIZE_BYTES,
  className,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return

    if (!isSupportedImageType(file.type)) {
      onError?.('Please upload a JPEG, PNG, or WebP image')
      return
    }

    if (file.size > maxSizeBytes) {
      onError?.(
        `Image must be smaller than ${Math.round(maxSizeBytes / (1024 * 1024))}MB`
      )
      return
    }

    setProcessing(true)
    try {
      onChange(await optimizeImage(file))
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Could not optimize image')
    } finally {
      setProcessing(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    if (disabled || processing) return
    void handleFile(e.dataTransfer.files[0])
  }

  const handleRemove = () => {
    onChange('')
  }

  if (value) {
    return (
      <div className={cn('relative inline-flex', className)}>
        <img
          src={value}
          alt="Product preview"
          className="border-border h-24 w-24 rounded-md border object-cover"
        />
        {!disabled && !processing && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="bg-foreground text-background absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        'border-border text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 select-none',
        disabled || processing
          ? 'cursor-not-allowed opacity-50'
          : 'hover:border-brand hover:text-foreground cursor-pointer',
        className
      )}
    >
      <ImagePlus size={24} />
      <p className="text-sm">
        {processing ? 'Optimizing image…' : 'Drag & drop or click to upload'}
      </p>
      {!processing && <p className="text-xs">Automatically resized for fast sync</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={disabled || processing}
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </label>
  )
}
