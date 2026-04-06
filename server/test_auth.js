const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAuth() {
  try {
    const account = 'test@example.com';
    const password = 'Password123!';

    console.log('--- 1. Testing Send Code ---');
    const codeRes = await axios.post(`${BASE_URL}/user/code`, { account });
    const code = codeRes.data.data.code;
    console.log('Code received:', code);

    console.log('\n--- 2. Testing Register ---');
    const registerRes = await axios.post(`${BASE_URL}/user/register`, {
      username: account,
      password: password,
      code: code
    });
    console.log('Register Response:', registerRes.data);

    console.log('\n--- 3. Testing Login ---');
    const loginRes = await axios.post(`${BASE_URL}/user/login`, {
      username: account,
      password: password
    });
    console.log('Login Response:', loginRes.data);
    const token = loginRes.data.data.token;

    console.log('\n--- 4. Testing Get User Info ---');
    const userRes = await axios.get(`${BASE_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('User Info Response:', userRes.data);

    console.log('\n--- All tests passed! ---');
  } catch (err) {
    console.error('Test Error:', err.response?.data || err.message);
  }
}

testAuth();
