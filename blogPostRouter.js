const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//Create initial blog blogPosts
BlogPosts.create('Dev BootCamp','Search Google for best dev bootcamps', 'KT', '02/15/2018');
BlogPosts.create('JavaScript Tutorial','Search Google for JS tutorial', 'KTN', '02/16/2018');

//Send JSON representation for all blog blogPosts
router.get('/',(req,res) => {
  res.json(BlogPosts.get());
});

module.exports = router;
