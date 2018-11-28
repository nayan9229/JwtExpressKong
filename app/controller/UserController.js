'use strict';

const database = require('../utils/database');

exports.me = function(req, res) {
    let queryUsername = 'SELECT Id, username, name, birthDate from User where Id = "' + req.userId + '" limit 1';
    const db = database.getPool();
    db.get(queryUsername, function(err, user) {
        if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
        if (!user) return res.status(404).send({ error: 1, message: 'No user found.' });
        res.status(200).send(user);
        database.closePool(db);
    });
};

exports.update = function(req, res){
    const name = (req.body.name) ? req.body.name : null;
    const birthDate = (req.body.birthDate) ? req.body.birthDate : null;
    
    if(name || birthDate){
        let queryUpdate = 'UPDATE User SET ';
        if(name) {
            queryUpdate = queryUpdate + 'name = "'+name+'" ';
            if(birthDate) queryUpdate = queryUpdate + ', birthDate = '+birthDate;  
        }else if(birthDate) queryUpdate = queryUpdate + ' birthDate = '+birthDate;
        queryUpdate = queryUpdate + ' where Id = '+req.userId;
        
        const db = database.getPool();
        db.get(queryUpdate, function(err, user) {
            if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
            res.status(200).send({ error: 0, message: "User information Updated!" });
            database.closePool(db);
        });
    }else return res.status(400).send({ error: 1, message: "Please fill the required fields" });
};

exports.delete = function(req, res){
    let queryDelete = 'delete from User where Id = '+req.userId;
    const db = database.getPool();
    db.get(queryDelete, function(err, user) {
        if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
        res.status(200).send({ error: 0, message: "You are removed from the system!" });
        database.closePool(db);
    });
}

exports.getUserList = function(req, res){
     let query = `SELECT Id, username, name, birthDate FROM User`;
    if (req.query.username) {
        query += ` WHERE username LIKE "${req.query.username}"`;
    } else if (req.query.id) {
        query += ` WHERE Id = '${req.query.id}'`;
    }
    const db = database.getPool();
    db.all(query, function(err, users) {
        if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
        if (!users) return res.status(404).send({ error: 1, message: 'No user found.' });
        res.status(200).send(users);
        database.closePool(db);
    });
}