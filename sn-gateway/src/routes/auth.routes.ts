import { Router } from "express";
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import logger from '../logger';

const router = Router();

const proxyOptions: Options = {
    target: process.env.USERS_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    autoRewrite: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            logger.info(`Proxy request: ${req.method} ${req.url} -> ${proxyOptions.target}${req.url}`);
        },
        error: (err, req, res) => {
            logger.error(`Proxy error: ${err.message}`);
        },
        proxyRes: (proxyRes, req, res) => {
            logger.info(`Proxy response: ${proxyRes.statusCode} from ${proxyOptions.target}${req.url}`);
        }
    },
    followRedirects: true,
    timeout: 5000,
    proxyTimeout: 5000,
    pathRewrite: {
        '^/api/auth': '/api/auth',
    },
}

router.use('/', createProxyMiddleware(proxyOptions))
  
export default router;
