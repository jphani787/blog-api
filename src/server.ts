import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import type {CorsOptions} from 'cors';
import config from '@/config';
import limiter from '@/lib/express-rate-limit';
import v1Routes from '@/routes/v1';
import {connectToDatabase,disconnectFromDatabase} from '@/lib/mongoose';
import {logger } from '@/lib/winston';
const app = express();

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if(config.NODE_ENV === 'development' || !origin 
            || config.WHITELIST_ORIGINS.includes(origin)){
                callback(null, true);
        }else {
            callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
            console.log(`CORS error: ${origin} is not allowed by CORS`);
        }
    }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());
app.use(compression({threshold: 1024}));
app.use(helmet());
app.use(limiter);

(async()=>{
    try {
        await connectToDatabase();
        app.use('/api/v1', v1Routes);

        app.listen(config.PORT, ()=>{
            logger.info(`Server running at http://localhost:${config.PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start the server', error);
        if(config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();


const handleServerShutdown = async () => {
    try {
        await disconnectFromDatabase();
        logger.warn('Server SHUTDOWN');
        process.exit(0);
    } catch (error) {
        logger.error('Error during server shutdown', error);
    }
}

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);


