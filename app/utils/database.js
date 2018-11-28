'use strict';

const dbConfig = require('../config/db');
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const dbPath = path.resolve(__dirname, 'apis.db');

module.exports = {
    getPool: function() {
        return new sqlite3.Database(dbPath);
    },
    closePool: function(db) {
        db.close((err) => { if (err) { console.error(err.message); } console.log('Close the database connection.'); });
    },
    execute: function(query, callback) {
        const db = new sqlite3.Database(dbPath);
        db.serialize(() => {
            db.each(query, (data) => {
                callback(0, data);
                db.close((err) => { if (err) { console.error(err.message); } console.log('Close the database connection.'); });
            });
        });
    }
};
