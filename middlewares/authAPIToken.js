const fs = require('fs');
const jwt = require('jsonwebtoken');
const auth = require('../config/auth');

function authAPIToken(req, res, next) {
  const token = req.headers['x-access-token'];

  const verifyOptions = {
    algorithm: ['RS256']
  };
  const publicKEY  = fs.readFileSync('./public.key', 'utf8');

  if (token) {
    jwt.verify(token, publicKEY, verifyOptions, (err, decoded) => {
      // status 403 forbidden
      if (err) {
        return res
        .status(403)
        .json({ success: false, message: 'Failed to authenticate jwt token.' });
      } else {
        // if everything is good, save to request for use in other routes
        // req.decoded = decoded;
        console.log('JWT Token autheticated');
        console.log(decoded);
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res
    .status(403)
    .send({ 
      success: false, 
      message: 'No JWT auth token provided.' 
    });
  }
}

module.exports = authAPIToken;