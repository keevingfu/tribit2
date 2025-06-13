import { createServer } from 'http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>BUAgent 测试</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        .success { color: green; font-size: 24px; }
      </style>
    </head>
    <body>
      <h1>BUAgent 服务器测试</h1>
      <p class="success">✅ 服务器正在运行!</p>
      <p>如果您能看到这个页面，说明服务器工作正常。</p>
      <p>访问时间: ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `);
});

const PORT = 9999;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`测试服务器运行在: http://127.0.0.1:${PORT}`);
});

// 添加错误处理
server.on('error', (err) => {
  console.error('服务器错误:', err);
});