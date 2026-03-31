import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api', router);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
