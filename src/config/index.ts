import express, { Application } from 'express';
import { config as dotenv } from 'dotenv';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

// dotenv must be configured first
// ES6 imports are hoisted, so imported modules will initialize (in order) before any of the current "imported" module initialization code gets to run 
dotenv(); // .env default
dotenv({ path: ".env.dev.env" });

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:4200";

// Middleware configuration
export default (app: Application) => {
  // To log requests with a different format dependending on the environenment
  if (app.get("env") === "production") {
    app.use(logger("combined"));
  } else {
    app.use(logger("dev"));
  }
  // In case Express is running behind a proxy that some hosting services may use, so that the X-Forwarded-* headers may be trusted (X-Forwarded-For)
  app.set("trust proxy", 1);
  // Protect application from some well-known web vulnerabilities (XSS (Cross-Site Scripting), Cross-Site Request Forgery (CSRF), Clickjacking, Sniffing, etc.) by setting security-related HTTP response headers appropriately 
  app.use(helmet());
  // To have access to `body` property in the request
  app.use(express.json());
  // To allow cross-origin requests
  app.use(
    cors({
      credentials: true,
      origin: [FRONTEND_URL],
    })
  );
  // or manually on a per request basis with
  // res.header("Access-Control-Allow-Origin", "*");
};