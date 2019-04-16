const request = require('superagent');
const uuidv1 = require('uuid/v1');

const setError = require('../../util/createErrorLog');

/*
  Function to set the users access token in the database and return the token Id
*/
function setFBAccessToken(req, res, next) {
  if (!req.body) return setError(res, 'Fields are required in this API');

  const teamId = req.body.teamId;
  const accessToken = req.body.accessToken;

  if (!teamId || !accessToken) {
    return setError(res, 'Team ID or Fb Access Token is undefined');
  }

  db
    .query(`SELECT accounts FROM team WHERE id = '${teamId}'`)
    .then(data => {
      const qData = data[0];
      if (!qData || !qData['accounts']) return setError(res, 'Accounts not defined in the database');

      let accounts = JSON.parse(qData['accounts']);

      let id = uuidv1();
      try {
        if (accounts && accounts['facebook']) {
          if (accounts['facebook']['id']) {
            id = accounts['facebook']['id'];
            accounts['facebook']['accessToken'] = accessToken;
          } else {
            accounts['facebook'] = {
              id,
              accessToken
            };
          }
        } else {
          accounts['facebook'] = {
            id,
            accessToken
          };
        }
      } catch (err) {
        return setError(res, 'Unable to add Token to the accounts in the database', err);
      }

      db
        .query(`UPDATE team SET accounts = '${JSON.stringify(accounts)}' WHERE id = '${teamId}'`)
        .then(result => {
          res.json({
            success: true,
            data: {
              accessTokenId: id
            }
          });
        })
        .catch(err => {
          return setError(res, 'Unable to update accounts from the database', err);
        });
    })
    .catch(err => {
      return setError(res, 'Unable to fetch accounts from the database', err);
    });
}

/*
  Function to fetch the token from the database with the Token ID and team Id
*/
function getFBAccessToken(teamId, id) {
  return new Promise((resolve, reject) => {
    if (!id) return reject('Id not defined');

    db
      .query(`SELECT accounts FROM team WHERE id = '${teamId}'`)
      .then(data => {
        const qData = data[0];
        if (!qData || !qData['accounts']) return reject('Accounts not defined in the database');

        let accounts = JSON.parse(qData['accounts']);

        try {
          if (accounts && accounts['facebook'] && accounts['facebook']['id'] &&
            accounts['facebook']['id'] === id && accounts['facebook']['accessToken']) {
            resolve(accounts['facebook']['accessToken']);
          } else {
            reject(res, 'Unable to get Access Token from the given Id', err);
          }
        } catch (err) {
          reject('Unable to get Access Token from the given Id');
        }
      })
      .catch(err => {
        reject('Unable to fetch accounts from the database');
      });    
  });
}

/*
  Function to fetch the token from the dataabase with the Token ID and
  Check if the token id valid or not.
*/
function checkFBAccessToken(req, res, next) {
  if (!req.body) return setError(res, 'Fields are required in this API');

  const teamId = req.body.teamId;
  const accessTokenId = req.body.fbAccessTokenId;

  if (!teamId || !accessTokenId) {
    return setError(res, 'Team ID or Fb Access Token Id is undefined');
  }

  getFBAccessToken(teamId, accessTokenId)
    .then(token => {
      request
        .get(`https://graph.facebook.com/v3.2/debug_token?input_token=${token}`)
        .query({'access_token': token})
        .then((result) => {
          const data = JSON.parse(result.text);

          if (data.data && data.data.is_valid) {
            console.log('FB Access token is valid');
            res.json({
              success: true,
              data: {
                token
              }
            });
          } else {
            return setError(res, 'Invalid Access Token');
          }
        })
        .catch(err => {
          return setError(res, 'Failed Graph API call to debug access token', err);
        });
    })
    .catch(err => {
      setError(res, err)
    });
}

module.exports = { setFBAccessToken, checkFBAccessToken };
