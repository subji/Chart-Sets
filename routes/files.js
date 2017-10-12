var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/maplot', function(req, res, next) {
	var data = null;

  fs.readFile('/data/public/node/ercsbplot/public/datas/maplot.json', 'utf8', function (err, d)	{
  	res.json(JSON.parse(d));
  });
});

router.get('/xyplot', function(req, res, next) {
	var data = null;

  fs.readFile('/data/public/node/ercsbplot/public/datas/xyplot.json', 'utf8', function (err, d)	{
  	res.json(JSON.parse(d));
  });
});

router.get('/degplot', function(req, res, next) {
	var data = null;

  fs.readFile('/data/public/node/ercsbplot/public/datas/degplot.json', 'utf8', function (err, d)	{
  	res.json(JSON.parse(d));
  });
});

router.get('/pcaplot', function(req, res, next) {
  var data = null;

  fs.readFile('/data/public/node/ercsbplot/public/datas/PCA.dat.tsv', 'utf8', function (err, d)  {
    // File data 를 보내고자 할 때는 이렇게 보내자.
    res.send(d);
  });
});


module.exports = router;
