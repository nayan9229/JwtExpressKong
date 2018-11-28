'use strict';

const database = require('../utils/database');
const uuidv4 = require('uuid/v4');

exports.createLock = function(req, res) {
    let name = req.body.name;
    let macId = uuidv4();

    let query = `SELECT * FROM Lock WHERE user = '${req.userId}' AND name LIKE "${name}"`;
    const db = database.getPool();
    db.all(query, function(err, locks) {
        if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
        if (locks && locks.length > 0) {
            res.status(400).send({ error: 1, message: "Already exists with that one" });
        }
        else {
            let queryInsert = 'INSERT INTO Lock (name, macId, user) values ("' + name + '", "' + macId + '", ' + req.userId + ')';
            db.run(queryInsert, function(err) {
                if (err) return res.status(500).send({ error: 1, message: "There was a problem registering the user`." });
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                res.status(201).send({ error: 0, message: "lock Created successfully!" });
            });
        }
        database.closePool(db);
    });
}


exports.updateLock = function(req, res) {
    const name = (req.body.name) ? req.body.name : null;
    const Id = req.params.id;
    if (!Id) return res.status(400).send({ auth: false, message: 'No id provided.' });

    if (name) {
        const db = database.getPool();
        let query = `SELECT * FROM Lock WHERE user = '${req.userId}' AND Id = "${Id}"`;
        db.all(query, function(err, locks) {
            if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
            if (locks && locks.length > 0) {
                let queryUpdate = 'UPDATE Lock SET ';
                queryUpdate = queryUpdate + 'name = "' + name + '" ';
                queryUpdate = queryUpdate + ' where Id = ' + Id;

                db.get(queryUpdate, function(err, user) {
                    if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
                    res.status(200).send({ error: 0, message: "User information Updated!" });
                    database.closePool(db);
                });
            }
            else {
                database.closePool(db);
                res.status(400).send({ error: 1, message: "No Lock Found for given Id" });
            }

        });
    }
    else return res.status(400).send({ error: 1, message: "Please fill the required fields" });
};

exports.deleteLock = function(req, res) {
    const Id = req.params.id;
    if (!Id) return res.status(400).send({ auth: false, message: 'No id provided.' });
    let query = `SELECT * FROM Lock WHERE user = '${req.userId}' AND Id = "${Id}"`;
    const db = database.getPool();
    db.all(query, function(err, locks) {
        if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
        if (locks && locks.length > 0) {
            let queryDelete = 'delete from Lock where Id = ' + Id;

            db.get(queryDelete, function(err, user) {
                if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
                res.status(200).send({ error: 0, message: "lock removed from the system!" });
                database.closePool(db);
            });
        }
        else {
            database.closePool(db);
            res.status(400).send({ error: 1, message: "No Lock Found for given Id" });
        }
    });
}

exports.getLockList = function(req, res) {
    let query = `SELECT *FROM Lock WHERE user = '${req.userId}' `;
    if (req.query.macId) {
        query += `AND WHERE macId LIKE = "${req.query.macId}"`;
    }
    else if (req.query.id) {
        query += `AND WHERE Id = '${req.query.id}'`;
    }
    const db = database.getPool();
    db.all(query, function(err, users) {
        if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
        if (!users) return res.status(404).send({ error: 1, message: 'No Lock found.' });
        res.status(200).send(users);
        database.closePool(db);
    });
}