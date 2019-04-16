const bizSdk = require('facebook-nodejs-business-sdk');

const auth = require('../config/auth');

function initFBBizSDK(req, res, next) {
  const accessToken = auth.facebook.token;

  try {
    const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
    console.log('FB account authenticated');
    global.bizSdk = bizSdk;
    next();
  } catch(err) {
    return res
      .send({ 
        success: false, 
        message: 'Access Token incorrect.' 
      });
  }
}

module.exports = initFBBizSDK;