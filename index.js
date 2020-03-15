require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();
const port = +process.env.PORT || 5000;
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

function hash(password) {
  return crypto.createHmac('sha256', 'abcdefg').update(password).digest('hex');
}

function transformUser(row) {
  return row;
}

function transformTodo(row) {
  return {
    id: row.id,
    title: row.title,
    userId: row.user_id
  };
}

client.connect();

app.use(session({
  secret: 'abc',
  resave: true,
  saveUninitialized: false,
  cookie: { httpOnly: false }
}));

app.post('/login', bodyParser.json(), (req, res) => {
  const { login, password } = req.body;
  client.query('SELECT * FROM users WHERE login = $1 AND password = $2', [login, hash(password)], (err, dbResponse) => {
    if (dbResponse.rows.length > 0) {
      req.session.login = login;
      res.json({
        status: 'ok'
      });
    } else {
      res.status(401).json({
        error: 'invalid user or password'
      });
    }
  });
});

app.post('/logout', (req, res) => {
  delete req.session.login;
  res.send('ok');
});

function auth(req, res, next) {
  if (req.session.login) {
    next();
  } else {
    res.status(401).json({
      error: 'you need to log in'
    });
  }
}

app.get('/status', auth, (req, res) => {
  res.json({
    status: 'ok'
  });
});

app.get('/api/users', auth, (req, res) => {
  client.query('SELECT * FROM users ORDER BY id', (err, dbResponse) => {
    res.json(dbResponse.rows.map(transformUser));
  });
});

app.get('/api/users/:id', auth, (req, res) => {
  client.query(`SELECT * FROM users WHERE id = $1`, [+req.params.id], (err, dbResponse) => {
    if (err) {
      res.status(400).send('Unknown error');
    } else if (dbResponse.rows.length === 0) {
      res.status(404).send('Not found');
    } else {
      res.json(transformUser(dbResponse.rows[0]));
    }
  });
});

app.get('/api/todos', auth, (req, res) => {
  client.query('SELECT * FROM todos', (err, dbResponse) => {
    res.send(dbResponse.rows.map(transformTodo));
  });
});

app.get('/api/todos/:id', auth, (req, res) => {
  client.query('SELECT * FROM todos WHERE id = $1', [+req.params.id], (err, dbResponse) => {
    res.json(transformTodo(dbResponse.rows[0]));
  });
});

app.post('/api/users', auth, bodyParser.json(), (req, res) => {
  const { name, email } = req.body;
  client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email], (err, dbResponse) => {
    res.status(201).json({
      id: dbResponse.rows[0].id,
      name,
      email
    });
  });
});

app.put('/api/users/:id', auth, bodyParser.json(), (req, res) => {
  const { name, email } = req.body;
  client.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, +req.params.id], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400).json({error: 'No such user'});
      return;
    }
    res.json(transformUser(dbResponse.rows[0]));
  });
});

app.delete('/api/users/:id', auth, (req, res) => {
  const userId = +req.params.id;
  if (userId === 1) {
    res.status(400).json({error: 'Cannot delete the main user'});
    return;
  }
  client.query('DELETE FROM users WHERE id = $1', [userId], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400).json({error: 'No such user'});
      return;
    }
    res.json({error: null});
  });
});

app.post('/api/todos', auth, bodyParser.json(), (req, res) => {
  const { title, userId } = req.body;
  client.query('INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING id', [title, userId], (err, dbResponse) => {
    res.status(201);
    res.json({
      id: dbResponse.rows[0].id,
      title,
      userId
    });
  });
});

app.put('/api/todos/:id', auth, bodyParser.json(), (req, res) => {
  const { title, userId } = req.body;
  client.query('UPDATE todos SET title = $1, user_id = $2 WHERE id = $3 RETURNING *', [title, userId, +req.params.id], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400).json({error: 'No such todo'});
      return;
    }
    res.json(transformTodo(dbResponse.rows[0]));
  });
});

app.delete('/api/todos/:id', auth, (req, res) => {
  client.query('DELETE FROM todos WHERE id = $1', [+req.params.id], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400).json({error: 'No such todo'});
      return;
    }
    res.json({error: null});
  });
});

app.use(express.static(path.join(__dirname, 'front/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/build/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
