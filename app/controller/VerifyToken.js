'use strict';

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const secret = 'DCT6IEjxOCFoPZGNxHeJhB0EncyJARsF';
function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  // const token = req.headers['x-access-token'];
  // console.log(req.headers);
  // const token = req.headers['authorization'];
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  console.log(token);
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, secret, function(err, decoded) {    
    if (err) 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  });
}
module.exports = verifyToken;