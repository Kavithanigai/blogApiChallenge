const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//Create initial blog blogPosts
BlogPosts.create('Dev BootCamp','Search Google for best dev bootcamps', 'KT','02/15/2018');
BlogPosts.create('JavaScript Tutorial','Search Google for JS tutorial', 'KTN');

//Send JSON representation for all blog blogPosts
router.get('/',(req,res) => {
  res.json(BlogPosts.get());
});

//when new posts are added, ensure has required fields.
// If not,log error and return 400 status code with hepful message.
// if okay, add new post, and return it with a status 201.
router.post('/', jsonParser, (req,res) =>{
  //required fields like title,content and author should be present
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for(let i=0; i<requiredFields.length; i++)
  {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(post);
});

// Delete posts (by id)!
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});

// when PUT request comes in with updated blogposts, make sure it has
// required fields. also ensure that post id in url path, and
// post id in updated post object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.updateItem` with updated post.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating post \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});



module.exports = router;
