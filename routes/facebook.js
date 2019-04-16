const express = require('express');
const router = express.Router();

const authAPIToken = require('../middlewares/authAPIToken');
const initFBBizSDK = require('../middlewares/initFBBizSDK');

const {
  fetchAdAccountsViaFB,
  readSelectedAdAccountFB,
  storeAdAccountIdInSX,
  readFBAdAccountsViaSX
} = require('../controllers/facebook/AdAccounts');

const { setFBAccessToken, checkFBAccessToken }= require('../controllers/facebook/FBAccessToken');

router.put('/setfbaccesstoken', authAPIToken, (req, res, next) => setFBAccessToken(req, res, next));

router.get('/checkfbaccesstoken', authAPIToken, (req, res, next) => checkFBAccessToken(req, res, next));

router.get('/fecthadaccountsfb', authAPIToken, checkFBAccessToken, (req, res, next) => fetchAdAccountsViaFB(req, res, next));

router.post('/storeadaccountsx', authAPIToken, (req, res, next) => storeAdAccountIdInSX(req, res, next));

router.get('/readfbadaccountssx', authAPIToken, (req, res, next) => readFBAdAccountsViaSX(req, res, next));

router.get('/readadaccountfb', authAPIToken, initFBBizSDK, (req, res, next) => readSelectedAdAccountFB(req, res, next));

module.exports = router;
