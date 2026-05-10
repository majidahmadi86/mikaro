/**
 * VPS Phase 2 — Express security stack (not deployed).
 * Wire into app after: npm install helmet express-rate-limit cors jsonwebtoken
 */
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

function securityMiddleware(app) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://www.googletagmanager.com", "https://fonts.googleapis.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", "https://api.anthropic.com"],
          frameAncestors: ["'none'"],
        },
      },
    })
  );

  app.use(
    cors({
      origin: "https://mikaro.studio",
      methods: ["GET", "POST", "OPTIONS"],
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
  });

  app.use("/api/contact", contactLimiter);

  // JWT skeleton — attach real verification when auth is added
  function jwtOptional(req, res, next) {
    req.auth = null;
    next();
  }

  return { jwtOptional };
}

module.exports = { securityMiddleware };
