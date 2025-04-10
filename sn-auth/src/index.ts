import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './swagger';
import { createConnection } from './utils/db';
import logger from './logger';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

setupSwagger(app);
createConnection();

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
})

app.use('/', userRoutes);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});