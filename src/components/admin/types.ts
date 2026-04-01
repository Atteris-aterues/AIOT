// src/views/admin/types.ts
export interface DashboardData {
  chatMessages: number
  materials: number
  sensitiveWords: number
  generationTasks: number
  redisApproxKeyCount: number
  chatSessions: number
}

export interface SensitiveWord {
  id: string
  word: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}