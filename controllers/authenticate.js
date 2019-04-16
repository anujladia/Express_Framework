const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const auth = require('../config/auth');
const app = require('../config/app');

// Create User Authentication Table in the database
function authenticateUser(req, res, next) {
  let userId = req.body.userId ? req.body.userId : '';
  let password = req.body.password ? req.body.userId : '';

  if (process.env.ENV === 'development') {
    userId = auth.storyxpress.testID;
    password = auth.storyxpress.testPassword;
  }
  
  // Encrypting the password with sha512
  const hash = crypto.createHash('sha512').update(password).digest('hex');

  db.query(`SELECT password FROM user WHERE email = '${userId}'`)
    .then(user => {
      if (!user || user && user.length <= 0) {
        res.render('index', {
          title: 'User name not found in our system',
        });
      }

      const userPassword = user[0].password;

      if (hash !== userPassword) {
        res.render('index', {
          title: 'Wrong Password or Username',
        });
      }

      if (hash === userPassword) {
        // create payload for the JWT
        const payload = {
          user: userId
        };

        // Using a 256 bit RSA key as Private Key
        const privateKey = fs.readFileSync('./private.key', 'utf8');
        const verifyOptions = {
          issuer: auth.jwt.issuer,
          audience: userId,
          expiresIn: '7 days', // expires in 7 days
          algorithm: 'RS256'
        };
        // const token = jwt.sign(payload, auth.jwt.key, {
        const token = jwt.sign(payload, privateKey, verifyOptions);

        res.render('show', {
          title: 'User Autheticated',
          id: 'JWT Token',
          content: token
        });
        return;
      }
    })
    .catch(err => {
      console.log(err);
      if (err) {
        res.redirect('/');
      }
    });
}

module.exports = authenticateUser;
