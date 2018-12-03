'use strict';

const database = require('../utils/database');
const bodyParser = require('body-parser');
const secret = 'DCT6IEjxOCFoPZGNxHeJhB0EncyJARsF';

/**
 * Configure JWT
 */
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs');

exports.login = function(req, res) {
    let queryUsername = 'SELECT *from User where username = "' + req.body.username + '" limit 1';
    const db = database.getPool();
    db.get(queryUsername, function(err, user) {
        if (err) return res.status(500).send({ error: 1, message: "Error on the server." });
        if (!user) return res.status(404).send({ error: 1, message: 'No user found.' });
        console.log(user);

        // check if the password is valid
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: user.Id, username: user.username }, secret, {
            expiresIn: 86400 * 7, // expires in 7 days hours
            issuer:'DCT6IEjxOCFoPZGNxHeJhB0EncyJARsF' //iss from kong
        });
        // return the information including token as JSON
        res.status(200).send({ auth: true, token: token });
        database.closePool(db);
    });
};

exports.logout = function(req, res){
    res.status(200).send({ auth: false, token: null });
}

exports.register = function(req, res) {
    let username = req.body.username;
    let name = req.body.name;
    let password = req.body.password;
    let birthDate = req.body.birthDate;
    let hashedPassword = bcrypt.hashSync(password, 8);

    const db = database.getPool();

    let queryUsername = 'SELECT username from User where username = "' + username + '" limit 1';
    db.get(queryUsername, function(err, row) {
        console.log(err);
        if (err) return res.status(500).send({ error: 1, message: "There was a problem registering the user`." });
        
        console.log(row);
        if (row) {
            database.closePool(db);
            res.status(400).send({ error: 1, message: "User name alrady available." });
        }
        else {
            let queryInsert = 'INSERT INTO User (username, name, password, birthDate) values ("' + username + '", "' + name + '", "' + hashedPassword + '", "' +birthDate + '" )';
            console.log(queryInsert);
            db.run(queryInsert, function(err) {
                if (err) return res.status(500).send({ error: 1, message: "There was a problem registering the user`." });
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                
                //Replace this block with Kong JWT method.
                var token = jwt.sign({ id: this.lastID, username: username }, secret, {
                    expiresIn: 86400 * 7 , // expires in 7 days
                    issuer:'DCT6IEjxOCFoPZGNxHeJhB0EncyJARsF' //iss from kong
                });
                
                
                res.status(200).send({ auth: true, token: token, error: 0 });
                database.closePool(db);
            });
        }
    });
};
