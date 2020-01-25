var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Communify : Plateforme Blockchain BigData', menuId:'home'});
});

module.exports = router;
