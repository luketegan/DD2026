// Initialize express application
const express = require('express')
const app = express()
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('about', (req, res) => {
  res.send('This is the about page');
});

app.post('about', (req, res) => {
  res.send('This is a post request to the about page');
});

app.put('about', (req, res) => {
  res.send('This is a put request to the about page');
});

app.delete('about', (req, res) => {
  res.send('This is a delete request to the about page');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
