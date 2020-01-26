var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('analysis', {page:'Analysis', menuId:'analysis', traitements:""});
});

module.exports = router;