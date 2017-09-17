const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');


(async function () {
    const app = express();
    const connections = [];
    const pool = new pg.Pool();

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


    async function getFunctions() {
        return await query("SELECT * FROM subject")
    }


    app.use(express.static('.'));
    app.use(bodyParser.json());

    app.put('/register/:subject', async function (req, res) {
        res.status(200).send(await registerUser(req.params.nick))
    });

    app.get('/messages', function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        res.sendEvent = function (type, data) {
            res.write(`event: ${type}\ndata: ${JSON.stringify(data).split('\n').join('\ndata: ')}\n\n`);
        };
        connections.push(res);
    });

    app.listen(8080);

})();