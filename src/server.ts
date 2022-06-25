import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import queues from './queues';

import api from './api';

import * as expressListRoutes from 'express-list-routes';
const app = express();

app.use(cors());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: { write: (msg) => console.log(msg) },
  }),
);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(api);
const serverAdapter = new ExpressAdapter();
const adaptedQueues = Object.values(queues).map(q=> new BullAdapter(q));
createBullBoard({ serverAdapter, queues: adaptedQueues});
serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Aplicação - Ativa :D | ${port}`);
  console.log(`Admin: http://localhost:${port}/admin/queue`);
  expressListRoutes(app, { prefix: '' });
});
