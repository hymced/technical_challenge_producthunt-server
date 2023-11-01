import express, { Application } from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";

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
};