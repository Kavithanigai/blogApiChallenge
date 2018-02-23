const chai = require('chai');
const chaiHttp = require('chai-http');

const {app,runServer, closeServer} = require('../server');

// to add expect style syntax to our tests
const expect = chai.expect;
//to make http requests in our tests
chai.use(chaiHttp);

describe('BlogPosts', function(){
  //start server before the tests
  before(function(){
    return runServer();
  });

  //after tests are complete close server connection
  after(function(){
    return closeServer();
  });

  it('To get existing blog posts through GET', function(){
      return chai.request(app)
      .get('/blog-posts')
      .then(function(res){
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');

        //check if atleast there is one blog post
        expect(res.body.length).to.be.at.least(1);

        //each obj should have key value pairs with title, content, author, publishDate
        const expectedKeys = ['title', 'content', 'author', 'publishDate'];
          res.body.forEach(function(blog){
            expect(blog).to.be.a('object');
            expect(blog).to.include.keys(expectedKeys);
          });
        });
    });

   it('To include new blogs to the existing list through POST', function(){
     const newBlogItem = {title: 'Learning new skills', content: 'Practice makes it perfect', author: 'KTV', publishDate:'02/22/2018'};

     return chai.request(app)
     .post('/blog-posts')
     .send(newBlogItem)
     .then(function(res){
       expect(res).to.be.json;
       expect(res).to.have.status(201);
       expect(res.body).to.be.a('object');
       expect(res.body).to.include.keys('id','title', 'content', 'author', 'publishDate');
       expect(res.body.id).to.not.equal(null);

       // response should be deep equal to `newBlogItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(Object.assign(newBlogItem, {id: res.body.id}));
     });
   });

   it('To update a existing blog through PUT', function(){
     const updatePost = { title:'Learning new skills', content:'Practice and persistence makes it perfect', author: 'KTV', publishDate:'02/22/2018'};
     return chai.request(app)
     //get id first and then updated
     .get('/blog-posts')
     .then(function(res){
       updatePost.id = res.body[0].id;
       return chai.request(app)
       .put(`/blog-posts/${updatePost.id}`)
       .send(updatePost);
     })
     .then(function(res){
       expect(res).to.have.status(204);
     });
   });

   it('To delete blogs thorugh DELETE', function(){
     return chai.request(app)
     //get id to delete that blog
     .get('/blog-posts')
     .then(function(res){
       return chai.request(app)
       .delete(`/blog-posts/${res.body[0].id}`);
     })
     .then(function(res){
       expect(res).to.have.status(204);
     });
   });

});
