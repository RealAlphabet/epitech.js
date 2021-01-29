import path from 'path';
import express from 'express';
import { loginOffice365 } from './api.js';


//////////////////////////////////////////////
//  GLOBALS
//////////////////////////////////////////////


const CONNECTIONS = new Map();


//////////////////////////////////////////////
//  EXPRESS
//////////////////////////////////////////////


const app = express();

app.disable('x-powered-by');
app.use(express.json());


//////////////////////////////////////////////
//  API
//////////////////////////////////////////////


app.get('/api/me', function (req, res) {
    res.json(CONNECTIONS.get('guest'));
});

app.get('/api/marvin', function (req, res) {
    let epitech = CONNECTIONS.get('guest').epitech;

    epitech.fetchMyEpitechModules().then(modules => {
        res.json(modules);
    });
});

app.post('/api/auth', function (req, res) {
    loginOffice365(req.body.office365).then(epitech => {
        epitech.fetchIntraMe().then(user => {
            CONNECTIONS.set('guest', {
                user,
                epitech
            });

            res.status(201).send();
        }).catch(console.error);
    });
});


//////////////////////////////////////////////
//  PUBLIC
//////////////////////////////////////////////


app.use(express.static('public'));

app.use(function (req, res) {
    res.sendFile(path.resolve('./public', 'index.html'));
});


//////////////////////////////////////////////
//  MAIN
//////////////////////////////////////////////


app.listen(8080, '0.0.0.0', () => {
    console.log('Server started.');
});