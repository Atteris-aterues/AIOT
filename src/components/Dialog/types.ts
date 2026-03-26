// src/components/Dialog/types.ts
import type { UploadedFile } from '@/components/ui/vanishing-input/FileUploader/types'

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  files?: UploadedFile[]
  timestamp: number
  isThinking?: boolean
  edited?: boolean  
  editTime?: number 
  displayContent?: string 
}

export interface DialogProps {
  initialMessages?: Message[]
  placeholder?: string
}