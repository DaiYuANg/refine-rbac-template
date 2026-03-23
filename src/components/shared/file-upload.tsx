'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, FileIcon, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { computeFileMd5 } from '@/utils/file-md5'

const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

export interface FileWithMd5 {
  file: File
  md5: string | null
  preview?: string
  error?: string
}

export interface FileUploadProps {
  /** Single or multiple files */
  multiple?: boolean
  /** Accepted MIME types or extensions, e.g. "image/*" or ".pdf,.doc" */
  accept?: string
  /** Max file size in bytes */
  maxSize?: number
  /** Current value (controlled) */
  value?: FileWithMd5[]
  /** Called when files change. Supports functional updater for async MD5. */
  onChange?: (
    filesOrUpdater: FileWithMd5[] | ((prev: FileWithMd5[]) => FileWithMd5[])
  ) => void
  disabled?: boolean
  className?: string
  /** Placeholder text in drop zone */
  placeholder?: string
}

const isImageType = (type: string): boolean =>
  IMAGE_TYPES.includes(type) || type.startsWith('image/')

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const FileUpload = ({
  multiple = false,
  accept,
  maxSize,
  value = [],
  onChange,
  disabled = false,
  className,
  placeholder,
}: FileUploadProps) => {
  const { t } = useTranslation()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [computingIds, setComputingIds] = React.useState<Set<string>>(new Set())

  const files = value

  const processFiles = React.useCallback(
    (newFiles: FileList | File[]) => {
      const list = Array.from(newFiles)
      const existing = multiple ? [...files] : []
      const toAdd: FileWithMd5[] = []

      for (const file of list) {
        if (maxSize && file.size > maxSize) {
          toAdd.push({
            file,
            md5: null,
            error: t('fileUpload.sizeLimitExceeded', {
              size: formatFileSize(maxSize),
            }),
          })
          continue
        }

        const preview = isImageType(file.type)
          ? URL.createObjectURL(file)
          : undefined

        toAdd.push({
          file,
          md5: null,
          preview,
        })
      }

      const merged = multiple ? [...existing, ...toAdd] : toAdd
      onChange?.(merged)

      toAdd.forEach((entry) => {
        if (entry.error) return
        const { file } = entry
        const fileKey = `${file.name}_${file.size}_${file.lastModified}`

        setComputingIds((prev) => new Set(prev).add(fileKey))
        computeFileMd5(file)
          .then((md5) => {
            onChange?.((prevFiles) =>
              prevFiles.map((f) => (f.file === file ? { ...f, md5 } : f))
            )
          })
          .catch(() => {
            onChange?.((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file
                  ? { ...f, md5: null, error: t('fileUpload.md5Error') }
                  : f
              )
            )
          })
          .finally(() => {
            setComputingIds((prev) => {
              const next = new Set(prev)
              next.delete(fileKey)
              return next
            })
          })
      })
    },
    [files, multiple, maxSize, onChange, t]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (selected?.length) {
      processFiles(selected)
    }
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const dropped = e.dataTransfer.files
    if (dropped.length) {
      processFiles(multiple ? dropped : [dropped[0]!])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    const entry = files[index]
    if (entry?.preview) URL.revokeObjectURL(entry.preview)
    const next = files.filter((_, i) => i !== index)
    onChange?.(next)
  }

  const filesRef = React.useRef<FileWithMd5[]>([])
  React.useEffect(() => {
    filesRef.current = files
  }, [files])
  React.useEffect(
    () => () => {
      filesRef.current.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview)
      })
    },
    []
  )

  const defaultPlaceholder = multiple
    ? t('fileUpload.placeholderMultiple')
    : t('fileUpload.placeholder')

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
      />

      <Card
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'cursor-pointer border-2 border-dashed transition-colors',
          isDragging && 'border-primary bg-primary/5',
          !isDragging &&
            'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <CardContent className="flex flex-col items-center justify-center gap-2 py-8">
          <Upload className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {placeholder ?? defaultPlaceholder}
          </p>
          {maxSize && (
            <p className="text-xs text-muted-foreground">
              {t('fileUpload.maxSize', { size: formatFileSize(maxSize) })}
            </p>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-2 space-y-2">
            {files.map((entry, index) => {
              const isComputing = computingIds.has(
                entry.file.name + entry.file.size
              )
              return (
                <div
                  key={`${entry.file.name}-${entry.file.size}-${index}`}
                  className="flex items-center gap-3 rounded-lg border bg-card p-2"
                >
                  <div className="size-12 shrink-0 overflow-hidden rounded bg-muted">
                    {entry.preview ? (
                      <img
                        src={entry.preview}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <FileIcon className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {entry.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(entry.file.size)}
                      {isComputing && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Loader2 className="inline size-3 animate-spin" />
                          MD5...
                        </span>
                      )}
                      {!isComputing && entry.md5 && (
                        <span className="ml-2 font-mono text-[10px]">
                          {entry.md5}
                        </span>
                      )}
                      {entry.error && (
                        <span className="ml-2 text-destructive">
                          {entry.error}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    aria-label={t('fileUpload.remove')}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

FileUpload.displayName = 'FileUpload'
