import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import rootRouter from './routes/index.js';
import handlerError from './middlewares/handlerError.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

config();
const { DEV_PORT } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(helmet());

app.use(limiter);

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);

app.use('/', rootRouter);

app.use(errorLogger);

app.use(errors());

app.use(handlerError);

app.listen(DEV_PORT);
