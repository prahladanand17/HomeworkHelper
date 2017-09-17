const express = require('express');
const bodyParser = require('body-parser');
const { Client, Pool } = require('pg');
const cors = require('cors');

const client = new Client({
    connectionString: 'postgres://fskxuwlapijkqn:42c90b3eaad0ef15e0360094b4e5c94b9864d0872784c5ecbd96cff105e5f0e4@ec2-107-20-255-96.compute-1.amazonaws.com:5432/d1fh9mu9ubk340?ssl=true',
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
});

(async function () {
    const app = express();
    const connections = [];
    const pool = new Pool();

    async function query(q) {
        return new Promise(function (resolve, reject) {
            console.log("Executing query" + q);
            pool.query(q, function (err, result) {

                if (err) return reject(err);
                console.log("Finished query " + q);
                return resolve(result.rows);

            });
        });
    }


    async function getFunctions(subject) {
        return await query("SELECT * FROM paldata where subject='"+ subject+"'")
    }

    await query("CREATE TABLE IF NOT EXISTS PalData (subject" + " VARCHAR(50), formula VARCHAR(500))");


    app.use(express.static('.'));
    app.use(bodyParser.json());
    app.use(cors());
    app.options('*', cors());

    app.get('/functions/:subject', async function (req, res) {
        res.status(200).send(await getFunctions(req.param.subject))
    });
    app.listen(8080);

})();