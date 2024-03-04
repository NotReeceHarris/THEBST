'use strict';

import path from 'path';
import dotenv from 'dotenv';

import compression from 'compression';
import staticServe from 'serve-static';
import sequelize from './database';
import { create } from 'express-handlebars';
import express, { Request, Response } from 'express';

dotenv.config()
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
import appRouter from './routes/app';
app.use('/', appRouter);

/* Error handling */
app.use(async (req: Request, res: Response) => {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        return res.send('Not found'); // set to your 404 html page
    }

    // respond with json
    if (req.accepts('json')) {
        return res.json({ error: 'Not found' });
    }

    // default to plain-text. send()
    return res.type('txt').send('Not found');
});

app.use(function(err, req, res, next){
    res.status(500);

    // respond with html page
    if (req.accepts('html')) {
        return res.send('Internal Server Error'); // set to your 500 html page
    }

    // respond with json
    if (req.accepts('json')) {
        return res.json({ error: 'Internal Server Error' });
    }

    // default to plain-text. send()
    return res.type('txt').send('Internal Server Error');
});

/* Start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});