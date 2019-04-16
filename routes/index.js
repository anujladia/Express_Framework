const express = require('express');
const router = express.Router();

const authAPIToken = require('../middlewares/authAPIToken');

const authenticateUser = require('../controllers/authenticate');
const createCampaignTable = require('../controllers/campaign');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Api to check app health
router.get('/health', function(req, res, next) {
  res.render('index', { title: 'Storyxpress' });
});

router.get('/styles', authAPIToken, (req, res, next) => createCampaignTable(req, res, next));

router.get('/authenticate', (req, res, next) => authenticateUser(req, res, next));

module.exports = router;
