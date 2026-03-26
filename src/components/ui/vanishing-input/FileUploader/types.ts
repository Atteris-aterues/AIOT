// FileUploader/types.ts
export interface UploadedFile {
  file: File
  name: string
  size: number
  type: string
  preview?: string
}