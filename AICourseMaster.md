---
title: AICourseMaster
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# AICourseMaster

Base URL: https://299aa5ac.r11.vip.cpolar.cn/api/v1

# Authentication

## POST 账号登录

POST /api/v1/user/login

> Body 请求参数

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» username|body|string| 是 |手机号或邮箱|
|» password|body|string| 是 |密码|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "username": "your_username",
      "nickname": "测试用户",
      "role": "user",
      "avatar": null
    }
  }
}
```

## POST 账号注册

POST /api/v1/user/register

> Body 请求参数

```json
{
  "username": "newuser@example.com",
  "password": "yourpassword"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» username|body|string| 是 |用户名|
|» password|body|string| 是 |密码|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

# 对话与生成结果模块

## POST 停止本轮回答

POST /api/v1/chat/message/stop

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "已下发停止指令",
  "data": {
    "stopAt": "2026-03-05T16:58:12.796677",
    "sessionId": "6c9a9dda-6b20-43e1-b121-81cd6301eb7e"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» stopAt|string|true|none||none|
|»» sessionId|string|true|none||none|

## POST 消息反馈评分

POST /api/v1/chat/message/feedback

> Body 请求参数

```json
"{\n    \"messageId\": {{messageId}},\n    \"score\": 1,\n    \"reason\": \"回答不够贴合我的教学目标\"\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» messageId|body|integer| 是 |none|
|» score|body|integer| 是 |none|
|» reason|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "感谢您的反馈，我们会持续改进",
  "data": {
    "currentScore": 1,
    "messageId": 10
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» currentScore|integer|true|none||none|
|»» messageId|integer|true|none||none|

## GET 聚合健康检查

GET /api/v1/health

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "backend": {
      "status": "UP"
    },
    "database": {
      "status": "UP"
    },
    "redis": {
      "status": "UP"
    },
    "ai": {
      "status": "UP",
      "detail": {
        "status": "healthy",
        "rag_ready": true,
        "llm_ready": true
      }
    },
    "status": "UP"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» backend|object|true|none||none|
|»»» status|string|true|none||none|
|»» database|object|true|none||none|
|»»» status|string|true|none||none|
|»» redis|object|true|none||none|
|»»» status|string|true|none||none|
|»» ai|object|true|none||none|
|»»» status|string|true|none||none|
|»»» detail|object|true|none||none|
|»»»» status|string|true|none||none|
|»»»» rag_ready|boolean|true|none||none|
|»»»» llm_ready|boolean|true|none||none|
|»» status|string|true|none||none|

# 对话与生成结果模块/会话

## POST 创建对话会话

POST /api/v1/chat/session/create

> Body 请求参数

```json
{
  "sceneType": 1,
  "firstPrompt": "帮我规划一门 Python 入门课程的大纲"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sceneType|body|integer| 是 |none|
|» firstPrompt|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "新任务已开启",
  "data": {
    "sceneType": 1,
    "createTime": "2026-03-05T16:24:20.00764",
    "sessionId": "9c1e2918-a382-462e-9d69-f278d7707103",
    "title": "新课件任务"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» sceneType|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» sessionId|string|true|none||none|
|»» title|string|true|none||none|

## POST 查询会话详情

POST /api/v1/chat/session/detail

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "sessionInfo": {
      "sceneType": 1,
      "createTime": "2026-03-05T16:34:09",
      "sessionId": "6c9a9dda-6b20-43e1-b121-81cd6301eb7e",
      "title": "新课件任务",
      "status": 0
    },
    "materials": [],
    "history": [
      {
        "role": "user",
        "messageId": 2,
        "content": "帮我规划一门 Python 入门课程的大纲"
      }
    ],
    "finalResult": null
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» sessionInfo|object|true|none||none|
|»»» sceneType|integer|true|none||none|
|»»» createTime|string|true|none||none|
|»»» sessionId|string|true|none||none|
|»»» title|string|true|none||none|
|»»» status|integer|true|none||none|
|»» materials|[string]|true|none||none|
|»» history|[object]|true|none||none|
|»»» role|string|false|none||none|
|»»» messageId|integer|false|none||none|
|»»» content|string|false|none||none|
|»» finalResult|null|true|none||none|

## POST 获取侧边栏会话列表(包含关键词搜索)

POST /api/v1/chat/session/list

> Body 请求参数

```json
{
  "keyword": "",
  "page": 1,
  "size": 20
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» keyword|body|string| 是 |none|
|» page|body|integer| 是 |none|
|» size|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 9,
    "size": 20,
    "hasMore": false,
    "page": 1,
    "items": [
      {
        "pinned": true,
        "sceneType": 1,
        "updateTime": "2026-03-19T17:34:37",
        "sessionId": "68e94343-a7b3-40b3-be88-24be389953f9",
        "title": "基于上传资料的Python课程目标总结",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-19T18:06:24",
        "sessionId": "2b740c5d-15d9-40cb-800b-384d1971694d",
        "title": "新课件任务",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-19T18:06:09",
        "sessionId": "926cda54-1970-49bd-9255-cdd66eed6459",
        "title": "新课件任务",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-19T17:56:14",
        "sessionId": "ef09ceb4-50ae-4cee-9874-994ffcc3bbe9",
        "title": "新课件任务",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-19T17:40:09",
        "sessionId": "ad07b4b1-7176-404f-bf40-0401cfbfd51f",
        "title": "新课件任务",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-19T15:58:16",
        "sessionId": "da996660-b5b4-443b-9190-a7d8373f7f75",
        "title": "新课件任务",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-05T17:40:38",
        "sessionId": "ba4cc8be-9b0a-4cc3-81be-b3426dd0b51e",
        "title": "新课件任务",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-05T17:38:27",
        "sessionId": "384eb6ad-a50f-43fc-a7c0-9d7494217c84",
        "title": "新课件任务",
        "status": 0
      },
      {
        "pinned": false,
        "sceneType": 1,
        "updateTime": "2026-03-05T16:24:20",
        "sessionId": "9c1e2918-a382-462e-9d69-f278d7707103",
        "title": "新课件任务",
        "status": 0
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» total|integer|true|none||none|
|»» size|integer|true|none||none|
|»» hasMore|boolean|true|none||none|
|»» page|integer|true|none||none|
|»» items|[object]|true|none||none|
|»»» pinned|boolean|true|none||none|
|»»» sceneType|integer|true|none||none|
|»»» updateTime|string|true|none||none|
|»»» sessionId|string|true|none||none|
|»»» title|string|true|none||none|
|»»» status|integer|true|none||none|

# 对话与生成结果模块/会话/重命名

## POST 重命名对话

POST /api/v1/chat/session/rename

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "title": "我的 Python 入门课"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» title|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "对话已重命名",
  "data": {
    "sessionId": "920a551e-4da8-405d-a532-dd1ac0822b3d",
    "title": "我的 Python 入门课"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» sessionId|string|true|none||none|
|»» title|string|true|none||none|

## POST 附件重命名

POST /api/v1/material/rename

> Body 请求参数

```json
"{\n    \"fileId\": {{fileId}},\n    \"fileName\": \"课程资料-重命名后.pdf\"\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» fileId|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "附件已重命名",
  "data": {
    "fileName": "课程资料-重命名后.pdf",
    "fileId": 6
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» fileName|string|true|none||none|
|»» fileId|integer|true|none||none|

# 对话与生成结果模块/会话/置顶

## POST 置顶/取消置顶会话

POST /api/v1/chat/session/pin

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "pin": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» pin|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "已置顶对话",
  "data": {
    "pinned": true,
    "sessionId": "68e94343-a7b3-40b3-be88-24be389953f9"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» pinned|boolean|true|none||none|
|»» sessionId|string|true|none||none|

## POST 置顶顺序管理

POST /api/v1/chat/session/pin/reorder

> Body 请求参数

```json
{
  "orderedSessionIds": [
    "a964e874-347a-4734-bc28-69a5ed575d13",
    "4d6a5f7e-b642-4a60-8c17-33ddab726e7a",
    "1c36c260-14a1-44d8-a054-8a425d9aa7fa",
    "68e94343-a7b3-40b3-be88-24be389953f9"
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» orderedSessionIds|body|[string]| 是 |none|

> 返回示例

```json
{
  "code": 200,
  "message": "置顶顺序已更新",
  "data": {
    "count": 4,
    "orderedSessionIds": [
      "a964e874-347a-4734-bc28-69a5ed575d13",
      "4d6a5f7e-b642-4a60-8c17-33ddab726e7a",
      "1c36c260-14a1-44d8-a054-8a425d9aa7fa",
      "68e94343-a7b3-40b3-be88-24be389953f9"
    ]
  }
}
```

```json
{
  "code": 200,
  "message": "置顶顺序已更新",
  "data": {
    "count": 4,
    "orderedSessionIds": [
      "a964e874-347a-4734-bc28-69a5ed575d13",
      "4d6a5f7e-b642-4a60-8c17-33ddab726e7a",
      "1c36c260-14a1-44d8-a054-8a425d9aa7fa",
      "68e94343-a7b3-40b3-be88-24be389953f9"
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» count|integer|true|none||none|
|»» orderedSessionIds|[string]|true|none||none|

# 对话与生成结果模块/测试AI接口

## POST 对话(兼容接口)

POST /api/retrieve_and_answer

> Body 请求参数

```json
{
  "question": "你好，简单介绍一下你能做什么？",
  "topK": 5,
  "sessionId": "s1",
  "useCoT": false
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» question|body|string| 是 |none|
|» topK|body|integer| 是 |none|
|» sessionId|body|string| 是 |none|
|» useCoT|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "answer": "本课程的口号是ABC123，这是来自提供的【来源1】中的信息。",
  "sources": [
    {
      "content": "本课程口号是ABC123...",
      "source": "课程口号.txt",
      "page": null
    }
  ],
  "sessionId": "s1",
  "model_used": "qwen2.5:7b-instruct-q4_K_M"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» answer|string|true|none||none|
|» sources|[object]|true|none||none|
|»» content|string|false|none||none|
|»» source|string|false|none||none|
|»» page|null|false|none||none|
|» sessionId|string|true|none||none|
|» model_used|string|true|none||none|

## GET 健康检查

GET /health

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": "healthy",
  "rag_ready": true,
  "llm_ready": true
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» rag_ready|boolean|true|none||none|
|» llm_ready|boolean|true|none||none|

## POST RAG问答(新)

POST /api/rag/chat

> Body 请求参数

```json
{
  "question": "本课程口号是什么？",
  "topK": 1,
  "sessionId": "precheck-s1",
  "useCoT": false
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» question|body|string| 是 |none|
|» topK|body|integer| 是 |none|
|» sessionId|body|string| 是 |none|
|» useCoT|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "answer": "本课程的口号是ABC123，来源于【来源1】提供的信息。",
  "sources": [
    {
      "content": "本课程口号是ABC123...",
      "source": "data.txt",
      "page": null
    }
  ],
  "sessionId": "precheck-s1",
  "model_used": "qwen2.5:7b-instruct-q4_K_M"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» answer|string|true|none||none|
|» sources|[object]|true|none||none|
|»» content|string|false|none||none|
|»» source|string|false|none||none|
|»» page|null|false|none||none|
|» sessionId|string|true|none||none|
|» model_used|string|true|none||none|

## POST 通用生成(新)

POST /api/llm/generate

> Body 请求参数

```json
{
  "prompt": "请给“Python入门课程”生成一个15字以内标题",
  "systemPrompt": "你是课程命名助手，只返回标题文本。",
  "sessionId": "precheck-s1"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» prompt|body|string| 是 |none|
|» systemPrompt|body|string| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "answer": "Python初学者快速上手指南",
  "sessionId": "precheck-s1",
  "model_used": "qwen2.5:7b-instruct-q4_K_M"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» answer|string|true|none||none|
|» sessionId|string|true|none||none|
|» model_used|string|true|none||none|

## POST 课件文件生成(确认文件生成能力)

POST /api/courseware/generate

> Body 请求参数

```json
{
  "sessionId": "precheck-s1",
  "finalRequirements": "生成一个16学时Python入门课程的大纲，包含章节目标和实践任务。",
  "outline": null,
  "templateId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» finalRequirements|body|string| 是 |none|
|» outline|body|null| 是 |none|
|» templateId|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "taskId": "py-task-9046f99ef2d3",
  "status": "success",
  "progress": 100,
  "outline": "Python is a high-level programming language known for its simplicity and readability. (Mock Response)",
  "pptUrl": "/generated-files/precheck-s1/py-task-9046f99ef2d3/courseware.pptx",
  "docUrl": "/generated-files/precheck-s1/py-task-9046f99ef2d3/teaching_plan.docx",
  "gameUrl": "/generated-files/precheck-s1/py-task-9046f99ef2d3/interactive_game.html",
  "model_used": "qwen2.5:7b-instruct-q4_K_M"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» taskId|string|true|none||none|
|» status|string|true|none||none|
|» progress|integer|true|none||none|
|» outline|string|true|none||none|
|» pptUrl|string|true|none||none|
|» docUrl|string|true|none||none|
|» gameUrl|string|true|none||none|
|» model_used|string|true|none||none|

# 对话与生成结果模块/删除

## POST 批量删除消息

POST /api/v1/chat/message/batchDelete

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "messageIds": [
    3,
    4
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» messageIds|body|[integer]| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "选定消息已删除，对话上下文已重构",
  "data": {
    "deletedCount": 2,
    "sessionId": "6c9a9dda-6b20-43e1-b121-81cd6301eb7e",
    "remainingCount": 7
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» deletedCount|integer|true|none||none|
|»» sessionId|string|true|none||none|
|»» remainingCount|integer|true|none||none|

## POST 删除会话

POST /api/v1/chat/session/delete

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "对话及关联文件已彻底删除",
  "data": {
    "deletedAt": "2026-03-05T17:36:36.946151",
    "sessionId": "6c9a9dda-6b20-43e1-b121-81cd6301eb7e"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» deletedAt|string|true|none||none|
|»» sessionId|string|true|none||none|

## POST 清空会话历史

POST /api/v1/chat/session/clear

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "对话历史已清空，您可以重新开始提问",
  "data": {
    "remainingMaterialsCount": 0,
    "clearedAt": "2026-03-05T17:38:27.824284",
    "sessionId": "384eb6ad-a50f-43fc-a7c0-9d7494217c84"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» remainingMaterialsCount|integer|true|none||none|
|»» clearedAt|string|true|none||none|
|»» sessionId|string|true|none||none|

# 对话与生成结果模块/上传资料

## POST 上传资料文件

POST /api/v1/material/upload

> Body 请求参数

```yaml
file: file:///Users/meimianzi/Downloads/666.docx
sessionId: "{{sessionId}}"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» file|body|string(binary)| 否 |none|
|» sessionId|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "文件上传成功，正在后台解析中",
  "data": {
    "fileName": "666.docx",
    "previewUrl": "/api/files/preview/1",
    "fileId": 1,
    "status": "parsing"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» fileName|string|true|none||none|
|»» previewUrl|string|true|none||none|
|»» fileId|integer|true|none||none|
|»» status|string|true|none||none|

## POST 查询资料解析状态

POST /api/v1/material/status

> Body 请求参数

```json
"{\n    \"fileId\": {{fileId}}\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» fileId|body|object| 是 |none|

> 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "result": {
      "summary": null,
      "previewUrl": "/api/files/preview/2",
      "keywords": null
    },
    "progress": 50,
    "fileId": 2,
    "status": "parsing"
  }
}
```

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "result": {
      "summary": "该图片文件名为SCR-20260319-oqmx.png，类型为PNG，适合用于制作教学问答的内容。",
      "previewUrl": "/api/files/preview/5",
      "keywords": "[\"图片\", \"文件名\", \"SCR-20260319-oqmx.png\", \"文件类型\", \"PNG\", \"教学问答\"]"
    },
    "progress": 100,
    "fileId": 5,
    "status": "completed"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» result|object|true|none||none|
|»»» summary|null|true|none||none|
|»»» previewUrl|string|true|none||none|
|»»» keywords|null|true|none||none|
|»» progress|integer|true|none||none|
|»» fileId|integer|true|none||none|
|»» status|string|true|none||none|

## POST 删除附件

POST /api/v1/material/delete

> Body 请求参数

```json
"{\n    \"fileId\": {{fileId}},\n    \"sessionId\": \"{{sessionId}}\"\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» fileId|body|integer| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "附件已删除",
  "data": {
    "deletedAt": "2026-03-30T15:15:58.751339",
    "sessionId": "920a551e-4da8-405d-a532-dd1ac0822b3d",
    "fileId": 7
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» deletedAt|string|true|none||none|
|»» sessionId|string|true|none||none|
|»» fileId|integer|true|none||none|

# 对话与生成结果模块/消息

## POST 发送消息（带文件）

POST /api/v1/chat/message/send

> Body 请求参数

```json
"{\n    \"sessionId\": \"{{sessionId}}\",\n    \"content\": \"请基于我上传的课程说明书，给出更详细的教学目标和教学安排。\",\n    \"fileIds\": [\n        {{fileId}}\n    ],\n    \"sceneType\": 1,\n    \"isResend\": false\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» content|body|string| 是 |none|
|» fileIds|body|[object]| 是 |none|
|» sceneType|body|integer| 是 |none|
|» isResend|body|boolean| 是 |none|

> 返回示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "tokenUsage": {
      "completion": 0,
      "total": 0,
      "prompt": 0
    },
    "messageId": 6,
    "suggestions": [
      "是的，重点讲",
      "简单带过",
      "换个例题"
    ],
    "reply": "这是模拟的 AI 回复，用于打通接口。",
    "autoTitle": "新课件任务",
    "status": "waiting"
  }
}
```

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "tokenUsage": {
      "completion": 0,
      "total": 0,
      "prompt": 0
    },
    "messageId": 22,
    "suggestions": [
      "是的，重点讲",
      "简单带过",
      "换个例题"
    ],
    "reply": "根据您上传的资料，该课程的主要目标可以总结为以下几个方面：\n\n1. **巩固理论知识**：通过完成初级实战项目（如图像分类、文本情感分析等），帮助学员巩固所学的机器学习和深度学习理论知识。\n\n2. **建立完整流程认知**：从数据处理到模型训练，让学员熟悉整个机器学习项目的实现过程。这包括了如何进行数据预处理、模型选择与构建、参数优化以及结果评估与可视化。\n\n3. **提升实际问题解决能力**：通过动手实践，帮助学员增强面对实际问题时的信心和解决能力。具体来说，就是能够在真实场景中应用所学知识。\n\n4. **掌握多种算法和技术工具**：学习并运用各种机器学习方法（如CNN、RNN等），以及常用的编程框架与库（如TensorFlow、PyTorch）。同时还可以利用智能辅助工具（如NewspaceGPT）提高研究效率和代码编写速度。\n\n5. **进行中级挑战项目**：通过构建推荐系统或时间序列预测模型等中级项目，进一步深化对复杂算法的理解，并提高实际操作技能。这不仅包括了传统统计方法的应用，还有深度学习技术的掌握。\n\n6. **优化数据处理与特征工程能力**：在项目实施过程中，学员将获得丰富经验以提升自己对于数据清洗、去噪以及有效特征提取的能力。\n\n7. **灵活运用不同工具和框架进行建模**：课程强调使用多种主流技术和平台（如Scikit-learn、PyTorch等），使学员能够根据具体情况选择合适的工具来完成任务。",
    "autoTitle": "新课件任务",
    "status": "waiting"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» tokenUsage|object|true|none||none|
|»»» completion|integer|true|none||none|
|»»» total|integer|true|none||none|
|»»» prompt|integer|true|none||none|
|»» messageId|integer|true|none||none|
|»» suggestions|[string]|true|none||none|
|»» reply|string|true|none||none|
|»» autoTitle|string|true|none||none|
|»» status|string|true|none||none|

## POST 编辑用户消息并重新生成回复

POST /api/v1/chat/message/editRegenerate

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "messageId": 34,
  "newContent": "把问题改得更具体：本课程口号是什么？"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» messageId|body|integer| 是 |none|
|» newContent|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "已根据修改后的内容重新生成回复",
  "data": {
    "editedMessageId": 34,
    "tokenUsage": {
      "completion": 0,
      "total": 0,
      "prompt": 0
    },
    "messageId": 37,
    "reply": "This is a mock response to: '把问题改得更具体：本课程口号是什么？...' \n[System Note: Real LLM is currently unavailable.]",
    "autoTitle": "我的 Python 入门课",
    "status": "waiting"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» editedMessageId|integer|true|none||none|
|»» tokenUsage|object|true|none||none|
|»»» completion|integer|true|none||none|
|»»» total|integer|true|none||none|
|»»» prompt|integer|true|none||none|
|»» messageId|integer|true|none||none|
|»» reply|string|true|none||none|
|»» autoTitle|string|true|none||none|
|»» status|string|true|none||none|

# 对话与生成结果模块/生成

## POST 启动生成任务

POST /api/v1/generation/start

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "finalRequirements": "基于当前对话结论，生成一门完整的 16 学时课程的 PPT、大纲和教学设计。",
  "templateId": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» finalRequirements|body|string| 是 |none|
|» templateId|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "生成任务已启动",
  "data": {
    "estimatedTime": "60s",
    "taskId": "task-b5646f6a-3882-426e-ad39-e4c30f42efbf"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» estimatedTime|string|true|none||none|
|»» taskId|string|true|none||none|

## POST 查询生成状态

POST /api/v1/generation/status

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "currentStep": "任务已提交，系统开始构建大纲...",
    "progress": 0,
    "logs": [
      "任务已提交，系统开始构建大纲..."
    ],
    "status": "processing"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» currentStep|string|true|none||none|
|»» progress|integer|true|none||none|
|»» logs|[string]|true|none||none|
|»» status|string|true|none||none|

## POST 获取生成结果

POST /api/v1/generation/result

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "outline": "# Python 编程入门\n\n## 第1页 课程介绍\n- 本课程旨在让初学者了解 Python 编程的基本概念与应用。\n- 通过实际操作，掌握基本语法和常用数据结构。\n\n## 第2页 Python 基础环境配置\n- 安装 Python 解释器\n- 设置开发环境（如 PyCharm, VSCode）\n- 学习虚拟环境的使用方法\n\n## 第3页 变量与数据类型\n- 定义和赋值\n- 整数、浮点数、字符串等基本数据类型\n- 变量的作用域\n\n## 第4页 控制结构 - 选择语句\n- if-else 语句\n- 嵌套 if 语句\n- 三元运算符\n\n## 第5页 循环结构 - while 和 for 循环\n- while 循环的基本用法\n- for 循环与 range 函数的结合使用\n- break 和 continue 的应用\n\n## 第6页 函数定义与调用\n- 函数的组成结构\n- 参数传递（位置参数、关键字参数）\n- return 语句\n\n## 第7页 列表操作与方法\n- 创建和访问列表元素\n- 列表切片\n- 添加和删除元素的方法\n\n## 第8页 字典操作与方法\n- 定义字典及其基本用法\n- 常用方法（keys(), values(), items()）\n- 嵌套字典的应用\n\n## 第9页 模块导入与使用\n- 标准库的引入\n- 第三方库的基本使用\n- 自定义模块\n\n## 第10页 异常处理\n- try-except 语句结构\n- 自定义异常\n- finally 子句的作用\n\n## 第11页 文件操作 - 写入与读取\n- 打开和关闭文件的方法\n- 写入数据到文件\n- 从文件中读取数据\n\n## 第12页 面向对象编程基础\n- 类的定义及其实例化\n- 属性与方法\n- 继承与多态\n\n## 第13页 项目实践 - 电话簿应用开发\n- 需求分析\n- 功能实现（增删查改）\n- 用户界面设计",
    "pptUrl": "http://localhost:8000/generated-files/aa1f7b63-1e37-4c5e-8baf-6d94efa231ad/py-task-6b180a6881a4/courseware.pptx",
    "docUrl": "http://localhost:8000/generated-files/aa1f7b63-1e37-4c5e-8baf-6d94efa231ad/py-task-6b180a6881a4/teaching_plan.docx",
    "gameUrl": "http://localhost:8000/generated-files/aa1f7b63-1e37-4c5e-8baf-6d94efa231ad/py-task-6b180a6881a4/interactive_game.html"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» outline|string|true|none||none|
|»» pptUrl|string|true|none||none|
|»» docUrl|string|true|none||none|
|»» gameUrl|string|true|none||none|

## POST 保存大纲修改

POST /api/v1/generation/outline/save

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "outline": "第一章 Python基础\n第二章 控制流与函数\n第三章 项目实践",
  "reason": "希望先讲语法再做项目，降低初学门槛"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» outline|body|string| 是 |none|
|» reason|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "大纲修改已保存",
  "data": {
    "outline": "第一章 Python基础\n第二章 控制流与函数\n第三章 项目实践",
    "saved": true,
    "taskId": "task-53737665-c678-421d-a021-b60a64cc89bc"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» outline|string|true|none||none|
|»» saved|boolean|true|none||none|
|»» taskId|string|true|none||none|

## POST 取消生成

POST /api/v1/generation/cancel

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "生成任务已取消",
  "data": {
    "taskId": "task-7a8e8575-ccf8-428e-b58a-7d09153ae7ac",
    "status": "cancelled"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» taskId|string|true|none||none|
|»» status|string|true|none||none|

# 对话与生成结果模块/回调接口

## POST 资料解析结果回调

POST /api/callback/material/parsed

> Body 请求参数

```json
"{\n    \"fileId\": {{fileId}},\n    \"status\": 1,\n    \"summary\": \"课程内容概述……\",\n    \"keywords\": [\n        \"Python\",\n        \"入门\",\n        \"教学目标\"\n    ],\n    \"errorMsg\": null\n}"
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» fileId|body|integer| 是 |none|
|» status|body|integer| 是 |none|
|» summary|body|string| 是 |none|
|» keywords|body|[string]| 是 |none|
|» errorMsg|body|null| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

## POST 生成结果回调

POST /api/callback/generation/result

> Body 请求参数

```json
{
  "taskId": "task-b5646f6a-3882-426e-ad39-e4c30f42efbf",
  "status": "success",
  "progress": 100,
  "pptUrl": "https://example.com/course.pptx",
  "docUrl": "https://example.com/course.docx",
  "gameUrl": "https://example.com/course-game",
  "outline": "课程大纲文本内容……",
  "errorMsg": null
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» taskId|body|string| 是 |none|
|» status|body|string| 是 |none|
|» progress|body|integer| 是 |none|
|» pptUrl|body|string| 是 |none|
|» docUrl|body|string| 是 |none|
|» gameUrl|body|string| 是 |none|
|» outline|body|string| 是 |none|
|» errorMsg|body|null| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

# 对话与生成结果模块/版本历史

## POST 生成版本历史列表

POST /api/v1/generation/version/list

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "taskId": "{{taskId}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» taskId|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "versions": [
      {
        "outlineChangeReason": null,
        "outline": "This is a mock response to: '请为以下教学需求生成一份结构化课程大纲（按章节列点，中文输出）：\n基于当前对话结论，生成一门完整的 ...' \n[System Note: Real LLM is currently unavailable.]",
        "requirements": "基于当前对话结论，生成一门完整的 16 学时课程的 PPT、大纲和教学设计。",
        "pptUrl": null,
        "createTime": "2026-03-30T18:28:14",
        "changeType": "initial",
        "versionNo": 1,
        "docUrl": null,
        "gameUrl": null
      }
    ],
    "taskId": "task-10"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» total|integer|true|none||none|
|»» versions|[object]|true|none||none|
|»»» outlineChangeReason|null|false|none||none|
|»»» outline|string|false|none||none|
|»»» requirements|string|false|none||none|
|»»» pptUrl|null|false|none||none|
|»»» createTime|string|false|none||none|
|»»» changeType|string|false|none||none|
|»»» versionNo|integer|false|none||none|
|»»» docUrl|null|false|none||none|
|»»» gameUrl|null|false|none||none|
|»» taskId|string|true|none||none|

## POST 生成版本详情

POST /api/v1/generation/version/detail

> Body 请求参数

```json
{
  "sessionId": "{{sessionId}}",
  "taskId": null,
  "versionNo": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» sessionId|body|string| 是 |none|
|» taskId|body|null| 是 |none|
|» versionNo|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "version": {
      "outlineChangeReason": null,
      "outline": "This is a mock response to: '请为以下教学需求生成一份结构化课程大纲（按章节列点，中文输出）：\n基于当前对话结论，生成一门完整的 ...' \n[System Note: Real LLM is currently unavailable.]",
      "requirements": "基于当前对话结论，生成一门完整的 16 学时课程的 PPT、大纲和教学设计。",
      "pptUrl": null,
      "createTime": "2026-03-30T18:28:14",
      "changeType": "initial",
      "versionNo": 1,
      "docUrl": null,
      "gameUrl": null
    },
    "taskId": "task-10"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» version|object|true|none||none|
|»»» outlineChangeReason|null|true|none||none|
|»»» outline|string|true|none||none|
|»»» requirements|string|true|none||none|
|»»» pptUrl|null|true|none||none|
|»»» createTime|string|true|none||none|
|»»» changeType|string|true|none||none|
|»»» versionNo|integer|true|none||none|
|»»» docUrl|null|true|none||none|
|»»» gameUrl|null|true|none||none|
|»» taskId|string|true|none||none|

# 管理模块

## POST 基本数据监控

POST /api/v1/admin/metrics/overview

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Admin-Token|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "chatMessages": 9,
    "materials": 2,
    "sensitiveWords": 0,
    "generationTasks": 6,
    "redisApproxKeyCount": 2,
    "chatSessions": 14
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» chatMessages|integer|true|none||none|
|»» materials|integer|true|none||none|
|»» sensitiveWords|integer|true|none||none|
|»» generationTasks|integer|true|none||none|
|»» redisApproxKeyCount|integer|true|none||none|
|»» chatSessions|integer|true|none||none|

## POST Redis 缓存清理

POST /api/v1/admin/redis/clear

> Body 请求参数

```json
{
  "pattern": "chat_history:*"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Admin-Token|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» pattern|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "Redis 清理完成",
  "data": {
    "deletedCount": 1,
    "pattern": "chat_history:*"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» deletedCount|integer|true|none||none|
|»» pattern|string|true|none||none|

# 管理模块/敏感词

## POST 新增敏感词

POST /api/v1/admin/sensitive-word/add

> Body 请求参数

```json
{
  "word": "测试敏感词",
  "enabled": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Admin-Token|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» word|body|string| 是 |none|
|» enabled|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "敏感词已添加",
  "data": {
    "saved": true
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» saved|boolean|true|none||none|

## POST 敏感词列表

POST /api/v1/admin/sensitive-word/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Admin-Token|header|string| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "word": "测试敏感词",
        "enabled": 1,
        "createTime": "2026-03-30T14:59:38",
        "updateTime": "2026-03-30T14:59:38"
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» total|integer|true|none||none|
|»» items|[object]|true|none||none|
|»»» id|integer|false|none||none|
|»»» word|string|false|none||none|
|»»» enabled|integer|false|none||none|
|»»» createTime|string|false|none||none|
|»»» updateTime|string|false|none||none|

## POST 修改敏感词

POST /api/v1/admin/sensitive-word/update

> Body 请求参数

```json
{
  "id": 1,
  "word": "新词",
  "enabled": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Admin-Token|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» id|body|integer| 是 |none|
|» word|body|string| 是 |none|
|» enabled|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "敏感词已更新",
  "data": {
    "saved": true
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» saved|boolean|true|none||none|

## POST 删除敏感词

POST /api/v1/admin/sensitive-word/delete

> Body 请求参数

```json
{
  "id": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|X-Admin-Token|header|string| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» id|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "敏感词已删除",
  "data": {
    "deleted": true
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» deleted|boolean|true|none||none|

# 用户认证模块

## POST 注册

POST /api/v1/user/register

> Body 请求参数

```json
{
  "username": "demo_user",
  "password": "secret12"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "expiresIn": 604800,
    "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJkZW1vX3VzZXIiLCJpYXQiOjE3NzQ4NjgzMTQsImV4cCI6MTc3NTQ3MzExNH0.yFoPVEZz1RJ3m-VrSiSkSP8w11Belf6HWls3z2x7sP4ltOLc2GAHPForAPORqYDO"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» expiresIn|integer|true|none||none|
|»» token|string|true|none||none|

## POST 登录

POST /api/v1/user/login

> Body 请求参数

```json
{
  "username": "demo_user",
  "password": "secret12"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "expiresIn": 604800,
    "user": {
      "role": "teacher",
      "lastLoginAt": "2026-03-30T19:01:11",
      "id": 1,
      "username": "demo_user"
    },
    "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJkZW1vX3VzZXIiLCJpYXQiOjE3NzQ4Njg0NzEsImV4cCI6MTc3NTQ3MzI3MX0.KfopnnRAsPTLLHHymB7vfSX4aYDhHropy4MQooLbNM27fktO_JhsOnugNtBbbMCm"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» expiresIn|integer|true|none||none|
|»» user|object|true|none||none|
|»»» role|string|true|none||none|
|»»» lastLoginAt|string|true|none||none|
|»»» id|integer|true|none||none|
|»»» username|string|true|none||none|
|»» token|string|true|none||none|

## GET 获取当前用户信息

GET /api/v1/user/me

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "role": "teacher",
    "createTime": "2026-03-30T18:58:34",
    "id": 1,
    "avatar": null,
    "username": "demo_user"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» role|string|true|none||none|
|»» createTime|string|true|none||none|
|»» id|integer|true|none||none|
|»» avatar|null|true|none||none|
|»» username|string|true|none||none|

## POST 头像上传(URL)

POST /api/v1/user/avatar

> Body 请求参数

```yaml
file: file:///Users/meimianzi/Desktop/SCR-20260330-qram.png

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» file|body|string(binary)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "头像上传成功",
  "data": {
    "path": "/api/v1/files/avatar/c0dd8728-952f-4450-a3a8-e2d69e6b614b.png",
    "url": "http://localhost:8080/api/v1/files/avatar/c0dd8728-952f-4450-a3a8-e2d69e6b614b.png"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» path|string|true|none||none|
|»» url|string|true|none||none|

## POST 修改个人信息

POST /api/v1/user/profile

> Body 请求参数

```json
{
  "username": "新昵称",
  "avatar": "{{avatarUrl}}"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» username|body|string| 是 |none|
|» avatar|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "个人信息修改成功",
  "data": {
    "id": 1,
    "avatar": "undefined",
    "username": "新昵称"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» avatar|string|true|none||none|
|»» username|string|true|none||none|

## POST 修改密码

POST /api/v1/user/password

> Body 请求参数

```json
{
  "oldPassword": "secret12",
  "newPassword": "newpass12"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 是 |none|
|» oldPassword|body|string| 是 |none|
|» newPassword|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "密码修改成功，请重新登录",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

## POST 退出登录

POST /api/v1/user/logout

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 200,
  "message": "退出登录成功",
  "data": null
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» data|null|true|none||none|

# 数据模型

