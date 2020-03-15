require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
//const cors = require('cors');
const session = require("express-session");
const crypto = require('crypto');
const app = express();
const port = +process.env.PORT || 5000;
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

function hash(password) {
  return crypto.createHmac('sha256', 'abcdefg').update(password).digest('hex');
}

client.connect();

//app.use(cors());

app.use(session({
  secret: 'abc',
  resave: true,
  saveUninitialized: false,
  cookie: { httpOnly: false , }
}));

app.post('/login', bodyParser.json(), (req, res) => {
  const { login, password } = req.body;
  client.query( 'SELECT * FROM users WHERE login = $1 AND password = $2', [login, hash(password)], (err, dbResponse) => {
    if (dbResponse.rows.length > 0) {
      req.session.login = login;
      res.json({
        status: 'ok'
      });
    } else {
      res.status(401).json({
        error: 'invalid user or Password'
      });
    }
  })
});

app.get('/api/users', (req, res) => {
  if (req.session.login) {
    client.query('SELECT * FROM users ORDER BY id', (err, dbResponse) => {
      res.json(dbResponse.rows);
    });
  } else {
    res.status(401).json({
      error: 'you need to login'
    });
  }
});

app.get('/api/users/:id', (req, res) => {
  client.query(`SELECT * FROM users WHERE id = $1`, [+req.params.id], (err, dbResponse) => {
    if (err) {
      res.status(400).send('Unknown error')
    } else if (dbResponse.rows.length === 0) {
      res.status(404).send('Not found')
    } else {
      res.json(dbResponse.rows[0]);
    }
  });
});

app.get('/api/todos', (req, res) => {
  client.query('SELECT * FROM todos', (err, dbResponse) => {
    res.send(dbResponse.rows);
  })
});

app.get('/api/todos/:id', (req, res) => {
  client.query(`SELECT * FROM todos WHERE id = $1`, [+req.params.id], (err, dbResponse) => {
    res.json(dbResponse.rows[0]);
  });
  res.json(todos.find(todo => todo.id === +req.params.id));
});

app.post('/api/users', bodyParser.json(), (req, res) => {
  const { name, email } = req.body;
  client.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email], (err, dbResponse) => {
    res.status(201);
    res.json({
      id: dbResponse.rows[0].id,
      name,
      email,
  });
  });
});

app.post('/api/todos', bodyParser.json(), (req, res) => {
  const { title, user_id } = req.body;
  client.query('INSERT INTO todos (title, user_id) VALUES  ($1, $2) RETURNING id', [title, user_id], (err, dbResponse) => {
    res.status(201);
    res.json({
      id: dbResponse.rows[0].id,
      title,
      user_id,
    })
  })
});

app.put('/api/users/:id', bodyParser.json(), (req, res) => {
  const { name, email } = req.body;
  client.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, +req.params.id], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400).json({error: 'No such user'});
      return;
    }
    res.json(dbResponse.rows[0])
  });
});

app.put('/api/todos/:id', bodyParser.json(), (req, res) => {
  const { title, user_id } = req.body;
  client.query('UPDATE todos SET title = $1, user_id = $2 WHERE id = $3 RETURNING *', [title, user_id, +req.params.id], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400).json({error: 'No such todo'});
      return;
    }
    res.json(dbResponse.rows[0])
  });
});

app.delete('/api/users/:id', (req, res) => {
  client.query('DELETE FROM users WHERE id = $1', [+req.params.id], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400);
      res.json({error: 'No such user'});
      return;
    }
    res.json({error: null})
  });
});

app.delete('/api/todos/:id', (req, res) => {
  client.query('DELETE FROM todos WHERE id = $1', [+req.params.id], (err, dbResponse) => {
    if (dbResponse.rowCount === 0) {
      res.status(400).json({error: 'No such user'});
      return;
    }
    res.json({error: null})
  });
});

app.use(express.static(path.join(__dirname, 'front/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/build/index.html'));
});

app.listen(5000, () => {
  console.log(`Example app listening on port ${port}!`);
});
