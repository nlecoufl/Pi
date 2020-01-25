var express = require('express');
var router = express.Router();

/* GET workflow page. */
router.get('/', function(req, res, next) {
  res.render('workflow', {page:'Workflow', menuId:'workflow'});
});

module.exports = router;