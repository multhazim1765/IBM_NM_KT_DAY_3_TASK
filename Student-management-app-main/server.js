const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const FILE = './data.json';

const read = () => JSON.parse(fs.readFileSync(FILE));
const write = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// 👇 NEW: Home route
app.get('/', (req, res) => {
  res.send('Simple CRUD API. Try <a href="/items">/items</a>');
});

app.get('/items', (req, res) => {
  res.json(read());
});

app.get('/items/:id', (req, res) => {
  const items = read();
  const item = items.find(i => i.id == req.params.id);
  item ? res.json(item) : res.status(404).send('Not found');
});

app.post('/items', (req, res) => {
  const items = read();
  const newItem = { id: Date.now(), ...req.body };
  write([...items, newItem]);
  res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
  let items = read();
  items = items.map(i => i.id == req.params.id ? { ...i, ...req.body } : i);
  write(items);
  res.json(items.find(i => i.id == req.params.id));
});

app.delete('/items/:id', (req, res) => {
  let items = read();
  const filtered = items.filter(i => i.id != req.params.id);
  if (items.length === filtered.length) return res.status(404).send('Not found');
  write(filtered);
  res.status(204).send();
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
