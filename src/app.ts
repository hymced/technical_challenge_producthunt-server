import express from 'express';
import { Express } from 'express';

import { config as dotenv } from 'dotenv';
import config from './config';

import indexRouter from './routes/index.routes';
import postsRouter from './routes/post.routes';

import errorHandling from './error-handling';

dotenv(); // .env default
dotenv({ path: ".env.dev.env" });

const app: Express = express();

config(app);

app.use("/api", indexRouter);
app.use("/api/posts", postsRouter);

errorHandling(app);

export default app;