import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from './middlewares/error.middleware.js';
import { NotFoundError } from './middlewares/errors.js';
import { authRouter } from "./routes/auth.routes.js";
import { profilesRouter } from "./routes/profiles.routes.js";
import { postsRouter } from "./routes/posts.routes.js";
import { commentsRouter } from "./routes/comments.routes.js";
import { usersRouter } from "./routes/users.routes.js";

export const app = express();
app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: "healthy",
        timeStamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);



app.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);