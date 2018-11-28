'use strict';

const auth = require('../controller/AuthController.js');
const VerifyToken = require('../controller/VerifyToken');
const user = require('../controller/UserController.js');
const lock = require('../controller/LockController.js');

module.exports = function(app) {
  app.use('/ping', function(req, res, next) {
      return res.json({message:'pong'});
  });
  
  app.post('/register', auth.register);
  app.post('/login', auth.login);
  app.get('/logout', auth.logout);
  app.get('/me', VerifyToken, user.me);

  app.put('/user/update', VerifyToken, user.update);
  app.patch('/user/update', VerifyToken, user.update);
  app.delete('/user/delete', VerifyToken, user.delete);
  app.get('/user/list', VerifyToken, user.getUserList);
  
  app.post('/lock/create', VerifyToken, lock.createLock);
  app.put('/lock/:id/update', VerifyToken, lock.updateLock);
  app.patch('/lock/:id/update', VerifyToken, lock.updateLock);
  app.delete('/lock/:id/delete', VerifyToken, lock.deleteLock);
  app.get('/lock/list', VerifyToken, lock.getLockList);

  app.use('/*', function (req,res,next) {
        res.status(400);
		return res.json({error:true, message:'No Api Found', data:null});
	});
};