import express from 'express';
import EpitechAPI from './api.js';


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

app.get('/', function (req, res) {
    res.send("OK.");
});

app.post('/', function (req, res) {
    const cookies = [];

    fetch(`GET`, req.body.autologin, { cookies }).then(async () => {
        let user    = await fetch(`GET`, `https://intra.epitech.eu/user/?format=json`, { cookies });
        let modules = await fetch(`GET`, `https://intra.epitech.eu/course/filter?format=json`, { cookies });
        let planning = await fetch(`GET`, `https://intra.epitech.eu/planning/load?format=json&start=2021-01-01&end=2021-12-31`, { cookies });

    }).catch(console.error);
});


//////////////////////////////////////////////
//  MAIN
//////////////////////////////////////////////


app.listen(8080, '0.0.0.0', () => {
    console.log('Server started.');
});