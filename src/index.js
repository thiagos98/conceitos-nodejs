const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user) return response.status(404).json({ error: "User not found!" });

  request.user = user;

  next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const currentUser = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  const user = users.find((user) => user.username === username);
  if(user) return response.status(400).json({ error: "User its exists"});

  users.push(currentUser);

  return response.status(201).json(currentUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo) return response.status(404).json({ error: "Todo not exists." });

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo) return response.status(404).json({ error: "Todo not exists" });
  todo.done = true;

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo) return response.status(404).json({ error: "Todo not exists" });

  user.todos.splice(todo, 1);

  return response.status(204).json();
});

module.exports = app;