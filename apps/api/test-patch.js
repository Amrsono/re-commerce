const http = require('http');

const data = JSON.stringify({ isUrgent: true });

const options = {
  hostname: '127.0.0.1',
  port: 4000,
  path: '/api/tickets/5dcaf70e-d704-4578-b970-f92d4f5fc5a1/status',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${body}`);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
