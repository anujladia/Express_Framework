const express = require('express');
const router = express.Router();

const authAPIToken = require('../middlewares/authAPIToken');
const initFBBizSDK = require('../middlewares/initFBBizSDK');

const fetchMyData = require('../controllers/facebook/fetchpersonaldata');
const fetchCampaigns = require('../controllers/facebook/readAdAccount');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/me', authAPIToken, (req, res, next) => fetchMyData(req, res, next));

router.get('/fbcampaigns', authAPIToken, initFBBizSDK, (req, res, next) => fetchCampaigns(req, res, next));

module.exports = router;
