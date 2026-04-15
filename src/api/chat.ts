import request from './request';
import type {
  StopParams,
  StopResponse,
  FeedbackParams,
  FeedbackResponse,
  HealthResponse,
  SessionCreateParams,
  SessionCreateResponse,
  SessionDetailParams,
  SessionDetailResponse,
  SessionListParams,
  SessionListResponse,
  SessionRenameParams,
  SessionRenameResponse,
  MaterialRenameParams,
  MaterialRenameResponse,
  SessionPinParams,
  SessionPinResponse,
  SessionPinReorderParams,
  SessionPinReorderResponse,
  MessageBatchDeleteParams,
  MessageBatchDeleteResponse,
  SessionDeleteParams,
  SessionDeleteResponse,
  SessionClearParams,
  SessionClearResponse,
  MaterialUploadResponse,
  MaterialStatusParams,
  MaterialStatusResponse,
  MaterialDeleteParams,
  MaterialDeleteResponse,
  MessageSendParams,
  MessageSendResponse,
  MessageEditRegenerateParams,
  MessageEditRegenerateResponse,
  RetrieveAndAnswerParams,
  RetrieveAndAnswerResponse,
  RagChatParams,
  RagChatResponse,
  LlmGenerateParams,
  LlmGenerateResponse,
  CoursewareGenerateParams,
  CoursewareGenerateResponse,
} from './types';

/**
 * 停止本轮回答
 */
export const stopChat = (params: StopParams): Promise<StopResponse> => {
  return request.post('chat/message/stop', params);
};

/**
 * 消息反馈评分
 */
export const feedbackMessage = (params: FeedbackParams): Promise<FeedbackResponse> => {
  return request.post('chat/message/feedback', params);
};

/**
 * 聚合健康检查
 */
export const getHealth = (): Promise<HealthResponse> => {
  return request.get('health');
};

/**
 * AI健康检查(测试接口)
 */
export const getAiHealth = (): Promise<any> => {
  return request.get('../../health');
};

/**
 * 创建对话会话
 */
export const createSession = (params: SessionCreateParams): Promise<SessionCreateResponse> => {
  return request.post('chat/session/create', params);
};

/**
 * 查询会话详情
 */
export const getSessionDetail = (params: SessionDetailParams): Promise<SessionDetailResponse> => {
  return request.post('chat/session/detail', params);
};

/**
 * 获取侧边栏会话列表(包含关键词搜索)
 */
export const getSessionList = (params: SessionListParams): Promise<SessionListResponse> => {
  return request.post('chat/session/list', params);
};

/**
 * 重命名对话
 */
export const renameSession = (params: SessionRenameParams): Promise<SessionRenameResponse> => {
  return request.post('chat/session/rename', params);
};

/**
 * 附件重命名
 */
export const renameMaterial = (params: MaterialRenameParams): Promise<MaterialRenameResponse> => {
  return request.post('material/rename', params);
};

/**
 * 置顶/取消置顶会话
 */
export const pinSession = (params: SessionPinParams): Promise<SessionPinResponse> => {
  return request.post('chat/session/pin', params);
};

/**
 * 置顶顺序管理
 */
export const reorderPinnedSessions = (params: SessionPinReorderParams): Promise<SessionPinReorderResponse> => {
  return request.post('chat/session/pin/reorder', params);
};

/**
 * 批量删除消息
 */
export const batchDeleteMessages = (params: MessageBatchDeleteParams): Promise<MessageBatchDeleteResponse> => {
  return request.post('chat/message/batchDelete', params);
};

/**
 * 删除会话
 */
export const deleteSession = (params: SessionDeleteParams): Promise<SessionDeleteResponse> => {
  return request.post('chat/session/delete', params);
};

/**
 * 清空会话历史
 */
export const clearSessionHistory = (params: SessionClearParams): Promise<SessionClearResponse> => {
  return request.post('chat/session/clear', params);
};

/**
 * 上传资料文件
 */
export const uploadMaterial = (file: File, sessionId: string): Promise<MaterialUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sessionId', sessionId);
  return request.post('material/upload', formData);
};

/**
 * 查询资料解析状态
 */
export const getMaterialStatus = (params: MaterialStatusParams): Promise<MaterialStatusResponse> => {
  return request.post('material/status', params);
};

/**
 * 删除附件
 */
export const deleteMaterial = (params: MaterialDeleteParams): Promise<MaterialDeleteResponse> => {
  return request.post('material/delete', params);
};

/**
 * 发送消息（带文件）
 */
export const sendMessage = (params: MessageSendParams): Promise<MessageSendResponse> => {
  return request.post('chat/message/send', params);
};

/**
 * 编辑用户消息并重新生成回复
 */
export const editAndRegenerate = (params: MessageEditRegenerateParams): Promise<MessageEditRegenerateResponse> => {
  return request.post('chat/message/editRegenerate', params);
};

// --- AI 测试接口 ---

/**
 * 对话(兼容接口)
 */
export const retrieveAndAnswer = (params: RetrieveAndAnswerParams): Promise<RetrieveAndAnswerResponse> => {
  // 注意：文档中是 /api/retrieve_and_answer，baseURL 是 /api/v1
  return request.post('../retrieve_and_answer', params);
};

/**
 * RAG问答(新)
 */
export const ragChat = (params: RagChatParams): Promise<RagChatResponse> => {
  return request.post('../rag/chat', params);
};

/**
 * 通用生成(新)
 */
export const llmGenerate = (params: LlmGenerateParams): Promise<LlmGenerateResponse> => {
  return request.post('../llm/generate', params);
};

/**
 * 课件文件生成
 */
export const generateCourseware = (params: CoursewareGenerateParams): Promise<CoursewareGenerateResponse> => {
  return request.post('../courseware/generate', params);
};
