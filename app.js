const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');

app.use(cors()); // 모든 경로에서 CORS 허용

// 또는 특정 경로에서만 CORS 허용
app.get('/api/users', cors(), (req, res) => {
  // ...
});


// 데이터베이스 연결 설정
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '135790',
  database: 'mydb'
});
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET /users - 모든 사용자 목록 조회
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// GET /users/:id - 특정 사용자 정보 조회
app.get('/users/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const userId = req.params.id;
  connection.query(query, [userId], (error, results) => {
    if (error) throw error;
    if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(results[0]);
    }
  });
});

// POST /users - 새로운 사용자 생성
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).send('Name, email, and password are required');
  } else {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const values = [name, email, password];
    connection.query(query, values, (error, results) => {
      if (error) throw error;
      const newUser = { id: results.insertId, name, email, password };
      res.status(201).send(newUser);
    });
  }
});

// PUT /users/:id - 특정 사용자 정보 수정
app.put('/users/:id', (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;
  const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
  const values = [name, email, password, userId];
  connection.query(query, values, (error, results) => {
    if (error) throw error;
    const updatedUser = { id: userId, name, email, password };
    res.send(updatedUser);
  });
});

// DELETE /users/:id - 특정 사용자 삭제
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) throw error;
    if (results.affectedRows === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(`User with id ${userId} deleted`);
    }
  });
});

// 서버 실행을 한다
const port = process.env.PORT || 3100; // 포트 번호를 설정합니다.

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});