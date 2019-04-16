// const bizSdk = require('facebook-nodejs-business-sdk');

const auth = require('../../config/auth');

const accessToken = auth.facebook.token;
const accountId = 'act_616766972100319';

function fetchCampaigns(req, res, next) {
  // try {
  //   const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
  // } catch(err) {
  //   console.log(err);
  //   console.log('errorssss');
  //   res.json({
  //     error: 'Access Token is incorrect',
  //     err: err
  //   });
  //   return;
  // }

  const AdAccount = bizSdk.AdAccount;
  const Campaign = bizSdk.Campaign;

  const account = new AdAccount(accountId);
  var campaigns;

  account
    .read([AdAccount.Fields.name])
    .then((account) =>{
      return account.getCampaigns([Campaign.Fields.name], { limit: 10 }) // fields array and params
    })
    .then((result) =>{
      campaigns = result
      campaigns.forEach((campaign) =>console.log(campaign.name));
      res.json({
        data: campaigns
      });
    })
    .catch((err) => {
      res.json({
        error: 'Some Error',
        err: err
      })
    });
}

module.exports = fetchCampaigns;
