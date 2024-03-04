'use strict';

import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import staticServe from 'serve-static';
import { create } from 'express-handlebars';
import appRouter from './routes/app';

const app = express();

/* Handlebars setup */
const hbs = create({ extname: '.hbs' });
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

/* Middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression({ threshold: 150, level: 9 }));
app.use('/assets/', staticServe(path.join(__dirname, 'public')));

/* Routes */
app.use('/', appRouter);

/* Error handling */
app.use((err: Error, _req: Request, res: Response) => {
    console.error(err);
    res.status(500).send('Server Error');
});

/* Start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});