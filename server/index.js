const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(bodyParser.json());

// In-memory user storage
const users = [];
// In-memory verification codes storage (account -> code)
const verificationCodes = {};

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
  
  res.json({ code: 200, message: '验证码已发送', data: null });
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
    return res.status(400).json({ code: 400, message: '账号或密码错误' });
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

// 5. 退出登录 (Mock)
app.post('/api/v1/user/logout', authenticateToken, (req, res) => {
  res.json({ code: 200, message: '已退出登录' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
