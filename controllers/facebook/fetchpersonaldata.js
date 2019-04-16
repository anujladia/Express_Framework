const request = require('superagent');
const auth = require('../../config/auth');

// Create Campaign Table in the database
function fetchMyData(req, res, next) {
  request
    .get('https://graph.facebook.com/v3.2/me')
    // .set('fields', ['id','name'])
    // .set('access_token', auth.facebook.token)
    .query({'access_token': auth.facebook.token})
    .then((result) => {
      const data = JSON.parse(result.text);
      console.log(data);
      res.json({
        id: data.id,
        name: data.name,
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        error: 'Not Found'
      });
    });
}

module.exports = fetchMyData;
