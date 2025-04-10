import express, {Application} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './logger';

import authRoutes from './routes/auth.routes';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

const env = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: env });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
})

app.use('/api/auth', authRoutes);

app.listen(PORT || 3000, () => {
    logger.info(`Server is running on port ${PORT || 3000}`);
});