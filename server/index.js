const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

// 配置 multer 用于内存存储文件
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());

// In-memory user storage
const users = [];
// In-memory verification codes storage (account -> code)
const verificationCodes = {};

// In-memory chat storage
const sessions = [];
const sessionMessages = {}; // sessionId -> messages[]
const materials = {}; // sessionId -> materials[]

// Helper: find user by username (account)
const findUser = (username) => users.find(u => u.username === username);

// Middleware: Verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ code: 401, message: '未授权' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ code: 403, message: 'Token 无效或已过期' });
    req.user = user;
    next();
  });
};

// --- Authentication Routes ---

// 1. 发送验证码
app.post('/api/v1/user/code', (req, res) => {
  const { account } = req.body;
  if (!account) return res.status(400).json({ code: 400, message: '请输入账号' });

  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[account] = code;

  console.log(`[Mock SMS/Email] 验证码已发送至 ${account}: ${code}`);
  
  res.json({ code: 200, message: '验证码已发送', data: { code } });
});

// 2. 账号注册
app.post('/api/v1/user/register', async (req, res) => {
  const { username, password, code } = req.body;

  if (!username || !password || !code) {
    return res.status(400).json({ code: 400, message: '参数不完整' });
  }

  // Verify code
  if (verificationCodes[username] !== code) {
    return res.status(400).json({ code: 400, message: '验证码错误' });
  }

  // Check if user already exists
  if (findUser(username)) {
    return res.status(400).json({ code: 400, message: '该账号已注册' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    role: 'user',
    avatar: null,
    nickname: `用户_${username.slice(0, 4)}`,
    createTime: new Date().toISOString()
  };
  users.push(newUser);

  // Clear verification code
  delete verificationCodes[username];

  // Generate token
  const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '24h' });

  res.json({
    code: 200,
    message: '注册成功',
    data: {
      token,
      expiresIn: 86400
    }
  });
});

// 3. 账号登录
app.post('/api/v1/user/login', async (req, res) => {
  const { username, password } = req.body;

  const user = findUser(username);
  if (!user) {
    // 如果是测试环境，且用户不存在，自动创建一个测试用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      role: 'user',
      avatar: null,
      nickname: `测试用户_${username.slice(0, 4)}`,
      createTime: new Date().toISOString()
    };
    users.push(newUser);
    
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({
      code: 200,
      message: '登录成功 (自动创建测试账号)',
      data: {
        token,
        expiresIn: 86400,
        user: newUser
      }
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ code: 400, message: '账号或密码错误' });
  }

  // Generate token
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    code: 200,
    message: '登录成功',
    data: {
      token,
      expiresIn: 86400,
      user: userWithoutPassword
    }
  });
});

// 4. 获取用户信息
app.get('/api/v1/user/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    code: 200,
    message: 'success',
    data: userWithoutPassword
  });
});

// --- Chat & Session Routes ---

// 1. 健康检查
app.get('/api/v1/health', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      backend: { status: 'UP' },
      database: { status: 'UP' },
      redis: { status: 'UP' },
      ai: {
        status: 'UP',
        detail: { status: 'healthy', rag_ready: true, llm_ready: true }
      },
      status: 'UP'
    }
  });
});

// 2. 创建对话会话
app.post('/api/v1/chat/session/create', authenticateToken, (req, res) => {
  const { sceneType, firstPrompt } = req.body;
  const sessionId = require('crypto').randomUUID();
  const session = {
    sceneType,
    createTime: new Date().toISOString(),
    sessionId,
    title: firstPrompt.slice(0, 20) || '新课件任务',
    status: 0,
    pinned: false
  };
  sessions.unshift(session);
  sessionMessages[sessionId] = [];
  materials[sessionId] = [];
  
  res.json({
    code: 200,
    message: '新任务已开启',
    data: session
  });
});

// 3. 上传资料文件
app.post('/api/v1/material/upload', authenticateToken, upload.single('file'), (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ code: 400, message: '缺少 sessionId' });
  
  const fileId = Math.floor(Math.random() * 10000);
  const material = {
    fileId,
    fileName: req.file.originalname,
    previewUrl: 'https://placehold.co/100x100',
    status: 'parsed'
  };
  
  if (!materials[sessionId]) materials[sessionId] = [];
  materials[sessionId].push(material);
  
  res.json({
    code: 200,
    message: '文件上传成功',
    data: material
  });
});

// 4. 发送消息
app.post('/api/v1/chat/message/send', authenticateToken, (req, res) => {
  const { sessionId, content, fileIds } = req.body;
  if (!sessionId) return res.status(400).json({ code: 400, message: '缺少 sessionId' });

  const userMsgId = Math.floor(Math.random() * 10000);
  const assistantMsgId = Math.floor(Math.random() * 10000);

  const userMsg = {
    role: 'user',
    messageId: userMsgId,
    content: content
  };
  
  const assistantMsg = {
    role: 'assistant',
    messageId: assistantMsgId,
    content: `这是对 "${content}" 的模拟 AI 回复。我收到了 ${fileIds.length} 个文件。`,
    reply: `这是对 "${content}" 的模拟 AI 回复。我收到了 ${fileIds.length} 个文件。`
  };

  if (!sessionMessages[sessionId]) sessionMessages[sessionId] = [];
  sessionMessages[sessionId].push(userMsg);
  sessionMessages[sessionId].push(assistantMsg);

  res.json({
    code: 200,
    message: 'success',
    data: {
      ...assistantMsg,
      userMessageId: userMsgId,
      tokenUsage: { completion: 100, total: 150, prompt: 50 },
      suggestions: ['继续对话', '重新生成', '查看大纲'],
      status: 'completed'
    }
  });
});

// 5. 获取会话列表
app.post('/api/v1/chat/session/list', authenticateToken, (req, res) => {
  const { keyword, page = 1, size = 20 } = req.body;
  let filtered = sessions;
  if (keyword) {
    filtered = sessions.filter(s => s.title.includes(keyword));
  }
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      total: filtered.length,
      size,
      hasMore: false,
      page,
      items: filtered
    }
  });
});

// 6. 获取会话详情
app.post('/api/v1/chat/session/detail', authenticateToken, (req, res) => {
  const { sessionId } = req.body;
  const session = sessions.find(s => s.sessionId === sessionId);
  if (!session) return res.status(404).json({ code: 404, message: '会话不存在' });
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      sessionInfo: session,
      materials: (materials[sessionId] || []).map(m => m.fileName),
      history: sessionMessages[sessionId] || [],
      finalResult: null
    }
  });
});

// 7. 停止生成 (Mock)
app.post('/api/v1/chat/message/stop', authenticateToken, (req, res) => {
  res.json({ code: 200, message: '已停止生成', data: { sessionId: req.body.sessionId, stopAt: new Date().toISOString() } });
});

// 8. 附件解析状态 (Mock)
app.post('/api/v1/material/status', authenticateToken, (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      result: { summary: '这是文件摘要', previewUrl: 'https://placehold.co/100x100', keywords: 'AI, Test' },
      progress: 100,
      fileId: req.body.fileId,
      status: 'parsed'
    }
  });
});

// 9. 删除会话 (Mock)
app.post('/api/v1/chat/session/delete', authenticateToken, (req, res) => {
  const { sessionId } = req.body;
  const index = sessions.findIndex(s => s.sessionId === sessionId);
  if (index !== -1) sessions.splice(index, 1);
  res.json({ code: 200, message: '会话已删除', data: { sessionId, deletedAt: new Date().toISOString() } });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock Backend server running at http://localhost:${PORT}`);
});
