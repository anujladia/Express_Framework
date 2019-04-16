// Create Campaign Table in the database
function createCampaignTable(req, res, next) {
  let query = "SELECT * FROM `styles` ORDER BY id ASC"; // query database to get all the players

  // execute query
  db.query(query)
    .then(result => {
      // console.log(result);
      res.render('layout', {
        title: 'Campaign Created',
        content: result
      });
      // return;
    })
    .catch(err => {
      console.error(err);
      if (err) {
        res.redirect('/');
      }
    })
}

module.exports = createCampaignTable;
