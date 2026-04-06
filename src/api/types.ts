export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface User {
  id: number;
  username: string;
  role: string;
  avatar: string | null;
  nickname?: string;
  createTime?: string;
  lastLoginAt?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse extends ApiResponse<{
  token: string;
  expiresIn: number;
  user: User;
}> {}

export interface RegisterParams {
  username: string;
  password: string;
  code?: string;
}

export interface RegisterResponse extends ApiResponse<{
  token: string;
  expiresIn: number;
}> {}

export interface UserInfoResponse extends ApiResponse<User> {}

// --- Chat & Session related types ---

export interface StopParams {
  sessionId: string;
}

export interface StopResponse extends ApiResponse<{
  stopAt: string;
  sessionId: string;
}> {}

export interface FeedbackParams {
  messageId: number;
  score: number;
  reason: string;
}

export interface FeedbackResponse extends ApiResponse<{
  currentScore: number;
  messageId: number;
}> {}

export interface HealthResponse extends ApiResponse<{
  backend: { status: string };
  database: { status: string };
  redis: { status: string };
  ai: {
    status: string;
    detail: {
      status: string;
      rag_ready: boolean;
      llm_ready: boolean;
    };
  };
  status: string;
}> {}

export interface SessionCreateParams {
  sceneType: number;
  firstPrompt: string;
}

export interface SessionCreateResponse extends ApiResponse<{
  sceneType: number;
  createTime: string;
  sessionId: string;
  title: string;
}> {}

export interface SessionDetailParams {
  sessionId: string;
}

export interface HistoryItem {
  role: 'user' | 'assistant' | 'system';
  messageId: number;
  content: string;
}

export interface SessionInfo {
  sceneType: number;
  createTime: string;
  sessionId: string;
  title: string;
  status: number;
  updateTime?: string;
  pinned?: boolean;
}

export interface SessionDetailResponse extends ApiResponse<{
  sessionInfo: SessionInfo;
  materials: string[];
  history: HistoryItem[];
  finalResult: any | null;
}> {}

export interface SessionListParams {
  keyword: string;
  page: number;
  size: number;
}

export interface SessionListResponse extends ApiResponse<{
  total: number;
  size: number;
  hasMore: boolean;
  page: number;
  items: SessionInfo[];
}> {}

export interface SessionRenameParams {
  sessionId: string;
  title: string;
}

export interface SessionRenameResponse extends ApiResponse<{
  sessionId: string;
  title: string;
}> {}

export interface MaterialRenameParams {
  fileId: number;
  fileName: string;
}

export interface MaterialRenameResponse extends ApiResponse<{
  fileName: string;
  fileId: number;
}> {}

export interface SessionPinParams {
  sessionId: string;
  pin: boolean;
}

export interface SessionPinResponse extends ApiResponse<{
  pinned: boolean;
  sessionId: string;
}> {}

export interface SessionPinReorderParams {
  orderedSessionIds: string[];
}

export interface SessionPinReorderResponse extends ApiResponse<{
  count: number;
  orderedSessionIds: string[];
}> {}

export interface MessageBatchDeleteParams {
  sessionId: string;
  messageIds: number[];
}

export interface MessageBatchDeleteResponse extends ApiResponse<{
  deletedCount: number;
  sessionId: string;
  remainingCount: number;
}> {}

export interface SessionDeleteParams {
  sessionId: string;
}

export interface SessionDeleteResponse extends ApiResponse<{
  deletedAt: string;
  sessionId: string;
}> {}

export interface SessionClearParams {
  sessionId: string;
}

export interface SessionClearResponse extends ApiResponse<{
  remainingMaterialsCount: number;
  clearedAt: string;
  sessionId: string;
}> {}

export interface MaterialUploadResponse extends ApiResponse<{
  fileName: string;
  previewUrl: string;
  fileId: number;
  status: string;
}> {}

export interface MaterialStatusParams {
  fileId: number;
}

export interface MaterialStatusResponse extends ApiResponse<{
  result: {
    summary: string | null;
    previewUrl: string;
    keywords: string | null;
  };
  progress: number;
  fileId: number;
  status: string;
}> {}

export interface MaterialDeleteParams {
  fileId: number;
  sessionId: string;
}

export interface MaterialDeleteResponse extends ApiResponse<{
  deletedAt: string;
  sessionId: string;
  fileId: number;
}> {}

export interface MessageSendParams {
  sessionId: string;
  content: string;
  fileIds: number[];
  sceneType: number;
  isResend: boolean;
}

export interface MessageSendResponse extends ApiResponse<{
  tokenUsage: {
    completion: number;
    total: number;
    prompt: number;
  };
  messageId: number; // AI 回复的消息 ID
  userMessageId?: number; // 用户消息的 ID
  suggestions: string[];
  reply: string;
  autoTitle: string;
  status: string;
}> {}

export interface MessageEditRegenerateParams {
  sessionId: string;
  messageId: number;
  newContent: string;
}

export interface MessageEditRegenerateResponse extends MessageSendResponse {}

// AI compatibility interface
export interface RetrieveAndAnswerParams {
  question: string;
  topK: number;
  sessionId: string;
  useCoT: boolean;
}

export interface Source {
  content: string;
  source: string;
  page: number | null;
}

export interface RetrieveAndAnswerResponse {
  answer: string;
  sources: Source[];
  sessionId: string;
  model_used: string;
}

export interface RagChatParams extends RetrieveAndAnswerParams {}
export interface RagChatResponse extends RetrieveAndAnswerResponse {}

export interface LlmGenerateParams {
  prompt: string;
  systemPrompt: string;
  sessionId: string;
}

export interface LlmGenerateResponse {
  answer: string;
  sessionId: string;
  model_used: string;
}

export interface CoursewareGenerateParams {
  sessionId: string;
  finalRequirements: string;
  outline: any | null;
  templateId: number;
}

export interface CoursewareGenerateResponse {
  taskId: string;
  status: string;
  progress: number;
  outline: string;
  pptUrl: string;
  docUrl: string;
  gameUrl: string;
  model_used: string;
}
