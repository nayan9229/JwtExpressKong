'use strict';

const database = require('../utils/database');

var query = `CREATE TABLE User (
    Id INTEGER NOT NULL primary key autoincrement,
    username varchar(255) NOT NULL,
	name varchar(255) NOT NULL,
  	password varchar(255) NOT NULL,
    birthDate varchar(255)
);`;

database.execute(query, function(err, data) {
	console.log(err);
	console.log(data);
});


var query1 = `CREATE TABLE Lock (
    Id integer NOT NULL primary key autoincrement,
    macId varchar(255) NOT NULL,
	name varchar(255) NOT NULL,
  	user integer,
  FOREIGN KEY(user) REFERENCES User(Id)
);`;

database.execute(query1, function(err, data) {
	console.log(err);
	console.log(data);
});

let queryUsername = 'SELECT username from User';

database.execute(queryUsername, function(err, data) {
	console.log(err);
	console.log(data);
});