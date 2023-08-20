import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import rootRouter from './routes/index.js';
import handlerError from './middlewares/handlerError.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

config();
const { DEV_PORT, PROD_PORT, HOST, DB, ORIGIN } = process.env;
const PORT = process.env.NODE_ENV == 'production' ? PROD_PORT : DEV_PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP
});

mongoose.connect(HOST + DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors({
  credentials: true,
  origin: ORIGIN
}));

app.use(helmet());

app.use(limiter);

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', rootRouter);

app.use(errorLogger);

app.use(errors());

app.use(handlerError);

app.listen(PORT);

console.log('Rerun')
