import express from 'express';
import { Worker } from './worker';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const worker = new Worker();
worker.start();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
