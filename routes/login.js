var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Welcome to chat' });
   console.log(res);
});

module.exports = router;
