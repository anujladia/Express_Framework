const request = require('superagent');
const bizSdk = require('facebook-nodejs-business-sdk');

const auth = require('../../config/auth');

function setError(res, error, err) {
  return res.json({
    success: false,
    error: error,
    err: err
  });
}

// TODO: Use the user access token from the database
// API to fetch Ad accounts of the user from FB
function fetchAdAccountsViaFB(req, res, next) {
  console.log(req.body);
  request
    .get('https://graph.facebook.com/v3.2/me/adaccounts?fields=id')
    .query({'access_token': auth.facebook.token})
    .then((result) => {
      const data = JSON.parse(result.text);
      const account = data.data;
      const paging = data.paging ? data.paging : null;

      if (paging.next) {
        res.json({
          success: true,
          data: account,
          next: paging.next
        });
      } else {
        if (account.length > 0) {
          res.json({
            success: true,
            data: account
          });
        } else {
          res.json({
            success: false,
            error: 'Ad Account not created'
          });
        }
      }
    })
    .catch(err => {
      res.json({
        success: false,
        error: 'Error Fetching Ad Accounts',
        err: err
      });
    });
}

// API to store the Ad Account selected by the user to the database
function storeAdAccountIdInSX(req, res, next) {
  if (!req.body) return setError(res, 'Fields are required in this API');

  const teamId = req.body.teamId;
  const adAccountId = req.body.adAccountId;

  if (!teamId || !adAccountId) {
    return setError(res, 'Team ID or Ad Account ID is undefined');
  }

  db
    .query(`SELECT accounts FROM team WHERE id = '${teamId}'`)
    .then(data => {
      const qData = data[0];
      if (!qData || !qData['accounts']) return setError(res, 'Accounts not defined in the database');

      let accounts = JSON.parse(qData['accounts']);

      try {
        if (accounts && accounts['facebook']) {
          if (accounts['facebook']['adAccountIds']) {
            const ids = accounts['facebook']['adAccountIds'];

            if (ids.includes(adAccountId)) {
              return setError(res, 'Ad Account ID is already linked to the');
            }

            ids.push(adAccountId);
            accounts['facebook']['adAccountIds'] = ids;
          } else {
            accounts['facebook']['adAccountIds'] = [adAccountId];
          }
        } else {
          accounts['facebook'] = {
            adAccountIds: [adAccountId]
          };
        }
      } catch (err) {
        res.json({
          success: false,
          error: 'Unable to add Ids to the accounts in the database',
          err: err
        });
      }

      db
        .query(`UPDATE team SET accounts = '${JSON.stringify(accounts)}' WHERE id = '${teamId}'`)
        .then(result => {
          res.json({
            success: true,
            data: result
          });
        })
        .catch(err => {
          res.json({
            success: false,
            error: 'Unable to update accounts from the database',
            err: err
          });
        });

      res.json({
        success: true,
        data: accounts
      });
    })
    .catch(err => {
      res.json({
        success: false,
        error: 'Unable to fetch accounts from the database',
        err: err
      });
    });
}

// Read Ad Accounts from the SXDatastore
function readFBAdAccountsViaSX(req, res, next) {
  if (!req.body) return setError(res, 'Fields are required in this API');

  const teamId = req.body.teamId;

  if (!teamId) {
    return setError(res, 'Team ID is undefined');
  }

  db
    .query(`SELECT accounts FROM team WHERE id = '${teamId}'`)
    .then(data => {
      const qData = data[0];
      if (!qData || !qData['accounts']) return setError(res, 'Accounts not defined in the database');

      let accounts = JSON.parse(qData['accounts']);
      console.log(accounts);
      if (accounts && accounts['facebook'] && accounts['facebook']['adAccountIds']) {
        res.json({
          success: true,
          data: accounts['facebook']['adAccountIds']
        });
      } else {
        res.json({
          success: true,
          data: []
        });
      }
    })
    .catch(err => {
      res.json({
        success: false,
        error: 'Unable to fetch accounts from the database',
        err: err
      });
    });
}

// Read the data from the given Ad Account ID
function readSelectedAdAccountFB(req, res, next) {
  if (!req.body) return setError(res, 'Fields are required in this API');

  const adAccountId = req.body.adAccountId;

  if (!adAccountId) {
    return setError(res, 'Ad Account ID is undefined');
  }

  const AdAccount = bizSdk.AdAccount;
  const account = new AdAccount(adAccountId);

  account
    .read([
      AdAccount.Fields.name,
      AdAccount.Fields.business_name,
      AdAccount.Fields.account_status,
      AdAccount.Fields.amount_spent,
      AdAccount.Fields.balance,
      AdAccount.Fields.created_time,
      AdAccount.Fields.min_campaign_group_spend_cap,
      AdAccount.Fields.min_daily_budget,
      AdAccount.Fields.owner,
      AdAccount.Fields.spend_cap,
    ])
    .then((account) => {
      const data = account['_data'];

      if (!data) return setError(res, 'Unable to fetch data from the given Ad Account');

      res.json({
        success: true,
        data: data
      });
    })
    .catch((err) => {
      return setError(res, 'Ad Account ID is not defined', err);
    });
}

module.exports = {
  fetchAdAccountsViaFB,
  storeAdAccountIdInSX,
  readFBAdAccountsViaSX,
  readSelectedAdAccountFB,
};
