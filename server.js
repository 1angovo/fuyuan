const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
// 用本地JSON文件模拟数据库，存储留言
const messagePath = path.join(__dirname, 'messages.json');

// 中间件：解析JSON请求、解决跨域
app.use(cors());
app.use(express.json());

// 1. 接口：获取所有留言
app.get('/getMessages', (req, res) => {
    // 读取JSON文件，无文件则返回空数组
    if (!fs.existsSync(messagePath)) {
        return res.json([]);
    }
    const data = fs.readFileSync(messagePath, 'utf8');
    res.json(JSON.parse(data) || []);
});

// 2. 接口：添加新留言
app.post('/addMessage', (req, res) => {
    const newMsg = req.body;
    // 读取现有留言
    let messages = [];
    if (fs.existsSync(messagePath)) {
        messages = JSON.parse(fs.readFileSync(messagePath, 'utf8'));
    }
    // 添加新留言并写入文件
    messages.push(newMsg);
    fs.writeFileSync(messagePath, JSON.stringify(messages, null, 2));
    res.json({ success: true });
});

// 启动服务器
app.listen(port, () => {
    console.log(`后端服务已启动：http://localhost:${port}`);
});