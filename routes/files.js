var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/maplot', function(req, res, next) {
	var data = null;
  var dataURL = process.cwd() + '/public/datas/maplot.json';
  fs.readFile(dataURL, 'utf8', function (err, d)	{
  	res.json(JSON.parse(d));
  });
});

module.exports = router;
